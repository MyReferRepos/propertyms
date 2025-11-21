/**
 * Modules Management Page
 * 模块管理页面
 */

import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { AgGridTable } from '@/components/data-table'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog'
import { getIconComponent } from '@/components/layout/utils/icon-mapper'
import { moduleApi } from '../api/module-api'
import { ModuleFormDialog } from '../components/module-form-dialog'
import type { ModuleListItem, CreateModuleRequest } from '../types'

export function ModulesPage() {
  const queryClient = useQueryClient()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingModule, setEditingModule] = useState<ModuleListItem | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingModule, setDeletingModule] = useState<ModuleListItem | null>(null)

  // 获取模块列表
  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['modules'],
    queryFn: () => moduleApi.list(false),
  })

  // 创建模块
  const createMutation = useMutation({
    mutationFn: (data: CreateModuleRequest) => moduleApi.create(data),
    onSuccess: () => {
      toast.success('模块创建成功')
      queryClient.invalidateQueries({ queryKey: ['modules'] })
      queryClient.invalidateQueries({ queryKey: ['sidebar-menu'] })
      setDialogOpen(false)
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || '创建失败'
      toast.error(message)
    },
  })

  // 更新模块
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateModuleRequest }) =>
      moduleApi.update(id, data),
    onSuccess: () => {
      toast.success('模块更新成功')
      queryClient.invalidateQueries({ queryKey: ['modules'] })
      queryClient.invalidateQueries({ queryKey: ['sidebar-menu'] })
      setDialogOpen(false)
      setEditingModule(null)
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || '更新失败'
      toast.error(message)
    },
  })

  // 删除模块
  const deleteMutation = useMutation({
    mutationFn: (id: string) => moduleApi.delete(id),
    onSuccess: () => {
      toast.success('模块删除成功')
      queryClient.invalidateQueries({ queryKey: ['modules'] })
      queryClient.invalidateQueries({ queryKey: ['sidebar-menu'] })
      setDeleteDialogOpen(false)
      setDeletingModule(null)
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || '删除失败'
      toast.error(message)
    },
  })

  const handleCreate = () => {
    setEditingModule(null)
    setDialogOpen(true)
  }

  const handleEdit = (module: ModuleListItem) => {
    setEditingModule(module)
    setDialogOpen(true)
  }

  const handleDelete = (module: ModuleListItem) => {
    setDeletingModule(module)
    setDeleteDialogOpen(true)
  }

  const handleSubmit = async (data: CreateModuleRequest) => {
    if (editingModule) {
      await updateMutation.mutateAsync({ id: editingModule.id, data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  const confirmDelete = () => {
    if (deletingModule) {
      deleteMutation.mutate(deletingModule.id)
    }
  }

  // Icon渲染器
  const IconCellRenderer = (props: ICellRendererParams<ModuleListItem>) => {
    const iconName = props.value
    if (!iconName) return null

    const IconComponent = getIconComponent(iconName)
    if (!IconComponent) return null

    return (
      <div className='flex items-center gap-2'>
        <IconComponent className='h-4 w-4' />
        <span className='text-xs text-muted-foreground'>{iconName}</span>
      </div>
    )
  }

  // 状态Badge渲染器
  const StatusCellRenderer = (props: ICellRendererParams<ModuleListItem>) => {
    const isActive = props.value
    return (
      <Badge variant={isActive ? 'default' : 'secondary'}>
        {isActive ? '激活' : '未激活'}
      </Badge>
    )
  }

  // 权限数量渲染器
  const PermissionCountCellRenderer = (props: ICellRendererParams<ModuleListItem>) => {
    const count = props.value || 0
    return (
      <Badge variant='outline' className='font-mono'>
        {count}
      </Badge>
    )
  }

  // 操作按钮渲染器
  const ActionsCellRenderer = (props: ICellRendererParams<ModuleListItem>) => {
    if (!props.data) return null
    const module = props.data

    return (
      <div className='flex items-center gap-1'>
        <Button size='sm' variant='ghost' onClick={() => handleEdit(module)}>
          <Edit className='h-4 w-4' />
        </Button>
        <Button
          size='sm'
          variant='ghost'
          onClick={() => handleDelete(module)}
        >
          <Trash2 className='h-4 w-4 text-destructive' />
        </Button>
      </div>
    )
  }

  // 日期渲染器
  const DateCellRenderer = (props: ICellRendererParams<ModuleListItem>) => {
    const date = props.value
    if (!date) return null
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 列定义
  const columnDefs: ColDef<ModuleListItem>[] = useMemo(
    () => [
      {
        field: 'code',
        headerName: '模块代码',
        width: 150,
        filter: true,
        cellRenderer: (props: ICellRendererParams<ModuleListItem>) => {
          return (
            <Badge variant='secondary' className='font-mono text-xs'>
              {props.value}
            </Badge>
          )
        },
      },
      {
        field: 'name',
        headerName: '模块名称',
        flex: 1,
        filter: true,
      },
      {
        field: 'icon',
        headerName: '图标',
        width: 150,
        cellRenderer: IconCellRenderer,
      },
      {
        field: 'description',
        headerName: '描述',
        flex: 2,
        filter: true,
      },
      {
        field: 'sortOrder',
        headerName: '排序',
        width: 80,
        type: 'numericColumn',
      },
      {
        field: 'permissionCount',
        headerName: '权限数',
        width: 100,
        cellRenderer: PermissionCountCellRenderer,
        type: 'numericColumn',
      },
      {
        field: 'isActive',
        headerName: '状态',
        width: 100,
        cellRenderer: StatusCellRenderer,
        filter: true,
      },
      {
        field: 'createdAt',
        headerName: '创建时间',
        width: 180,
        cellRenderer: DateCellRenderer,
        filter: 'agDateColumnFilter',
      },
      {
        headerName: '操作',
        width: 120,
        cellRenderer: ActionsCellRenderer,
        pinned: 'right',
        sortable: false,
        filter: false,
      },
    ],
    []
  )

  return (
    <div className='flex flex-1 flex-col'>
      <PageHeader
        breadcrumbs={[
          { title: 'Home', href: '/' },
          { title: 'System Management' },
          { title: 'Modules' },
        ]}
      />

      <div className='flex-1 p-4 md:p-6 lg:p-8'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>模块管理</CardTitle>
                <CardDescription>
                  管理系统功能模块，每个模块可以包含多个权限
                </CardDescription>
              </div>
              <Button onClick={handleCreate}>
                <Plus className='mr-2 h-4 w-4' />
                创建模块
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {/* 统计信息 */}
              <div className='flex gap-4 text-sm text-muted-foreground'>
                <span>总计: {modules.length} 个模块</span>
                <span>激活: {modules.filter(m => m.isActive).length} 个</span>
              </div>

              {/* 表格 */}
              <AgGridTable
                rowData={modules}
                columnDefs={columnDefs}
                height='600px'
                pagination
                paginationPageSize={20}
                loading={isLoading}
                gridOptions={{
                  animateRows: true,
                  paginationPageSizeSelector: [10, 20, 50, 100],
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 模块创建/编辑对话框 */}
      <ModuleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        module={editingModule}
        onSubmit={handleSubmit}
      />

      {/* 删除确认对话框 */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title='删除模块'
        itemName={deletingModule?.name}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
