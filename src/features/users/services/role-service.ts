/**
 * Role Management Service
 * 角色管理服务
 */

import { http } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/config'

import type { Role, RoleFormData } from '../types'

/**
 * 角色服务类
 */
class RoleService {
  /**
   * 获取所有角色列表
   */
  async getRoles(): Promise<Role[]> {
    const response = await http.get<Role[]>(API_ENDPOINTS.roles.list)
    return response.data
  }

  /**
   * 获取单个角色详情
   */
  async getRoleById(id: string): Promise<Role> {
    const response = await http.get<Role>(API_ENDPOINTS.roles.detail(id))
    return response.data
  }

  /**
   * 创建角色
   */
  async createRole(data: RoleFormData): Promise<Role> {
    const response = await http.post<Role>(API_ENDPOINTS.roles.create, data)
    return response.data
  }

  /**
   * 更新角色
   */
  async updateRole(id: string, data: Partial<RoleFormData>): Promise<Role> {
    const response = await http.put<Role>(API_ENDPOINTS.roles.update(id), data)
    return response.data
  }

  /**
   * 删除角色
   */
  async deleteRole(id: string): Promise<void> {
    await http.delete(API_ENDPOINTS.roles.delete(id))
  }

  /**
   * 批量删除角色
   */
  async batchDeleteRoles(ids: string[]): Promise<void> {
    await Promise.all(ids.map(id => http.delete(API_ENDPOINTS.roles.delete(id))))
  }

  /**
   * 更新角色权限
   * 使用独立的权限分配 API: PUT /api/Roles/{id}/permissions
   * @param id - 角色ID
   * @param permissionIds - 权限ID数组（不是权限代码）
   */
  async updateRolePermissions(id: string, permissionIds: string[]): Promise<Role> {
    const response = await http.put<Role>(API_ENDPOINTS.roles.permissions(id), {
      permissionIds,
    })
    return response.data
  }
}

// 导出单例
export const roleService = new RoleService()
