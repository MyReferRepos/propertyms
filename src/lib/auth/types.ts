/**
 * Auth Types - Simplified for MVP
 */

export interface User {
  id: string
  email: string
  username: string
  phone?: string
  avatar?: string
  firstName?: string
  lastName?: string
  displayName?: string
  status: string
  lastLoginAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface LoginRequest {
  email: string
  password: string
  remember?: boolean
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
  confirmPassword: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}
