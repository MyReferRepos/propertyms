/**
 * Menu Management Types
 * 菜单管理相关类型定义
 */

import type { Permission } from '../users/types'

/**
 * 菜单类型枚举
 * 与后端枚举保持一致 (首字母大写)
 */
export enum MenuType {
  DIRECTORY = 'Directory',  // 目录（容器节点）
  MENU = 'Menu',            // 菜单（实际页面）
  ACTION = 'Action'         // 操作项（原名button，已改为action）
}

/**
 * API统一响应格式
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string | null
}

/**
 * 菜单组
 */
export interface MenuGroup {
  id: string
  name: string       // 菜单组名称（英文）：如"System Management"
  i18nKey?: string | null // 国际化翻译键：如"nav.systemManagement"
  icon?: string      // 图标名称
  description?: string // 描述
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * 菜单组创建/更新表单数据
 * 匹配后端 CreateMenuGroupDto / UpdateMenuGroupDto
 */
export interface MenuGroupFormData {
  name: string
  i18nKey?: string | null
  icon?: string
  description?: string
  sortOrder: number
  isActive: boolean
}

/**
 * 菜单元数据
 */
export interface MenuMeta {
  title?: string
  icon?: string
  keepAlive?: boolean
  hidden?: boolean
  badge?: string
  [key: string]: unknown
}

/**
 * 菜单项（统一菜单表）
 * 匹配后端 MenuDto - 后端已全面支持所有字段
 */
export interface Menu {
  id: string
  parentId: string | null
  menuGroupId: string | null
  name: string         // 路由名称（英文）：如"UserManagement"
  title: string        // 显示标题（英文）：如"User Management"
  i18nKey?: string | null // 国际化翻译键：如"nav.users"
  path?: string        // 路由路径：如"/users"
  redirect?: string    // 重定向路径：如"/users/list"
  component?: string   // 组件路径：如"@/features/users/pages/UserListPage"
  icon?: string        // 图标：如"users"
  badge?: string       // 徽章文本：如"New", "3"
  sortOrder: number
  menuType: MenuType   // 菜单类型：directory/menu/button
  visible: boolean     // 是否在菜单中显示
  isActive: boolean    // 是否启用
  keepAlive: boolean   // 是否缓存组件
  isExternal: boolean  // 是否外部链接
  hiddenInBreadcrumb?: boolean // 是否在面包屑中隐藏
  alwaysShow: boolean  // 🆕 是否始终显示（不受权限约束，默认 false）
  remark?: string      // 备注
  permissionId?: string | null  // 🔄 关联的权限 ID（从 permissionIds 改为单个）
  permission?: Permission        // 🔄 关联的权限对象（从 permissions 改为单个）
  children?: Menu[]    // 子菜单
  meta?: MenuMeta      // 元数据
  createdAt?: string
  updatedAt?: string

  // 关联的菜单组信息（可选）
  group?: MenuGroup
}

/**
 * 菜单创建/更新表单数据
 * 匹配后端 CreateMenuDto / UpdateMenuDto - 后端已全面支持所有字段
 */
export interface MenuFormData {
  parentId: string | null
  menuGroupId: string | null
  name: string
  title: string
  i18nKey?: string | null
  path?: string
  redirect?: string
  component?: string
  icon?: string
  badge?: string
  sortOrder: number
  menuType: MenuType
  visible: boolean
  isActive: boolean
  keepAlive: boolean
  isExternal: boolean
  hiddenInBreadcrumb?: boolean
  alwaysShow: boolean       // 🆕 是否始终显示（不受权限约束）
  remark?: string
  permissionId?: string | null  // 🔄 关联的权限 ID（单个，从 permissionIds 改为 permissionId）
}

/**
 * 菜单树形节点
 */
export interface MenuTreeNode extends Menu {
  children: MenuTreeNode[]
  level: number
}

/**
 * 查询参数
 */
export interface MenuQueryParams {
  menuType?: MenuType
  isActive?: boolean
  menuGroupId?: string
  parentId?: string | null
  keyword?: string
  page?: number
  pageSize?: number
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
