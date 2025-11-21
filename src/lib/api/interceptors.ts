/**
 * API Interceptors
 * 请求和响应拦截器
 */

import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios'
import { toast } from 'sonner'

import { authService } from '@/lib/auth/auth-service'
import { isTokenExpired, isTokenExpiringSoon } from '@/lib/auth/jwt-utils'

import type { ApiError, ApiResponse } from './types'

// 用于防止并发刷新 token
let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

/**
 * 请求拦截器
 */
export function setupRequestInterceptor(instance: AxiosInstance) {
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const requestUrl = config.url || ''

      // 登录、注册、刷新token等认证请求不需要添加token
      const isAuthRequest = requestUrl.includes('/auth/login') ||
                           requestUrl.includes('/auth/register') ||
                           requestUrl.includes('/auth/refresh') ||
                           requestUrl.includes('/auth/forgot-password') ||
                           requestUrl.includes('/auth/reset-password')

      // 添加认证token（除了认证相关的请求）
      if (!isAuthRequest) {
        let token = authService.getAccessToken()

        // 检查 token 是否过期或即将过期
        if (token && (isTokenExpired(token) || isTokenExpiringSoon(token, 60))) {
          // token 已过期或即将在 1 分钟内过期，尝试刷新
          const refreshToken = authService.getRefreshToken()
          if (refreshToken) {
            try {
              // 使用防并发机制刷新 token
              if (isRefreshing) {
                // 等待正在进行的刷新完成
                token = await refreshPromise
              } else {
                isRefreshing = true
                refreshPromise = authService.refreshToken()
                token = await refreshPromise
                isRefreshing = false
                refreshPromise = null
              }
            } catch (error) {
              isRefreshing = false
              refreshPromise = null
              // 刷新失败，清除认证并跳转登录
              authService.clearAuth()
              if (!window.location.pathname.includes('/sign-in')) {
                window.location.href = '/sign-in'
              }
              throw error
            }
          }
        }

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}

/**
 * 响应拦截器
 */
export function setupResponseInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => {
      // 统一处理响应数据
      const data = response.data as ApiResponse

      // 如果响应表明请求不成功，抛出错误
      if (data.success === false) {
        const errorMessage = data.error?.message || data.message || '请求失败'
        const error = new Error(errorMessage) as Error & {
          code?: string | number
          details?: unknown
        }
        error.code = data.error?.code || data.code
        error.details = data.error?.details
        throw error
      }

      return response
    },
    async (error: AxiosError<ApiError>) => {
      // 处理不同的错误状态码
      if (error.response) {
        const { status, data } = error.response

        switch (status) {
          case 401: {
            // 未授权 - 尝试刷新token
            const originalRequest = error.config
            const requestUrl = originalRequest?.url || ''

            // 不尝试刷新token的情况：
            // 1. 登录请求本身
            // 2. 刷新token请求本身
            // 3. 已经重试过的请求
            // 4. 用户本身就没有token（未登录）
            const isLoginRequest = requestUrl.includes('/auth/login')
            const isRefreshRequest = requestUrl.includes('/auth/refresh')
            const hasRetried = originalRequest?.headers?.['X-Retry']
            const hasRefreshToken = authService.getRefreshToken()

            if (isLoginRequest || isRefreshRequest || hasRetried || !hasRefreshToken) {
              // 登录请求的401错误由组件层处理，不显示通用toast
              if (!isLoginRequest) {
                toast.error('认证失败，请重新登录')
              }
              // 不尝试刷新，直接返回错误
              break
            }

            // 尝试刷新token（使用防并发机制）
            if (originalRequest) {
              try {
                let newToken: string | null

                if (isRefreshing) {
                  // 等待正在进行的刷新完成
                  newToken = await refreshPromise
                } else {
                  isRefreshing = true
                  refreshPromise = authService.refreshToken()
                  newToken = await refreshPromise
                  isRefreshing = false
                  refreshPromise = null
                }

                if (newToken && originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${newToken}`
                  originalRequest.headers['X-Retry'] = 'true'
                  return instance.request(originalRequest)
                }
              } catch (refreshError) {
                isRefreshing = false
                refreshPromise = null
                // token刷新失败，清除认证信息并跳转到登录页
                authService.clearAuth()
                toast.error('会话已过期，请重新登录')
                // 只有在不是登录页面时才跳转
                if (!window.location.pathname.includes('/sign-in')) {
                  window.location.href = '/sign-in'
                }
              }
            }
            break
          }

          case 403:
            toast.error('没有权限访问该资源')
            break

          case 404:
            toast.error('请求的资源不存在')
            break

          case 500:
            toast.error('服务器错误，请稍后重试')
            break

          case 503:
            toast.error('服务暂时不可用，请稍后重试')
            break

          default:
            toast.error(data?.message || '请求失败，请稍后重试')
        }
      } else if (error.request) {
        // 请求已发送但没有收到响应
        toast.error('网络错误，请检查您的网络连接')
      } else {
        // 其他错误
        toast.error(error.message || '发生未知错误')
      }

      return Promise.reject(error)
    }
  )
}
