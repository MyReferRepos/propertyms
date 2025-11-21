/**
 * 审计日志类型定义
 */

/**
 * 审计日志实体
 */
export interface AuditLog {
  id: string
  userId?: string | null
  username?: string | null
  action?: string | null
  module?: string | null
  entityType?: string | null
  entityId?: string | null
  description?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  requestMethod?: string | null
  requestPath?: string | null
  requestBody?: string | null
  responseStatus?: number | null
  createdAt: string
}

/**
 * 审计日志查询参数
 */
export interface AuditLogQueryParams {
  username?: string
  module?: string
  action?: string
  entityType?: string
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}

/**
 * 审计日志统计数据
 */
export interface AuditLogStats {
  totalLogs: number
  todayLogs: number
  uniqueUsers: number
  topModules: Array<{ module: string; count: number }>
  topActions: Array<{ action: string; count: number }>
}
