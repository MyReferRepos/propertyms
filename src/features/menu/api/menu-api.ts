/**
 * Menu Management API
 * 菜单管理API服务
 */

import { http } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/config'
import type {
  MenuGroup,
  MenuGroupFormData,
  Menu,
  MenuFormData,
  MenuQueryParams,
  PaginatedResponse,
  MenuTreeNode,
} from '../types'

/**
 * 菜单组API服务
 */
export class MenuGroupApi {
  /**
   * 获取菜单组列表
   */
  async list(params?: MenuQueryParams): Promise<PaginatedResponse<MenuGroup>> {
    const response: any = await http.get(
      API_ENDPOINTS.menuGroups.list,
      { params }
    )
    // 适配后端响应格式: {success: true, data: [...]}
    // 转换为前端期望的格式: {items: [...], total: number}
    const data = response.data
    if (Array.isArray(data)) {
      return {
        items: data,
        total: data.length,
        page: 1,
        pageSize: data.length,
        totalPages: 1
      }
    }
    return data
  }

  /**
   * 获取单个菜单组详情
   */
  async get(id: string): Promise<MenuGroup> {
    const response: any = await http.get(API_ENDPOINTS.menuGroups.detail(id))
    return response.data
  }

  /**
   * 创建菜单组
   */
  async create(data: MenuGroupFormData): Promise<MenuGroup> {
    const response: any = await http.post(API_ENDPOINTS.menuGroups.create, data)
    return response.data
  }

  /**
   * 更新菜单组
   */
  async update(id: string, data: MenuGroupFormData): Promise<MenuGroup> {
    const response: any = await http.put(API_ENDPOINTS.menuGroups.update(id), data)
    return response.data
  }

  /**
   * 删除菜单组
   */
  async delete(id: string): Promise<void> {
    await http.delete(API_ENDPOINTS.menuGroups.delete(id))
  }

  /**
   * 批量删除菜单组
   */
  async batchDelete(ids: string[]): Promise<void> {
    await http.post(API_ENDPOINTS.menuGroups.batchDelete, { ids })
  }
}

/**
 * 菜单API服务（新版 - 统一菜单表）
 */
export class MenuApi {
  /**
   * 获取菜单列表
   */
  async list(params?: MenuQueryParams): Promise<PaginatedResponse<Menu>> {
    const response: any = await http.get(
      API_ENDPOINTS.menus.list,
      { params }
    )
    return response.data
  }

  /**
   * 获取菜单树形结构
   */
  async tree(params?: MenuQueryParams): Promise<MenuTreeNode[]> {
    const response: any = await http.get(
      API_ENDPOINTS.menus.tree,
      { params }
    )
    // 适配后端响应格式
    return response.data || []
  }

  /**
   * 获取单个菜单详情
   */
  async get(id: string): Promise<Menu> {
    const response: any = await http.get(API_ENDPOINTS.menus.detail(id))
    return response.data
  }

  /**
   * 创建菜单
   */
  async create(data: MenuFormData): Promise<Menu> {
    const response: any = await http.post(API_ENDPOINTS.menus.create, data)
    return response.data
  }

  /**
   * 更新菜单
   */
  async update(id: string, data: MenuFormData): Promise<Menu> {
    const response: any = await http.put(API_ENDPOINTS.menus.update(id), data)
    return response.data
  }

  /**
   * 删除菜单
   */
  async delete(id: string): Promise<void> {
    await http.delete(API_ENDPOINTS.menus.delete(id))
  }

  /**
   * 批量删除菜单
   */
  async batchDelete(ids: string[]): Promise<void> {
    await http.post(API_ENDPOINTS.menus.batchDelete, { ids })
  }

  /**
   * 更新菜单排序（使用PUT方法）
   */
  async updateSort(items: Array<{ id: string; sortOrder: number }>): Promise<void> {
    await http.put(API_ENDPOINTS.menus.updateSort, { items })
  }
}

/**
 * 菜单项API服务（旧版 - 向后兼容）
 * @deprecated 使用 MenuApi 替代
 */
export class MenuItemApi {
  /**
   * 获取菜单项列表
   */
  async list(params?: MenuQueryParams): Promise<PaginatedResponse<Menu>> {
    const response: any = await http.get(
      API_ENDPOINTS.menus.list,
      { params }
    )
    return response.data
  }

  /**
   * 获取菜单树形结构
   */
  async tree(params?: MenuQueryParams): Promise<MenuTreeNode[]> {
    const response: any = await http.get(
      API_ENDPOINTS.menus.tree,
      { params }
    )
    // 适配后端响应格式
    return response.data || []
  }

  /**
   * 获取单个菜单项详情
   */
  async get(id: string): Promise<Menu> {
    const response: any = await http.get(API_ENDPOINTS.menus.detail(id))
    return response.data
  }

  /**
   * 创建菜单项
   */
  async create(data: MenuFormData): Promise<Menu> {
    const response: any = await http.post(API_ENDPOINTS.menus.create, data)
    return response.data
  }

  /**
   * 更新菜单项
   */
  async update(id: string, data: MenuFormData): Promise<Menu> {
    const response: any = await http.put(API_ENDPOINTS.menus.update(id), data)
    return response.data
  }

  /**
   * 删除菜单项
   */
  async delete(id: string): Promise<void> {
    await http.delete(API_ENDPOINTS.menus.delete(id))
  }

  /**
   * 批量删除菜单项
   */
  async batchDelete(ids: string[]): Promise<void> {
    await http.post(API_ENDPOINTS.menus.batchDelete, { ids })
  }

  /**
   * 更新菜单项排序
   */
  async updateSort(items: Array<{ id: string; sortOrder: number }>): Promise<void> {
    await http.put(API_ENDPOINTS.menus.updateSort, { items })
  }
}

// 导出单例
export const menuGroupApi = new MenuGroupApi()
export const menuApi = new MenuApi()
export const menuItemApi = new MenuItemApi() // 保留以向后兼容
