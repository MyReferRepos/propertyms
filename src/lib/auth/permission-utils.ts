/**
 * Permission Utilities
 * 权限验证工具函数
 */

import { redirect } from '@tanstack/react-router'
import { useAuthStore } from './auth-store'
import { authService } from './auth-service'

/**
 * 获取用户权限代码列表
 * @returns 权限代码数组
 */
function getUserPermissionCodes(): string[] {
  return authService.getPermissionCodes()
}

/**
 * 检查用户是否拥有指定权限
 * @param permissionCode 权限代码
 * @returns 是否拥有权限
 */
export function hasPermission(permissionCode: string): boolean {
  const permissionCodes = getUserPermissionCodes()
  return permissionCodes.includes(permissionCode)
}

/**
 * 检查用户是否拥有任意一个指定权限
 * @param permissionCodes 权限代码数组
 * @returns 是否拥有任意一个权限
 */
export function hasAnyPermission(permissionCodes: string[]): boolean {
  if (permissionCodes.length === 0) return false

  const userPermissionCodes = getUserPermissionCodes()
  return permissionCodes.some((code) => userPermissionCodes.includes(code))
}

/**
 * 检查用户是否拥有所有指定权限
 * @param permissionCodes 权限代码数组
 * @returns 是否拥有所有权限
 */
export function hasAllPermissions(permissionCodes: string[]): boolean {
  if (permissionCodes.length === 0) return false

  const userPermissionCodes = getUserPermissionCodes()
  return permissionCodes.every((code) => userPermissionCodes.includes(code))
}

/**
 * 路由守卫 - 用于保护需要特定权限的路由
 * 在 TanStack Router 的 beforeLoad 中使用
 *
 * @example
 * // 在路由文件中使用
 * export const Route = createFileRoute('/_authenticated/users')({
 *   beforeLoad: async () => {
 *     requirePermission('page:users')
 *   },
 *   component: UsersPage,
 * })
 */
export function requirePermission(permissionCode: string): void {
  const { user, isAuthenticated } = useAuthStore.getState()

  // 先检查是否已认证
  if (!isAuthenticated || !user) {
    throw redirect({
      to: '/sign-in',
      search: {
        redirect: window.location.pathname,
      },
    })
  }

  // 检查权限
  if (!hasPermission(permissionCode)) {
    throw redirect({
      to: '/403',
      search: {
        message: 'You do not have permission to access this page',
      },
    })
  }
}

/**
 * 路由守卫 - 用于保护需要任意一个权限的路由
 *
 * @example
 * // 在路由文件中使用
 * export const Route = createFileRoute('/_authenticated/admin')({
 *   beforeLoad: async () => {
 *     requireAnyPermission(['page:users', 'page:settings'])
 *   },
 *   component: AdminPage,
 * })
 */
export function requireAnyPermission(permissionCodes: string[]): void {
  const { user, isAuthenticated } = useAuthStore.getState()

  // 先检查是否已认证
  if (!isAuthenticated || !user) {
    throw redirect({
      to: '/sign-in',
      search: {
        redirect: window.location.pathname,
      },
    })
  }

  // 检查权限
  if (!hasAnyPermission(permissionCodes)) {
    throw redirect({
      to: '/403',
      search: {
        message: 'You do not have permission to access this page',
      },
    })
  }
}

/**
 * 路由守卫 - 用于保护需要所有权限的路由
 *
 * @example
 * // 在路由文件中使用
 * export const Route = createFileRoute('/_authenticated/super-admin')({
 *   beforeLoad: async () => {
 *     requireAllPermissions(['page:users', 'action:users:delete'])
 *   },
 *   component: SuperAdminPage,
 * })
 */
export function requireAllPermissions(permissionCodes: string[]): void {
  const { user, isAuthenticated } = useAuthStore.getState()

  // 先检查是否已认证
  if (!isAuthenticated || !user) {
    throw redirect({
      to: '/sign-in',
      search: {
        redirect: window.location.pathname,
      },
    })
  }

  // 检查权限
  if (!hasAllPermissions(permissionCodes)) {
    throw redirect({
      to: '/403',
      search: {
        message: 'You do not have permission to access this page',
      },
    })
  }
}
