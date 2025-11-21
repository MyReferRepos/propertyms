/**
 * Navigation Filtering Utilities
 * 导航过滤工具 - 根据用户权限和角色过滤导航菜单
 */

import type { NavGroup, NavItem } from '../types'
import type { User } from '@/lib/auth/types'
import { hasPermission as checkPermission } from '@/lib/auth'

/**
 * 检查用户是否拥有指定的权限
 * @param permission 权限代码（支持单个或数组）
 * @returns 是否拥有权限
 */
function hasPermission(permission?: string | string[]): boolean {
  // 如果未设置权限要求，默认允许访问
  if (!permission) return true

  // 支持字符串数组形式的权限（满足任一即可）
  if (Array.isArray(permission)) {
    return permission.some(p => checkPermission(p))
  }

  // 单个权限检查
  return checkPermission(permission)
}

/**
 * 检查用户是否拥有指定的角色
 * @param user 当前用户
 * @param role 角色代码（支持单个或数组）
 * @returns 是否拥有角色
 */
function hasRole(user: User | null, role?: string | string[]): boolean {
  // 如果未设置角色要求，默认允许访问
  if (!role) return true

  // 用户未登录或没有角色
  if (!user || !user.roles || user.roles.length === 0) {
    return false
  }

  // 获取用户的角色代码列表
  const userRoleCodes = user.roles.map(r => typeof r === 'string' ? r : r.code)

  // 支持字符串数组形式的角色（满足任一即可）
  if (Array.isArray(role)) {
    return role.some(r => userRoleCodes.includes(r))
  }

  // 单个角色检查
  return userRoleCodes.includes(role)
}

/**
 * 检查用户是否有权访问导航项
 * @param user 当前用户
 * @param item 导航项
 * @returns 是否有权访问
 */
function canAccessNavItem(
  user: User | null,
  item: NavItem | (NavItem['items'] extends Array<infer U> ? U : never)
): boolean {
  const hasRequiredPermission = hasPermission(item.permission)
  const hasRequiredRole = hasRole(user, item.role)

  // 必须同时满足权限和角色要求
  return hasRequiredPermission && hasRequiredRole
}

/**
 * 过滤导航项（递归处理子项）
 * @param items 导航项列表
 * @param user 当前用户
 * @returns 过滤后的导航项列表
 */
function filterNavItems(items: NavItem[], user: User | null): NavItem[] {
  return items.reduce<NavItem[]>((acc, item) => {
    // 检查当前项是否有权访问
    if (!canAccessNavItem(user, item)) {
      return acc
    }

    // 如果有子项，递归过滤
    if ('items' in item && item.items && item.items.length > 0) {
      const filteredSubItems = item.items.filter(subItem =>
        canAccessNavItem(user, subItem)
      )

      // 只有当有可访问的子项时才保留父项
      if (filteredSubItems.length > 0) {
        acc.push({
          ...item,
          items: filteredSubItems,
        })
      }
    } else {
      // 无子项的直接链接
      acc.push(item)
    }

    return acc
  }, [])
}

/**
 * 根据用户权限过滤导航组
 * @param navGroups 导航组列表
 * @param user 当前用户
 * @returns 过滤后的导航组列表
 */
export function filterNavigation(navGroups: NavGroup[], user: User | null): NavGroup[] {
  return navGroups.reduce<NavGroup[]>((acc, group) => {
    // 过滤导航组内的所有项
    const filteredItems = filterNavItems(group.items, user)

    // 只保留有可访问项的导航组
    if (filteredItems.length > 0) {
      acc.push({
        ...group,
        items: filteredItems,
      })
    }

    return acc
  }, [])
}
