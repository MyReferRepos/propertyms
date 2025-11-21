/**
 * Auth Types
 * 认证相关类型定义
 */

import type { Menu } from '../../features/menu/types'
import type { Role, Permission as UserPermission } from '../../features/users/types'

// 重新导出 Permission 类型
export type Permission = UserPermission

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
  roles?: Role[] | string[]
  department?: string
  position?: string
  lastLoginAt?: string
  lastLoginIp?: string
  createdAt?: string
  updatedAt?: string
  // [key: string]: unknown
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
  permissions: Permission[]  // 登录时直接返回权限对象列表
  menus?: Menu[]            // 可选：用户菜单列表
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

/**
 * 认证配置响应（来自 /api/auth/profile）
 */
export interface AuthProfile {
  user: User
  permissions: Permission[]  // 权限对象列表
  menus: Menu[]             // 用户菜单列表（已过滤）
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}
