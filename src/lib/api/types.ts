/**
 * API Types
 * API相关的类型定义
 */

// API响应基础结构
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
  // code 字段仅在错误响应中存在
  code?: number
  // 错误信息
  error?: {
    code: string
    message: string
    details?: unknown
  }
}

// 分页请求参数
export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 分页响应数据
export interface PaginationData<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 错误响应
export interface ApiError {
  code: number
  message: string
  details?: unknown
}

// 请求配置
export interface RequestConfig {
  showLoading?: boolean
  showError?: boolean
  useAuth?: boolean
}
