/**
 * 审计日志页面 - 使用AG Grid
 */

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, Eye, RefreshCw } from 'lucide-react'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'

import { auditLogApi } from '../api/audit-log-api'
import type { AuditLog, AuditLogQueryParams } from '../types'

import { AgGridTable, ServerPagination } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useI18n } from '@/lib/i18n'
import { PageHeader } from '@/components/layout/page-header'

// 格式化日期时间
function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 格式化 JSON 字符串
function formatJSON(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString)
    return JSON.stringify(parsed, null, 2)
  } catch {
    // 如果不是有效的 JSON，返回原始字符串
    return jsonString
  }
}

export function AuditLogsPage() {
  const { t } = useI18n()

  // 查询参数状态
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [params, setParams] = useState<AuditLogQueryParams>({
    page: 1,
    pageSize: 20,
  })

  // 筛选条件
  const [filters, setFilters] = useState({
    username: '',
    module: '',
    action: '',
    entityType: '',
  })

  // 详情对话框
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  // 获取审计日志列表
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['audit-logs', params],
    queryFn: () => auditLogApi.list(params),
  })

  // 应用筛选
  const handleApplyFilters = () => {
    setPage(1)
    setParams({
      ...params,
      page: 1,
      username: filters.username || undefined,
      module: filters.module || undefined,
      action: filters.action || undefined,
      entityType: filters.entityType || undefined,
    })
  }

  // 重置筛选
  const handleResetFilters = () => {
    setFilters({
      username: '',
      module: '',
      action: '',
      entityType: '',
    })
    setPage(1)
    setPageSize(20)
    setParams({
      page: 1,
      pageSize: 20,
    })
  }

  // 处理分页变化
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    setParams({
      ...params,
      page: newPage,
    })
  }

  // 处理每页大小变化
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
    setParams({
      ...params,
      page: 1,
      pageSize: newPageSize,
    })
  }

  // 查看详情
  const handleViewDetail = (log: AuditLog) => {
    setSelectedLog(log)
    setDetailDialogOpen(true)
  }

  // 导出CSV
  const handleExport = async () => {
    try {
      const blob = await auditLogApi.export(params, 'csv')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit-logs-${new Date().toISOString()}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('导出失败:', error)
    }
  }

  // 操作Badge变体
  const getActionBadgeVariant = (action?: string | null) => {
    if (!action) return 'secondary'
    const lowerAction = action.toLowerCase()
    if (lowerAction.includes('create') || lowerAction.includes('add')) return 'default'
    if (lowerAction.includes('update') || lowerAction.includes('edit')) return 'outline'
    if (lowerAction.includes('delete') || lowerAction.includes('remove')) return 'destructive'
    return 'secondary'
  }

  // 状态Badge变体
  const getStatusBadgeVariant = (status?: number | null) => {
    if (!status) return 'secondary'
    if (status >= 200 && status < 300) return 'default'
    if (status >= 400 && status < 500) return 'outline'
    if (status >= 500) return 'destructive'
    return 'secondary'
  }

  // 时间格式化器
  const dateTimeFormatter = (params: { value: string }) => {
    if (!params.value) return '-'
    return formatDateTime(params.value)
  }

  // 操作单元格渲染器
  const ActionCellRenderer = (props: ICellRendererParams<AuditLog>) => {
    if (!props.data) return null
    const log = props.data

    return (
      <Badge variant={getActionBadgeVariant(log.action)}>
        {log.action || '-'}
      </Badge>
    )
  }

  // 状态单元格渲染器
  const StatusCellRenderer = (props: ICellRendererParams<AuditLog>) => {
    if (!props.data || !props.data.responseStatus) return null
    const log = props.data

    return (
      <Badge variant={getStatusBadgeVariant(log.responseStatus)}>
        {log.responseStatus}
      </Badge>
    )
  }

  // 操作按钮单元格渲染器
  const ActionButtonsRenderer = (props: ICellRendererParams<AuditLog>) => {
    if (!props.data) return null
    const log = props.data

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewDetail(log)}
      >
        <Eye className="h-4 w-4" />
      </Button>
    )
  }

  // AG Grid列定义
  const columnDefs: ColDef<AuditLog>[] = useMemo(
    () => [
      {
        field: 'createdAt',
        headerName: t('auditLog.columns.time') || 'Time',
        width: 180,
        valueFormatter: dateTimeFormatter,
        filter: 'agDateColumnFilter',
        sort: 'desc',
      },
      {
        field: 'username',
        headerName: t('auditLog.columns.username') || 'User',
        width: 150,
        filter: true,
        valueGetter: (params) => params.data?.username || '-',
      },
      {
        field: 'module',
        headerName: t('auditLog.columns.module') || 'Module',
        width: 130,
        filter: true,
        valueGetter: (params) => params.data?.module || '-',
      },
      {
        field: 'action',
        headerName: t('auditLog.columns.action') || 'Action',
        width: 150,
        cellRenderer: ActionCellRenderer,
        filter: true,
        valueGetter: (params) => params.data?.action || '-',
      },
      {
        field: 'entityType',
        headerName: t('auditLog.columns.entityType') || 'Entity Type',
        width: 150,
        filter: true,
        valueGetter: (params) => params.data?.entityType || '-',
      },
      {
        field: 'ipAddress',
        headerName: t('auditLog.columns.ipAddress') || 'IP Address',
        width: 140,
        filter: true,
        cellClass: 'font-mono text-xs',
        valueGetter: (params) => params.data?.ipAddress || '-',
      },
      {
        field: 'responseStatus',
        headerName: t('auditLog.columns.status') || 'Status',
        width: 100,
        cellRenderer: StatusCellRenderer,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: t('auditLog.columns.operations') || 'Operations',
        width: 100,
        cellRenderer: ActionButtonsRenderer,
        pinned: 'right',
        sortable: false,
        filter: false,
      },
    ],
    [t]
  )

  return (
    <div className='flex flex-1 flex-col'>
      <PageHeader
        breadcrumbs={[
          { title: 'Home', href: '/' },
          { title: 'System Management' },
          { title: 'Audit Logs' },
        ]}
      />

      <div className='flex-1 p-4 md:p-6 lg:p-8'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>{t('auditLog.title') || 'Audit Logs'}</CardTitle>
                <CardDescription>{t('auditLog.description') || 'View system operation audit records'}</CardDescription>
              </div>
              <div className='flex gap-2'>
                <Button variant='outline' onClick={() => refetch()} disabled={isLoading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {t('common.refresh') || 'Refresh'}
                </Button>
                <Button variant='outline' onClick={handleExport}>
                  <Download className='mr-2 h-4 w-4' />
                  {t('auditLog.actions.exportCsv') || 'Export CSV'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {/* 筛选条件 */}
              <div className='grid gap-4 md:grid-cols-4'>
                <Input
                  placeholder={t('auditLog.filters.username') || 'Username'}
                  value={filters.username}
                  onChange={(e) => setFilters({ ...filters, username: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                />
                <Input
                  placeholder={t('auditLog.filters.module') || 'Module'}
                  value={filters.module}
                  onChange={(e) => setFilters({ ...filters, module: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                />
                <Input
                  placeholder={t('auditLog.filters.action') || 'Action'}
                  value={filters.action}
                  onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                />
                <Input
                  placeholder={t('auditLog.filters.entityType') || 'Entity Type'}
                  value={filters.entityType}
                  onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                />
              </div>

              <div className='flex gap-2'>
                <Button onClick={handleApplyFilters}>
                  {t('auditLog.filters.apply') || 'Apply Filters'}
                </Button>
                <Button variant='outline' onClick={handleResetFilters}>
                  {t('auditLog.filters.reset') || 'Reset'}
                </Button>
              </div>

              {/* 统计信息 */}
              <div className='flex gap-4 text-sm text-muted-foreground'>
                <span>{t('auditLog.stats.total', { count: data?.total || 0 })}</span>
                <span>{t('auditLog.stats.showing', { count: data?.items?.length || 0 })}</span>
              </div>

              {/* 数据表格 */}
              <AgGridTable
                rowData={data?.items || []}
                columnDefs={columnDefs}
                height='600px'
                pagination={false}
                loading={isLoading}
                gridOptions={{
                  animateRows: true,
                  defaultColDef: {
                    sortable: true,
                    resizable: true,
                  },
                }}
              />

              {/* 服务端分页控件 */}
              {data && data.total > 0 && (
                <ServerPagination
                  currentPage={page}
                  pageSize={pageSize}
                  total={data.total}
                  totalPages={data.totalPages}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  translationNamespace='auditLog'
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 详情对话框 */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('auditLog.detail') || 'Audit Log Detail'}</DialogTitle>
            <DialogDescription>
              {t('auditLog.detailDescription') || 'View detailed audit log information'}
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Basic Information</h4>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">User</dt>
                    <dd className="font-medium">{selectedLog.username || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Module</dt>
                    <dd className="font-medium">{selectedLog.module || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Action</dt>
                    <dd>
                      <Badge variant={getActionBadgeVariant(selectedLog.action)}>
                        {selectedLog.action || '-'}
                      </Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Time</dt>
                    <dd className="font-medium">
                      {formatDateTime(selectedLog.createdAt)}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* 请求信息 */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Request Information</h4>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">IP Address</dt>
                    <dd className="font-mono">{selectedLog.ipAddress || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Request Method</dt>
                    <dd className="font-mono">{selectedLog.requestMethod || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Request Path</dt>
                    <dd className="font-mono text-xs break-all">
                      {selectedLog.requestPath || '-'}
                    </dd>
                  </div>
                  {selectedLog.requestBody && (
                    <div>
                      <dt className="text-muted-foreground">Request Body</dt>
                      <dd className="font-mono text-xs bg-muted p-3 rounded-md overflow-y-auto max-h-40">
                        <pre className="whitespace-pre-wrap break-words">{formatJSON(selectedLog.requestBody)}</pre>
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-muted-foreground">User Agent</dt>
                    <dd className="font-mono text-xs break-all">
                      {selectedLog.userAgent || '-'}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* 响应信息 */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Response Information</h4>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Response Status</dt>
                    <dd>
                      {selectedLog.responseStatus ? (
                        <Badge variant={getStatusBadgeVariant(selectedLog.responseStatus)}>
                          {selectedLog.responseStatus}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* 实体信息 */}
              {selectedLog.entityType && (
                <div>
                  <h4 className="text-sm font-semibold mb-3">Entity Information</h4>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Entity Type</dt>
                      <dd className="font-medium">{selectedLog.entityType}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Entity ID</dt>
                      <dd className="font-mono text-xs">{selectedLog.entityId || '-'}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {/* 描述 */}
              {selectedLog.description && (
                <div>
                  <h4 className="text-sm font-semibold mb-3">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedLog.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
