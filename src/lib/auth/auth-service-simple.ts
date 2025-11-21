/**
 * Simplified Auth Service for MVP Demo
 */

import type { LoginRequest, LoginResponse, User } from './types'

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
}

class SimpleAuthService {
  // Mock login - for demo purposes
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock user data
    const mockUser: User = {
      id: '1',
      email: credentials.email,
      username: 'Property Manager',
      displayName: 'Demo Property Manager',
      status: 'active',
      createdAt: new Date().toISOString(),
    }

    const mockResponse: LoginResponse = {
      user: mockUser,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    }

    // Store in localStorage
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, mockResponse.accessToken)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, mockResponse.refreshToken)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockResponse.user))

    return mockResponse
  }

  async logout(): Promise<void> {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  }

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  }

  getStoredUser(): User | null {
    const userStr = localStorage.setItem(STORAGE_KEYS.USER)
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }

  clearAuth(): void {
    this.logout()
  }
}

export const authService = new SimpleAuthService()
