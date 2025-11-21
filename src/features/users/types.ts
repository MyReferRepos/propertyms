/**
 * User Management Types
 * 用户管理相关类型定义 - RBAC权限模型
 */

/**
 * 权限类型
 * 与后端枚举保持一致，与权限架构设计文档一致
 */
export enum PermissionType {
  MODULE = 'Module',  // 模块类型权限 (首字母大写以匹配后端)
  ACTION = 'Action'   // 行为类型权限 (首字母大写以匹配后端)
}

/**
 * HTTP 方法类型
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * 权限 - 最小粒度的操作权限
 * 基于Module-Action模型
 */
export interface Permission {
  id: string
  name: string         // 显示名称：如"用户管理模块"、"用户列表" - 必须唯一
  code: string         // 权限代码：如"user_module"、"user_list" - 必须唯一
  description?: string // 权限描述
  type: PermissionType // 权限类型：Module 或 Action

  // Module-Action模型字段
  moduleId?: string    // 所属模块ID (对于Action类型)
  moduleName?: string  // 所属模块名称
  moduleCode?: string  // 所属模块代码
  action?: string      // 操作名称 (对于Action类型)
  path?: string        // API路径，用于权限验证：如"/api/users"、"/api/users/*"
  httpMethod?: string  // HTTP方法：GET, POST, PUT, DELETE等

  createdAt?: string
  updatedAt?: string
}

/**
 * 角色 - 权限的集合
 */
export interface Role {
  id: string
  name: string
  code: string // 角色代码，如 'admin', 'user', 'manager'
  description?: string
  permissions: Permission[] | string[] // 关联的权限列表（完整对象或ID列表）
  isSystem?: boolean // 是否为系统角色（系统角色不可删除）
  userCount?: number // 拥有该角色的用户数量
  createdAt?: string
  updatedAt?: string
}

/**
 * 用户状态
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

/**
 * 用户信息
 */
export interface User {
  id: string
  username: string
  email: string
  phone?: string
  avatar?: string
  firstName?: string
  lastName?: string
  displayName?: string
  status: UserStatus
  roles: Role[] | string[] // 关联的角色列表（完整对象或ID列表）
  department?: string
  position?: string
  lastLoginAt?: string
  lastLoginIp?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * 创建用户请求
 */
export interface CreateUserRequest {
  username: string
  email: string
  password: string
  phone?: string
  firstName?: string
  lastName?: string
  roles: string[] // 角色ID列表
  department?: string
  position?: string
  status?: UserStatus
}

/**
 * 更新用户请求
 */
export interface UpdateUserRequest {
  username?: string
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  avatar?: string
  roles?: string[] // 角色ID列表
  department?: string
  position?: string
  status?: UserStatus
}

/**
 * 修改密码请求
 */
/**
 * 管理员修改用户密码请求（不需要当前密码）
 */
export interface ChangePasswordRequest {
  userId: string
  newPassword: string
  confirmPassword: string
}

/**
 * 用户修改自己密码请求（需要当前密码验证）
 */
export interface ChangeOwnPasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

/**
 * 用户查询参数
 */
export interface UserQueryParams {
  page?: number
  pageSize?: number
  keyword?: string // 搜索关键词（用户名、邮箱、姓名）
  status?: UserStatus
  roleId?: string
  department?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * 创建角色请求
 */
export interface CreateRoleRequest {
  name: string
  code: string
  description?: string
  permissions: string[] // 权限ID列表
}

/**
 * 更新角色请求
 */
export interface UpdateRoleRequest {
  name?: string
  description?: string
  permissions?: string[] // 权限ID列表
}

/**
 * 角色表单数据（用于创建和更新）
 */
export type RoleFormData = CreateRoleRequest

/**
 * 权限树节点（用于权限选择器）
 */
export interface PermissionTreeNode {
  id: string
  name: string
  code: string
  module: string
  children?: PermissionTreeNode[]
}

/**
 * 权限树（别名）
 */
export type PermissionTree = PermissionTreeNode

/**
 * 创建权限请求
 * 匹配后端 PermissionCreateDto
 */
export interface CreatePermissionRequest {
  name: string         // 名称 - 必须唯一
  code: string         // 代码 - 必须唯一 (格式: ^[a-z0-9_-]+$)
  description?: string // 描述
  type: PermissionType // Module 或 Action
  moduleId: string     // 所属模块ID (对于Action类型是必填，对于Module类型可以为自身ID)
  action?: string      // 操作名称 (对于Action类型)
  path?: string        // API路径
  httpMethod?: string  // HTTP方法
}

/**
 * 更新权限请求
 */
export interface UpdatePermissionRequest {
  name?: string       // 名称
  path?: string       // API 路径
  description?: string
}
