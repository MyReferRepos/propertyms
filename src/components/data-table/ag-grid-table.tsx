/**
 * AG Grid Table Component
 * AG Grid表格封装组件
 */

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'

import type {
  ColDef,
  GridOptions,
  GridReadyEvent,
  RowClickedEvent,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useCallback, useMemo, useRef } from 'react'

import { useTheme } from '@/context/theme-provider'

interface AgGridTableProps<T> {
  rowData: T[]
  columnDefs: ColDef<T>[]
  gridOptions?: GridOptions<T>
  height?: string
  pagination?: boolean
  paginationPageSize?: number
  onRowClicked?: (data: T) => void
  onSelectionChanged?: (selectedRows: T[]) => void
  loading?: boolean
}

/**
 * AG Grid表格组件
 */
export function AgGridTable<T>({
  rowData,
  columnDefs,
  gridOptions,
  height = '500px',
  pagination = true,
  paginationPageSize = 10,
  onRowClicked,
  onSelectionChanged,
  loading = false,
}: AgGridTableProps<T>) {
  const gridRef = useRef<AgGridReact<T>>(null)
  const { resolvedTheme } = useTheme()

  // 默认列定义
  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      minWidth: 100,
      sortable: true,
      filter: true,
      resizable: true,
      editable: false,
    }),
    []
  )

  // 表格准备好的回调
  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit()
  }, [])

  // 行点击事件
  const handleRowClicked = useCallback(
    (event: RowClickedEvent<T>) => {
      if (onRowClicked && event.data) {
        onRowClicked(event.data)
      }
    },
    [onRowClicked]
  )

  // 选择变化事件
  const handleSelectionChanged = useCallback(() => {
    if (onSelectionChanged && gridRef.current) {
      const selectedRows = gridRef.current.api.getSelectedRows()
      onSelectionChanged(selectedRows)
    }
  }, [onSelectionChanged])

  // 合并grid配置
  const mergedGridOptions = useMemo<GridOptions<T>>(
    () => ({
      ...gridOptions,
      pagination,
      paginationPageSize,
      // 确保分页大小在选择器中
      paginationPageSizeSelector: gridOptions?.paginationPageSizeSelector || [
        paginationPageSize,
        20,
        50,
        100,
      ],
      // AG Grid 32.2.1+ 使用对象形式的 rowSelection
      rowSelection: gridOptions?.rowSelection || { mode: 'singleRow' },
      onRowClicked: handleRowClicked,
      onSelectionChanged: handleSelectionChanged,
      onGridReady,
      loadingOverlayComponent: loading ? 'agLoadingOverlay' : undefined,
      noRowsOverlayComponent: 'agNoRowsOverlay',
    }),
    [
      gridOptions,
      pagination,
      paginationPageSize,
      handleRowClicked,
      handleSelectionChanged,
      onGridReady,
      loading,
    ]
  )

  // 根据主题选择对应的class
  const themeClass = resolvedTheme === 'dark' ? 'ag-theme-quartz-dark' : 'ag-theme-quartz'

  return (
    <div className={themeClass} style={{ height, width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        gridOptions={mergedGridOptions}
        theme="legacy"
      />
    </div>
  )
}
