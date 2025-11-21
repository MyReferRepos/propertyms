/**
 * Menu Service
 * 菜单服务 - 从后端API获取动态菜单配置
 */

import { http } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/config'
import type { Menu, MenuGroup } from '@/features/menu/types'

/**
 * 侧边栏菜单响应类型（新格式）
 */
export interface SidebarMenuResponse {
  menuGroups: Array<MenuGroup & { menus: Menu[] }>
}

/**
 * 菜单API响应类型（旧格式 - 向后兼容）
 * @deprecated 使用 SidebarMenuResponse 替代
 */
export interface MenuApiResponse {
  user: {
    name: string
    email: string
    avatar: string
  }
  navGroups: Array<{
    title: string
    items: Array<{
      title: string
      url?: string
      icon?: string
      badge?: string
      permission?: string | string[]
      role?: string | string[]
      items?: Array<{
        title: string
        url: string
        icon?: string
        badge?: string
        permission?: string | string[]
        role?: string | string[]
      }>
    }>
  }>
}

class MenuService {
  /**
   * 获取用户的侧边栏菜单（新格式）
   * 后端会根据用户权限返回已过滤的菜单
   */
  async getSidebarMenu(): Promise<SidebarMenuResponse> {
    const response: any = await http.get(API_ENDPOINTS.menus.sidebar)
    return response.data
  }

  // 注意：顶部导航菜单功能已移除，统一使用 getSidebarMenu()

  /**
   * 从localStorage获取缓存的菜单数据
   */
  getCachedMenus(): Menu[] {
    try {
      const menus = localStorage.getItem('menus')
      return menus ? JSON.parse(menus) : []
    } catch {
      return []
    }
  }
}

export const menuService = new MenuService()
