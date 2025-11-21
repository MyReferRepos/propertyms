/**
 * Permission Management Service
 * 权限管理服务
 */

import { http } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/config'

import type { Permission, PermissionTree, CreatePermissionRequest, UpdatePermissionRequest } from '../types'

/**
 * 权限服务类
 */
class PermissionService {
  /**
   * 获取所有权限列表（不分页）
   */
  async getPermissions(): Promise<Permission[]> {
    // http.get已经返回了ApiResponse，所以response就是 { success, data, message }
    const response = await http.get<Permission[]>(API_ENDPOINTS.permissions.list, {
      params: { all: true }
    })

    // 调试：打印响应结构
    console.log('[PermissionService] API Response:', response)
    console.log('[PermissionService] Response.data:', response.data)

    // response.data 就是权限数组
    return response.data || []
  }

  /**
   * 获取权限树结构
   */
  async getPermissionsTree(): Promise<PermissionTree[]> {
    const response = await http.get<PermissionTree[]>(API_ENDPOINTS.permissions.tree)
    return response.data
  }

  /**
   * 获取单个权限详情
   */
  async getPermissionById(id: string): Promise<Permission> {
    const response = await http.get<Permission>(API_ENDPOINTS.permissions.detail(id))
    return response.data
  }

  /**
   * 创建权限
   */
  async createPermission(data: CreatePermissionRequest): Promise<Permission> {
    const response = await http.post<Permission>(API_ENDPOINTS.permissions.create, data)
    return response.data
  }

  /**
   * 更新权限
   */
  async updatePermission(id: string, data: UpdatePermissionRequest): Promise<Permission> {
    const response = await http.put<Permission>(API_ENDPOINTS.permissions.update(id), data)
    return response.data
  }

  /**
   * 删除权限
   */
  async deletePermission(id: string): Promise<void> {
    await http.delete(API_ENDPOINTS.permissions.delete(id))
  }

  /**
   * 批量删除权限
   */
  async batchDeletePermissions(ids: string[]): Promise<void> {
    await Promise.all(ids.map(id => http.delete(API_ENDPOINTS.permissions.delete(id))))
  }
}

// 导出单例
export const permissionService = new PermissionService()
