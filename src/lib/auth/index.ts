/**
 * Auth Module Entry
 * 认证模块入口文件
 */

export { authService } from './auth-service'
export { useAuthStore } from './auth-store'
export { tokenStorage, userStorage } from './storage'
export {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
} from './permission-utils'
export type {
  AuthState,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  User,
} from './types'
