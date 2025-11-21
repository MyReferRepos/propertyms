/**
 * Auth Store
 * 使用Zustand管理认证状态
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { authService } from './auth-service'
import type { AuthState, LoginRequest, User } from './types'

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  refreshUser: () => Promise<void>
  clearAuth: () => void
}

type AuthStore = AuthState & AuthActions

/**
 * 认证Store
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      // 状态
      user: authService.getStoredUser(),
      accessToken: authService.getAccessToken(),
      refreshToken: authService.getRefreshToken(),
      isAuthenticated: authService.isAuthenticated(),

      // 动作
      login: async (credentials: LoginRequest) => {
        const response = await authService.login(credentials)
        set({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          isAuthenticated: true,
        })
        // 权限已在 authService.login 中保存到 localStorage
      },

      logout: async () => {
        await authService.logout()
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user })
      },

      refreshUser: async () => {
        const authProfile = await authService.getCurrentUser()
        if (authProfile) {
          set({ user: authProfile.user })
        }
      },

      clearAuth: () => {
        authService.clearAuth()
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },
    }),
    { name: 'auth-store' }
  )
)
