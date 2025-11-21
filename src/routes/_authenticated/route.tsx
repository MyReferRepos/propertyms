import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/lib/auth'
import { authService } from '@/lib/auth/auth-service'
import { isTokenExpired, isTokenExpiringSoon } from '@/lib/auth/jwt-utils'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const { isAuthenticated } = useAuthStore.getState()

    if (!isAuthenticated) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: window.location.pathname,
        },
      })
    }

    // 检查 access token 是否过期或即将过期
    const accessToken = authService.getAccessToken()
    const refreshToken = authService.getRefreshToken()

    if (accessToken && refreshToken) {
      // 如果 token 已过期或即将在 5 分钟内过期，主动刷新
      if (isTokenExpired(accessToken) || isTokenExpiringSoon(accessToken, 5 * 60)) {
        try {
          // 静默刷新 token
          await authService.refreshToken()
        } catch (error) {
          // 刷新失败，清除认证并重定向到登录页
          authService.clearAuth()
          throw redirect({
            to: '/sign-in',
            search: {
              redirect: window.location.pathname,
            },
          })
        }
      }
    }
  },
  component: AuthenticatedLayout,
})
