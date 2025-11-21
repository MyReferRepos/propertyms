# 服务端分页实现指南

## 概述

本指南介绍如何在项目中使用 AG Grid 表格实现服务端分页（Server-side Pagination）。

服务端分页适用于数据量较大的场景，由后端控制分页逻辑，前端只展示当前页的数据。

---

## 核心组件

### 1. `ServerPagination` 组件

位置：`src/components/data-table/server-pagination.tsx`

这是一个可复用的服务端分页控件组件，提供完整的分页 UI，**样式完全参考 AG Grid 原生分页控件**。

**特性**：
- ✅ AG Grid 原生分页样式（紧凑、居中、图标按钮）
- ✅ 完整的分页按钮（<< < > >> 图标）
- ✅ 每页大小选择器（Page Size: 下拉选择）
- ✅ 显示范围信息（1 to 20 of 43）
- ✅ 完全支持 i18n 国际化
- ✅ 响应式悬停效果和禁用状态

**Props**：
```typescript
interface ServerPaginationProps {
  currentPage: number          // 当前页码（从 1 开始）
  pageSize: number             // 每页记录数
  total: number                // 总记录数
  totalPages: number           // 总页数
  onPageChange: (page: number) => void          // 页码变化回调
  onPageSizeChange: (pageSize: number) => void  // 每页大小变化回调
  translationNamespace?: string                 // 翻译命名空间（默认 'auditLog'）
  pageSizeOptions?: number[]                    // 可选的页面大小选项（默认 [10, 20, 50, 100]）
}
```

---

## 实现步骤

### 第 1 步：准备翻译文件

在对应的翻译文件中添加分页和统计相关的翻译键。

**示例：`src/locales/en/yourModule.json`**
```json
{
  "stats": {
    "total": "Total: {count} records",
    "showing": "Showing: {count} records"
  },
  "pagination": {
    "showing": "Showing {from} to {to} of {total} results",
    "rowsPerPage": "Page Size:",
    "page": "Page",
    "of": "of",
    "first": "First Page",
    "previous": "Previous Page",
    "next": "Next Page",
    "last": "Last Page"
  }
}
```

**示例：`src/locales/zh-CN/yourModule.json`**
```json
{
  "stats": {
    "total": "总计: {count} 条记录",
    "showing": "显示: {count} 条记录"
  },
  "pagination": {
    "showing": "显示第 {from} 到 {to} 条，共 {total} 条结果",
    "rowsPerPage": "每页条数:",
    "page": "第",
    "of": "页，共",
    "first": "首页",
    "previous": "上一页",
    "next": "下一页",
    "last": "末页"
  }
}
```

> **注意**：翻译键 `first`, `previous`, `next`, `last` 用于按钮的 `title` 属性（鼠标悬停提示），而不是显示文本。按钮本身使用图标（<< < > >>）。

---

### 第 2 步：定义查询参数类型

```typescript
// types.ts
export interface YourDataQueryParams {
  page?: number
  pageSize?: number
  // 其他筛选参数...
}
```

---

### 第 3 步：实现 API 服务

确保 API 返回标准的分页数据格式：

```typescript
// api/your-api.ts
import { http } from '@/lib/api'
import type { PaginationData } from '@/lib/api'

export class YourApi {
  async list(params?: YourDataQueryParams): Promise<PaginationData<YourData>> {
    const response = await http.get('/your-endpoint', { params })

    // http.get() 已经返回了 response.data
    // 后端标准格式: { success: true, data: [...], pagination: {...} }
    const responseData: any = response

    const items: YourData[] = Array.isArray(responseData.data) ? responseData.data : []
    const pagination = responseData.pagination

    return {
      items,
      total: pagination?.total || 0,
      page: pagination?.page || params?.page || 1,
      pageSize: pagination?.pageSize || params?.pageSize || 20,
      totalPages: pagination?.totalPages || 0,
    }
  }
}

export const yourApi = new YourApi()
```

---

### 第 4 步：在页面组件中使用

