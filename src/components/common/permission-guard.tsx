/**
 * Permission Guard Component
 * 权限守卫组件 - 用于条件渲染需要权限的UI元素
 */

import type { ReactNode } from 'react'
import { usePermission, useHasAnyPermission, useHasAllPermissions } from '@/hooks/use-permission'

interface PermissionGuardProps {
  /** 子组件 */
  children: ReactNode
  /** 需要的单个权限代码 */
  permission?: string
  /** 需要的多个权限代码（满足任意一个） */
  anyPermission?: string[]
  /** 需要的多个权限代码（必须全部满足） */
  allPermissions?: string[]
  /** 没有权限时显示的内容，默认不显示任何内容 */
  fallback?: ReactNode
}

/**
 * 权限守卫组件
 *
 * @example
 * // 单个权限检查
 * <PermissionGuard permission="action:users:create">
 *   <Button>Create User</Button>
 * </PermissionGuard>
 *
 * @example
 * // 多个权限检查（任意一个）
 * <PermissionGuard anyPermission={['action:users:update', 'action:users:delete']}>
 *   <Button>Edit or Delete</Button>
 * </PermissionGuard>
 *
 * @example
 * // 多个权限检查（全部）
 * <PermissionGuard allPermissions={['page:users', 'action:users:view']}>
 *   <UserList />
 * </PermissionGuard>
 *
 * @example
 * // 带fallback
 * <PermissionGuard permission="action:users:delete" fallback={<span>No permission</span>}>
 *   <Button variant="destructive">Delete</Button>
 * </PermissionGuard>
 */
export function PermissionGuard({
  children,
  permission,
  anyPermission,
  allPermissions,
  fallback = null,
}: PermissionGuardProps) {
  const hasSinglePermission = usePermission(permission)
  const hasAny = useHasAnyPermission(anyPermission || [])
  const hasAll = useHasAllPermissions(allPermissions || [])

  // 确定是否有权限
  let hasPermission = false

  if (permission) {
    hasPermission = hasSinglePermission
  } else if (anyPermission && anyPermission.length > 0) {
    hasPermission = hasAny
  } else if (allPermissions && allPermissions.length > 0) {
    hasPermission = hasAll
  } else {
    // 如果没有指定任何权限检查，默认显示
    hasPermission = true
  }

  if (!hasPermission) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
