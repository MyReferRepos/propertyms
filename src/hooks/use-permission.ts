/**
 * Permission Hooks
 * 权限验证相关的 React Hooks
 */

import { useMemo } from 'react'
import { useAuthStore } from '@/lib/auth/auth-store'
import { authService } from '@/lib/auth/auth-service'

/**
 * 检查用户是否拥有指定权限
 * @param permissionCode 权限代码，如 'user:view' 或 'user:create'
 * @returns 是否拥有该权限
 */
export function usePermission(permissionCode: string | undefined): boolean {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useMemo(() => {
    if (!isAuthenticated || !permissionCode) return false

    const permissionCodes = authService.getPermissionCodes()
    return permissionCodes.includes(permissionCode)
  }, [isAuthenticated, permissionCode])
}

/**
 * 检查用户是否拥有任意一个指定权限
 * @param permissionCodes 权限代码数组
 * @returns 是否拥有任意一个权限
 */
export function useHasAnyPermission(permissionCodes: string[]): boolean {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useMemo(() => {
    if (!isAuthenticated || !permissionCodes || permissionCodes.length === 0) return false

    const userPermissionCodes = authService.getPermissionCodes()
    return permissionCodes.some((code) => userPermissionCodes.includes(code))
  }, [isAuthenticated, permissionCodes])
}

/**
 * 检查用户是否拥有所有指定权限
 * @param permissionCodes 权限代码数组
 * @returns 是否拥有所有权限
 */
export function useHasAllPermissions(permissionCodes: string[]): boolean {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useMemo(() => {
    if (!isAuthenticated || !permissionCodes || permissionCodes.length === 0) return false

    const userPermissionCodes = authService.getPermissionCodes()
    return permissionCodes.every((code) => userPermissionCodes.includes(code))
  }, [isAuthenticated, permissionCodes])
}

/**
 * 获取用户的所有权限代码
 * @returns 权限代码数组
 */
export function useUserPermissions(): string[] {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useMemo(() => {
    if (!isAuthenticated) return []
    return authService.getPermissionCodes()
  }, [isAuthenticated])
}

/**
 * 检查用户是否拥有指定资源的访问权限
 * @param resource 资源名，如 'user'
 * @param action 操作名，如 'view'
 * @returns 是否拥有操作权限
 * @example
 * const canViewUsers = useHasResourcePermission('user', 'view') // 检查 'user:view'
 * const canCreateRoles = useHasResourcePermission('role', 'create') // 检查 'role:create'
 */
export function useHasResourcePermission(resource: string, action: string): boolean {
  const permissionCode = `${resource}:${action}`
  return usePermission(permissionCode)
}
