/**
 * Permission Guard Component
 * 基于权限显示/隐藏组件
 */

import type { ReactNode } from 'react'

import { useAuthStore, hasPermission } from '@/lib/auth'

interface PermissionGuardProps {
  children: ReactNode
  permission?: string
  role?: string
  fallback?: ReactNode
}

/**
 * 权限守卫组件
 * 根据权限或角色控制内容显示
 */
export function PermissionGuard({
  children,
  permission,
  role,
  fallback = null,
}: PermissionGuardProps) {
  const { user } = useAuthStore()

  // 检查角色
  if (role && user?.roles) {
    const hasRole = Array.isArray(user.roles)
      ? user.roles.some(r => (typeof r === 'string' ? r === role : r.code === role))
      : false
    if (!hasRole) {
      return <>{fallback}</>
    }
  }

  // 检查权限
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
