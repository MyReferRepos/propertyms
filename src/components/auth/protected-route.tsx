/**
 * Protected Route Component
 * 保护需要认证的路由
 */

import { Navigate, useLocation } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { useAuthStore, hasPermission } from '@/lib/auth'

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermission?: string
  requiredRole?: string
  fallbackPath?: string
}

/**
 * 受保护的路由组件
 */
export function ProtectedRoute({
  children,
  requiredPermission,
  requiredRole,
  fallbackPath = '/sign-in',
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  // 未登录，重定向到登录页
  if (!isAuthenticated) {
    return (
      <Navigate
        to={fallbackPath}
        search={{
          redirect: location.pathname,
        }}
      />
    )
  }

  // 检查角色权限
  if (requiredRole && user?.roles) {
    const hasRole = Array.isArray(user.roles)
      ? user.roles.some(r => (typeof r === 'string' ? r === requiredRole : r.code === requiredRole))
      : false
    if (!hasRole) {
      return (
        <Navigate
          to="/403"
          search={{
            message: 'You do not have permission to access this page',
          }}
        />
      )
    }
  }

  // 检查具体权限
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Navigate
        to="/403"
        search={{
          message: 'You do not have permission to access this page',
        }}
      />
    )
  }

  return <>{children}</>
}
