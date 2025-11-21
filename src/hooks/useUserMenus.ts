/**
 * useUserMenus Hook
 * 获取当前用户的动态菜单
 *
 * 功能：
 * - 从后端API获取用户菜单
 * - 根据用户权限过滤菜单
 * - 支持国际化翻译
 * - 缓存菜单数据
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { menuService } from '@/services/menu-service'
import type { Menu, MenuGroup } from '@/features/menu/types'
import { useI18n } from '@/lib/i18n'
import { translateMenuTree, filterVisibleMenus, sortMenus } from '@/lib/menu-utils'

export interface UserMenusResult {
  menuGroups: Array<MenuGroup & { menus: Menu[] }>
  flatMenus: Menu[]
  isLoading: boolean
  isError: boolean
  error: Error | null
}

/**
 * 获取用户侧边栏菜单
 */
export function useUserMenus(): UserMenusResult {
  const { t } = useI18n()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['userMenus', 'sidebar'],
    queryFn: async () => {
      const response = await menuService.getSidebarMenu()
      return response.menuGroups
    },
    staleTime: 5 * 60 * 1000, // 5分钟
    gcTime: 10 * 60 * 1000, // 10分钟
  })

  // 处理菜单数据
  const processedMenuGroups = useMemo(() => {
    if (!data) return []

    return data.map(group => {
      // 1. 过滤可见菜单
      let menus = filterVisibleMenus(group.menus)

      // 2. 排序菜单
      menus = sortMenus(menus)

      // 3. 翻译菜单
      menus = translateMenuTree(menus, t)

      return {
        ...group,
        menus,
      }
    })
  }, [data, t])

  // 扁平化所有菜单（用于面包屑、路由查找等）
  const flatMenus = useMemo(() => {
    const flatten = (menus: Menu[]): Menu[] => {
      return menus.reduce<Menu[]>((acc, menu) => {
        acc.push(menu)
        if (menu.children) {
          acc.push(...flatten(menu.children))
        }
        return acc
      }, [])
    }

    return processedMenuGroups.flatMap(group => flatten(group.menus))
  }, [processedMenuGroups])

  return {
    menuGroups: processedMenuGroups,
    flatMenus,
    isLoading,
    isError,
    error: error as Error | null,
  }
}

// 注意：useTopMenus 已移除，顶部导航菜单功能统一使用 useUserMenus()

/**
 * 查找当前路由对应的菜单项
 */
export function useCurrentMenu(pathname: string): Menu | undefined {
  const { flatMenus } = useUserMenus()

  return useMemo(() => {
    return flatMenus.find(menu => menu.path === pathname)
  }, [flatMenus, pathname])
}

/**
 * 获取菜单面包屑
 */
export function useMenuBreadcrumbs(menuId: string): Array<{ id: string; title: string; path?: string }> {
  const { flatMenus } = useUserMenus()
  const { t } = useI18n()

  return useMemo(() => {
    const breadcrumbs: Array<{ id: string; title: string; path?: string }> = []

    const findPath = (currentId: string): boolean => {
      const menu = flatMenus.find(m => m.id === currentId)
      if (!menu) return false

      if (menu.parentId) {
        findPath(menu.parentId)
      }

      if (!menu.hiddenInBreadcrumb) {
        breadcrumbs.push({
          id: menu.id,
          title: menu.i18nKey ? t(menu.i18nKey) : menu.title,
          path: menu.path,
        })
      }

      return true
    }

    findPath(menuId)
    return breadcrumbs
  }, [flatMenus, menuId, t])
}
