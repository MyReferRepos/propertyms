/**
 * Auth Service
 * 认证服务，处理登录、登出、token刷新等
 */

import { http } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/config'
import { tokenStorage, userStorage } from './storage'
import type {
  AuthProfile,
  LoginRequest,
  LoginResponse,
  Permission,
  RegisterRequest,
  User,
} from './types'

/**
 * 认证服务类
 */
class AuthService {
  /**
   * 登录
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: any = await http.post(
      API_ENDPOINTS.auth.login,
      credentials
    )

    if (response.success && response.data) {
      // 适配后端响应：后端返回 token，前端期望 accessToken
      const token = response.data.token || response.data.accessToken
      const refreshToken = response.data.refreshToken

      // 保存token和用户信息
      tokenStorage.setAccessToken(token)
      tokenStorage.setRefreshToken(refreshToken)
      userStorage.setUser(response.data.user)

      // 保存权限（登录时直接返回）
      if (response.data.permissions) {
        localStorage.setItem('permissions', JSON.stringify(response.data.permissions))
      }

      // 保存菜单（如果返回）
      if (response.data.menus) {
        localStorage.setItem('menus', JSON.stringify(response.data.menus))
      }

      // 标准化返回格式，确保返回accessToken字段
      return {
        ...response.data,
        accessToken: token,
      }
    }

    return response.data
  }

  /**
   * 注册
   */
  async register(data: RegisterRequest): Promise<User> {
    const response = await http.post<User>(API_ENDPOINTS.auth.register, data)
    return response.data
  }

  /**
   * 登出
   */
  async logout(): Promise<void> {
    try {
      // 调用后端登出接口
      await http.post(API_ENDPOINTS.auth.logout)
    } finally {
      // 清除本地存储
      this.clearAuth()
    }
  }

  /**
   * 刷新Token
   */
  async refreshToken(): Promise<string | null> {
    const refreshToken = tokenStorage.getRefreshToken()
    if (!refreshToken) {
      return null
    }

    try {
      const response: any = await http.post(
        API_ENDPOINTS.auth.refresh,
        { refreshToken }
      )

      if (response.success && response.data) {
        // 适配后端响应：后端可能返回 token 或 accessToken
        const newAccessToken = response.data.token || response.data.accessToken
        const newRefreshToken = response.data.refreshToken

        // 更新token
        tokenStorage.setAccessToken(newAccessToken)
        tokenStorage.setRefreshToken(newRefreshToken)
        return newAccessToken
      }
    } catch (error) {
      this.clearAuth()
    }

    return null
  }

  /**
   * 获取当前用户信息（包含权限和菜单）
   */
  async getCurrentUser(): Promise<AuthProfile | null> {
    try {
      const response = await http.get<AuthProfile>(API_ENDPOINTS.auth.profile)
      if (response.success && response.data) {
        const { user, permissions, menus } = response.data

        // 分别存储用户信息、权限和菜单
        userStorage.setUser(user)
        localStorage.setItem('permissions', JSON.stringify(permissions))
        localStorage.setItem('menus', JSON.stringify(menus))

        return response.data
      }
    } catch (error) {
      // Silently fail and return null
    }
    return null
  }

  /**
   * 获取访问令牌
   */
  getAccessToken(): string | null {
    return tokenStorage.getAccessToken()
  }

  /**
   * 获取刷新令牌
   */
  getRefreshToken(): string | null {
    return tokenStorage.getRefreshToken()
  }

  /**
   * 获取本地存储的用户信息
   */
  getStoredUser(): User | null {
    return userStorage.getUser<User>()
  }

  /**
   * 检查是否已认证
   */
  isAuthenticated(): boolean {
    return !!tokenStorage.getAccessToken()
  }

  /**
   * 清除认证信息
   */
  clearAuth(): void {
    tokenStorage.clearTokens()
    userStorage.removeUser()
    localStorage.removeItem('permissions')
    localStorage.removeItem('menus')
  }

  /**
   * 获取用户权限对象列表
   */
  getPermissions(): Permission[] {
    try {
      const permissions = localStorage.getItem('permissions')
      return permissions ? JSON.parse(permissions) : []
    } catch {
      return []
    }
  }

  /**
   * 获取用户权限码列表（用于向后兼容）
   */
  getPermissionCodes(): string[] {
    return this.getPermissions().map(p => p.code)
  }

  /**
   * 检查权限
   */
  hasPermission(permissionCode: string): boolean {
    const permissionCodes = this.getPermissionCodes()
    return permissionCodes.includes(permissionCode)
  }

  /**
   * 检查多个权限（OR逻辑 - 满足任一权限即可）
   */
  hasAnyPermission(permissionCodes: string[]): boolean {
    const userPermissionCodes = this.getPermissionCodes()
    return permissionCodes.some(p => userPermissionCodes.includes(p))
  }

  /**
   * 检查多个权限（AND逻辑 - 必须满足所有权限）
   */
  hasAllPermissions(permissionCodes: string[]): boolean {
    const userPermissionCodes = this.getPermissionCodes()
    return permissionCodes.every(p => userPermissionCodes.includes(p))
  }

  /**
   * 检查角色
   */
  hasRole(roleCode: string): boolean {
    const user = this.getStoredUser()
    if (!user?.roles) return false

    // 支持 Role[] 和 string[] 两种格式
    if (typeof user.roles[0] === 'string') {
      return (user.roles as string[]).includes(roleCode)
    }

    return (user.roles as any[]).some((role: any) => role.code === roleCode)
  }
}

// 导出单例
export const authService = new AuthService()
