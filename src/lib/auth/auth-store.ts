/**
 * Simplified Auth Store for MVP Demo
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { User, LoginRequest, LoginResponse } from './types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<LoginResponse>
  logout: () => void
  setUser: (user: User) => void
  setTokens: (accessToken: string, refreshToken: string) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    (set) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      // Actions
      login: async (credentials: LoginRequest) => {
        // Mock login
        await new Promise((resolve) => setTimeout(resolve, 500))

        const mockUser: User = {
          id: '1',
          email: credentials.email,
          username: 'Property Manager',
          displayName: 'Demo Property Manager',
          status: 'active',
          createdAt: new Date().toISOString(),
        }

        const response: LoginResponse = {
          user: mockUser,
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        }

        set({
          user: mockUser,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          isAuthenticated: true,
        })

        // Also save to localStorage
        localStorage.setItem('access_token', response.accessToken)
        localStorage.setItem('refresh_token', response.refreshToken)
        localStorage.setItem('user', JSON.stringify(mockUser))

        return response
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })

        // Clear localStorage
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
      },

      setUser: (user: User) => {
        set({ user })
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        })
      },
    }),
    { name: 'auth-store' },
  ),
)
