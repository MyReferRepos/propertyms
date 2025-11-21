/**
 * Server-side Pagination Component
 * 服务端分页组件 - 用于 AG Grid 表格的服务端分页
 * 样式参考 AG Grid 原生分页控件
 */

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

interface ServerPaginationProps {
  currentPage: number
  pageSize: number
  total: number
  totalPages: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  /** 翻译命名空间，例如 'auditLog' */
  translationNamespace?: string
  /** 可选的页面大小选项 */
  pageSizeOptions?: number[]
}

/**
 * 服务端分页组件 - AG Grid 风格
 *
 * @example
 * ```tsx
 * <ServerPagination
 *   currentPage={page}
 *   pageSize={pageSize}
 *   total={data.total}
 *   totalPages={data.totalPages}
 *   onPageChange={handlePageChange}
 *   onPageSizeChange={handlePageSizeChange}
 *   translationNamespace="auditLog"
 * />
 * ```
 */
export function ServerPagination({
  currentPage,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  translationNamespace = 'auditLog',
  pageSizeOptions = [10, 20, 50, 100],
}: ServerPaginationProps) {
  const { t } = useI18n()

  // 计算当前显示的记录范围
  const from = (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, total)

  return (
    <div className='flex items-center justify-center gap-6 py-3 border-t border-border'>
      {/* 每页大小选择器 */}
      <div className='flex items-center gap-2'>
        <span className='text-sm text-muted-foreground'>
          {t(`${translationNamespace}.pagination.rowsPerPage`)}
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className='h-7 rounded border border-input bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring'
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* 显示范围信息 */}
      <div className='text-sm text-muted-foreground'>
        {from} to {to} of {total}
      </div>

      {/* 分页按钮组 */}
      <div className='flex items-center gap-1'>
        {/* 首页 */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className='inline-flex h-7 w-7 items-center justify-center rounded border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50'
          title={t(`${translationNamespace}.pagination.first`)}
        >
          <ChevronsLeft className='h-4 w-4' />
        </button>

        {/* 上一页 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='inline-flex h-7 w-7 items-center justify-center rounded border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50'
          title={t(`${translationNamespace}.pagination.previous`)}
        >
          <ChevronLeft className='h-4 w-4' />
        </button>

        {/* 页码信息 */}
        <span className='px-3 text-sm text-muted-foreground'>
          {t(`${translationNamespace}.pagination.page`)} {currentPage} {t(`${translationNamespace}.pagination.of`)} {totalPages}
        </span>

        {/* 下一页 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className='inline-flex h-7 w-7 items-center justify-center rounded border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50'
          title={t(`${translationNamespace}.pagination.next`)}
        >
          <ChevronRight className='h-4 w-4' />
        </button>

        {/* 末页 */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className='inline-flex h-7 w-7 items-center justify-center rounded border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50'
          title={t(`${translationNamespace}.pagination.last`)}
        >
          <ChevronsRight className='h-4 w-4' />
        </button>
      </div>
    </div>
  )
}
