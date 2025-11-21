/**
 * Menu Filtering Utilities
 * 菜单过滤工具函数 - 根据权限过滤菜单项
 */

import type { NavGroup, NavItem, NavLink, NavCollapsible } from '@/components/layout/types'
import { hasPermission } from './permission-utils'

/**
 * 检查单个菜单项是否有权限访问
 * @param item 菜单项
 * @returns 是否有权限
 */
function hasItemPermission(item: NavItem): boolean {
  // 如果没有 permission 字段，默认允许访问（向后兼容）
  if (!item.permission) return true

  // 检查用户是否有该权限
  // permission可能是string或string[]，处理两种情况
  if (typeof item.permission === 'string') {
    return hasPermission(item.permission)
  }

  // 如果是数组，检查是否有任意一个权限
  return item.permission.some(p => hasPermission(p))
}

/**
 * 过滤单个导航链接项
 * @param item 导航链接项
 * @returns 如果有权限返回原项，否则返回 null
 */
function filterNavLink(item: NavLink): NavLink | null {
  return hasItemPermission(item) ? item : null
}

/**
 * 过滤可折叠导航项（有子菜单）
 * @param item 可折叠导航项
 * @returns 过滤后的导航项，如果所有子项都无权限则返回 null
 */
function filterNavCollapsible(item: NavCollapsible): NavCollapsible | null {
  // 过滤子项
  const filteredSubItems = item.items
    .map((subItem) => filterNavLink(subItem))
    .filter((subItem): subItem is NavLink => subItem !== null)

  // 如果没有可见的子项，隐藏整个父项
  if (filteredSubItems.length === 0) return null

  // 返回包含过滤后子项的父项
  return {
    ...item,
    items: filteredSubItems,
  }
}

/**
 * 过滤菜单项（可能是链接或可折叠项）
 * @param item 菜单项
 * @returns 过滤后的菜单项，如果无权限则返回 null
 */
function filterNavItem(item: NavItem): NavItem | null {
  // 如果有子项，按可折叠项处理
  if ('items' in item && item.items) {
    return filterNavCollapsible(item as NavCollapsible)
  }

  // 否则按链接处理
  return filterNavLink(item as NavLink)
}

/**
 * 过滤导航组
 * @param navGroup 导航组
 * @returns 过滤后的导航组，如果所有项都无权限则返回 null
 */
function filterNavGroup(navGroup: NavGroup): NavGroup | null {
  // 过滤组内的所有项
  const filteredItems = navGroup.items
    .map((item) => filterNavItem(item))
    .filter((item): item is NavItem => item !== null)

  // 如果组内没有可见项，隐藏整个组
  if (filteredItems.length === 0) return null

  // 返回包含过滤后项的组
  return {
    ...navGroup,
    items: filteredItems,
  }
}

/**
 * 根据用户权限过滤菜单数据
 *
 * 过滤规则：
 * 1. 如果菜单项没有 permission 字段，默认显示（向后兼容）
 * 2. 如果菜单项有 permission 字段，检查用户是否有该权限
 * 3. 对于有子菜单的项：
 *    - 过滤所有子项
 *    - 如果所有子项都无权限，隐藏父项
 *    - 如果至少有一个子项有权限，显示父项及有权限的子项
 * 4. 对于菜单组：
 *    - 如果组内所有项都无权限，隐藏整个组
 *
 * @param navGroups 导航组数组
 * @returns 过滤后的导航组数组
 *
 * @example
 * const filteredNavGroups = filterMenuByPermissions(navGroups)
 */
export function filterMenuByPermissions(navGroups: NavGroup[]): NavGroup[] {
  return navGroups
    .map((group) => filterNavGroup(group))
    .filter((group): group is NavGroup => group !== null)
}