```typescript
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AgGridTable, ServerPagination } from '@/components/data-table'
import { useI18n } from '@/lib/i18n'
import { yourApi } from '../api/your-api'
import type { YourDataQueryParams } from '../types'

export function YourDataPage() {
  const { t } = useI18n()

  // 分页状态
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [params, setParams] = useState<YourDataQueryParams>({
    page: 1,
    pageSize: 20,
  })

  // 获取数据
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['your-data', params],
    queryFn: () => yourApi.list(params),
  })

  // 处理分页变化
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    setParams({ ...params, page: newPage })
  }

  // 处理每页大小变化
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
    setParams({ ...params, page: 1, pageSize: newPageSize })
  }

  // AG Grid 列定义
  const columnDefs = useMemo(() => [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
    // 其他列...
  ], [])

  return (
    <Card>
      <CardContent>
        <div className='space-y-4'>
          {/* 统计信息 */}
          <div className='flex gap-4 text-sm text-muted-foreground'>
            <span>{t('yourModule.stats.total', { count: data?.total || 0 })}</span>
            <span>{t('yourModule.stats.showing', { count: data?.items?.length || 0 })}</span>
          </div>

          {/* AG Grid 表格（禁用内置分页） */}
          <AgGridTable
            rowData={data?.items || []}
            columnDefs={columnDefs}
            height='600px'
            pagination={false}  {/* 重要：禁用 AG Grid 内置分页 */}
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
              translationNamespace='yourModule'
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## 关键要点

### ✅ 正确做法

1. **禁用 AG Grid 内置分页**
   ```tsx
   <AgGridTable pagination={false} />
   ```

2. **使用独立的分页状态**
   ```tsx
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(20)
   ```

3. **更新查询参数触发数据重新加载**
   ```tsx
   setParams({ ...params, page: newPage })
   ```

4. **使用 ServerPagination 组件**
   ```tsx
   <ServerPagination
     currentPage={page}
     pageSize={pageSize}
     total={data.total}
     totalPages={data.totalPages}
     onPageChange={handlePageChange}
     onPageSizeChange={handlePageSizeChange}
     translationNamespace='yourModule'
   />
   ```

### ❌ 错误做法

1. ❌ 启用 AG Grid 的内置分页（会导致客户端分页）
   ```tsx
   <AgGridTable pagination={true} />  // 错误！
   ```

2. ❌ 直接使用 `response.data.data`（会多访问一层）
   ```tsx
   const responseData = response.data  // 错误！http.get() 已经返回了 data
   ```

3. ❌ 硬编码分页控件（不可复用，无 i18n）
   ```tsx
   <div>Page {page} of {totalPages}</div>  // 错误！
   ```

---

## 后端 API 响应格式

后端应返回以下标准格式：

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Item 1" },
    { "id": 2, "name": "Item 2" }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

---

## 实际案例参考

完整实现示例请参考：`src/features/audit-logs/pages/audit-logs-page.tsx`

---

## 常见问题

### Q1: 为什么总页数显示不正确？

**A**: 检查 API 响应处理逻辑，确保正确提取 `pagination` 对象：

```typescript
const responseData: any = response  // 不是 response.data
const pagination = responseData.pagination  // 直接访问
```

### Q2: 如何添加筛选功能？

**A**: 在查询参数中添加筛选字段，应用筛选时重置页码：

```typescript
const handleApplyFilters = () => {
  setPage(1)
  setParams({
    ...params,
    page: 1,
    username: filters.username || undefined,
    // 其他筛选条件...
  })
}
```

### Q3: 如何自定义每页大小选项？

**A**: 使用 `pageSizeOptions` 属性：

```tsx
<ServerPagination
  // ...其他 props
  pageSizeOptions={[5, 10, 25, 50]}
/>
```

---

## 总结

使用 `ServerPagination` 组件可以：
- ✅ 快速实现服务端分页
- ✅ 保持 UI 风格统一
- ✅ 完全支持国际化
- ✅ 易于维护和复用

**记住**：所有需要服务端分页的场景都应使用这个方案！
