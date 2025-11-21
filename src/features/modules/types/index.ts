/**
 * Module Management Types
 * 模块管理相关类型定义
 */

/**
 * 模块 - 基础信息
 */
export interface Module {
  id: string
  code: string
  name: string
  description?: string
  icon?: string
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * 模块列表项 - 包含统计信息
 */
export interface ModuleListItem {
  id: string
  code: string
  name: string
  description?: string
  icon?: string
  sortOrder: number
  isActive: boolean
  permissionCount: number // 关联的权限数量
  createdAt: string
}

/**
 * 创建模块请求
 */
export interface CreateModuleRequest {
  code: string         // 模块代码，必填，1-50字符，模式: ^[a-z][a-z0-9_]*$
  name: string         // 模块名称，必填，1-100字符
  description?: string // 描述，可选，最多500字符
  icon?: string        // 图标，可选，最多100字符
  sortOrder: number    // 排序顺序
  isActive: boolean    // 是否激活
}

/**
 * 更新模块请求
 */
export interface UpdateModuleRequest {
  name: string         // 模块名称，必填，1-100字符
  description?: string // 描述，可选，最多500字符
  icon?: string        // 图标，可选，最多100字符
  sortOrder: number    // 排序顺序
  isActive: boolean    // 是否激活
}

/**
 * 模块表单数据（用于创建和编辑）
 */
export type ModuleFormData = CreateModuleRequest
