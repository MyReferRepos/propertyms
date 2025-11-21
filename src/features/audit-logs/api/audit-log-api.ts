/**
 * 审计日志API服务
 */

import { http } from '@/lib/api'
import type { ApiResponse, PaginationData } from '@/lib/api'
import type { AuditLog, AuditLogQueryParams } from '../types'

// API端点
const AUDIT_LOG_ENDPOINTS = {
  list: '/audit-logs',
  detail: (id: string) => `/audit-logs/${id}`,
} as const

/**
 * 审计日志API类
 */
export class AuditLogApi {
  /**
   * 获取审计日志列表（分页）
   */
  async list(params?: AuditLogQueryParams): Promise<PaginationData<AuditLog>> {
    const response = await http.get(AUDIT_LOG_ENDPOINTS.list, { params })

    // http.get() 已经返回了 response.data，所以 response 就是后端返回的完整对象
    // 后端标准格式: { success: true, data: [...], pagination: {...} }
    const responseData: any = response

    // 检查响应结构
    if (!responseData || typeof responseData !== 'object') {
      console.error('[Audit Log API] Invalid response structure')
      return {
        items: [],
        total: 0,
        page: params?.page || 1,
        pageSize: params?.pageSize || 20,
        totalPages: 0,
      }
    }

    // 提取数据数组和分页信息
    const items: AuditLog[] = Array.isArray(responseData.data) ? responseData.data : []
    const pagination = responseData.pagination

    // 检查是否有分页信息
    if (!pagination || typeof pagination !== 'object') {
      console.warn('[Audit Log API] No pagination info in response')
      return {
        items,
        total: items.length,
        page: params?.page || 1,
        pageSize: params?.pageSize || 20,
        totalPages: Math.ceil(items.length / (params?.pageSize || 20)),
      }
    }

    // 返回标准分页数据
    return {
      items,
      total: pagination.total || 0,
      page: pagination.page || params?.page || 1,
      pageSize: pagination.pageSize || params?.pageSize || 20,
      totalPages: pagination.totalPages || 0,
    }
  }

  /**
   * 获取单个审计日志详情
   */
  async get(id: string): Promise<AuditLog> {
    const response = await http.get<ApiResponse<AuditLog>>(AUDIT_LOG_ENDPOINTS.detail(id))
    return response.data.data
  }

  /**
   * 导出审计日志
   * @param params 查询参数
   * @param format 导出格式 (csv, excel)
   */
  async export(params?: AuditLogQueryParams, format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    const response = await http.get(AUDIT_LOG_ENDPOINTS.list, {
      params: { ...params, export: format },
      responseType: 'blob',
    })
    return response.data as Blob
  }
}

// 导出单例
export const auditLogApi = new AuditLogApi()
