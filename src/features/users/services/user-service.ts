/**
 * User Service
 * 用户管理服务层
 */

import { http } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/config'

import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  ChangeOwnPasswordRequest,
  UserQueryParams,
  PaginatedResponse,
  Role,
  Permission,
  PermissionTreeNode,
  CreateRoleRequest,
  UpdateRoleRequest,
} from '../types'
import { UserStatus } from '../types'

/**
 * 用户管理服务
 */
export const userService = {
  /**
   * 获取用户列表
   */
  async getUsers(params?: UserQueryParams): Promise<PaginatedResponse<User>> {
    // API 实际返回: {success, data: User[], pagination: {...}}
    // http.get<T> 返回 ApiResponse<T>，即 {success, data: T, message}
    // 但后端返回的是扁平结构，所以需要特殊处理
    const response: any = await http.get(API_ENDPOINTS.users.list, {
      params,
    })

    // response 是 {success, data: User[], pagination: {...}}
    return {
      data: response.data,
      total: response.pagination.total,
      page: response.pagination.page,
      pageSize: response.pagination.pageSize,
      totalPages: response.pagination.totalPages,
    }
  },

  /**
   * 获取用户详情
   */
  async getUser(id: string): Promise<User> {
    const response: any = await http.get(API_ENDPOINTS.users.detail(id))
    return response.data
  },

  /**
   * 创建用户
   */
  async createUser(data: CreateUserRequest): Promise<User> {
    const response: any = await http.post(API_ENDPOINTS.users.create, data)
    return response.data
  },

  /**
   * 更新用户
   */
  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    const response: any = await http.put(API_ENDPOINTS.users.update(id), data)
    return response.data
  },

  /**
   * 删除用户
   */
  async deleteUser(id: string): Promise<void> {
    await http.delete(API_ENDPOINTS.users.delete(id))
  },

  /**
   * 批量删除用户
   */
  async batchDeleteUsers(ids: string[]): Promise<void> {
    await http.post(API_ENDPOINTS.users.batchDelete, { ids })
  },

  /**
   * 修改用户密码（管理员权限）
   */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await http.put(API_ENDPOINTS.users.changePassword(data.userId), data)
  },

  /**
   * 修改当前用户自己的密码（需要当前密码验证）
   */
  async changeOwnPassword(data: ChangeOwnPasswordRequest): Promise<void> {
    await http.put(API_ENDPOINTS.auth.changePassword, data)
  },

  /**
   * 修改用户状态
   */
  async changeUserStatus(id: string, status: UserStatus): Promise<User> {
    const response: any = await http.put(API_ENDPOINTS.users.changeStatus(id), { status })
    return response.data
  },
}

/**
 * 角色管理服务
 */
export const roleService = {
  /**
   * 获取角色列表
   */
  async getRoles(): Promise<Role[]> {
    // API 实际返回: {success, data: Role[], pagination: {...}}
    const response: any = await http.get(API_ENDPOINTS.roles.list)
    return response.data
  },

  /**
   * 获取角色详情
   */
  async getRole(id: string): Promise<Role> {
    const response: any = await http.get(API_ENDPOINTS.roles.detail(id))
    return response.data
  },

  /**
   * 创建角色
   */
  async createRole(data: CreateRoleRequest): Promise<Role> {
    const response: any = await http.post(API_ENDPOINTS.roles.create, data)
    return response.data
  },

  /**
   * 更新角色
   */
  async updateRole(id: string, data: UpdateRoleRequest): Promise<Role> {
    const response: any = await http.put(API_ENDPOINTS.roles.update(id), data)
    return response.data
  },

  /**
   * 删除角色
   */
  async deleteRole(id: string): Promise<void> {
    await http.delete(API_ENDPOINTS.roles.delete(id))
  },

  /**
   * 获取角色的权限列表
   */
  async getRolePermissions(id: string): Promise<Permission[]> {
    // API 实际返回: {success, data: Permission[]}
    const response: any = await http.get(API_ENDPOINTS.roles.permissions(id))
    return response.data
  },

  /**
   * 更新角色权限
   */
  async updateRolePermissions(id: string, permissionIds: string[]): Promise<void> {
    await http.put(API_ENDPOINTS.roles.permissions(id), { permissionIds })
  },
}

/**
 * 权限管理服务
 */
export const permissionService = {
  /**
   * 获取权限列表
   */
  async getPermissions(): Promise<Permission[]> {
    // API 实际返回: {success, data: Permission[], pagination: {...}}
    const response: any = await http.get(API_ENDPOINTS.permissions.list)
    return response.data
  },

  /**
   * 获取权限树（用于权限选择器）
   */
  async getPermissionTree(): Promise<PermissionTreeNode[]> {
    const response: any = await http.get(API_ENDPOINTS.permissions.tree)
    return response.data
  },

  /**
   * 获取权限详情
   */
  async getPermission(id: string): Promise<Permission> {
    const response: any = await http.get(API_ENDPOINTS.permissions.detail(id))
    return response.data
  },
}
