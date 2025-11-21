/**
 * Permissions Management Page
 * 权限管理页面
 */

import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import { createFileRoute } from '@tanstack/react-router'
import { Shield, ChevronDown, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog'

import { PermissionDialogNew } from '@/features/users/components/permission-dialog-new'
import { permissionService } from '@/features/users/services'
import type { CreatePermissionRequest, Permission, UpdatePermissionRequest } from '@/features/users/types'
import { PermissionType } from '@/features/users/types'
import { useI18n } from '@/lib/i18n'
import { moduleApi } from '@/features/modules/api/module-api'
import type { ModuleListItem } from '@/features/modules/types'

export const Route = createFileRoute('/_authenticated/users/permissions')({
  component: PermissionsPage,
})

function PermissionsPage() {
  const { t } = useI18n()

  // 状态管理
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [modules, setModules] = useState<ModuleListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | PermissionType>('all')
  const [moduleFilter, setModuleFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table')
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  // 对话框状态
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingPermission, setDeletingPermission] = useState<Permission | null>(null)

  // 加载模块列表
  const loadModules = useCallback(async () => {
    try {
      const modulesData = await moduleApi.list(false) // 获取所有模块（包括未激活的）
      setModules(modulesData)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('permissions.loadFailed')
      toast.error(message)
    }
  }, [t])

  // 加载权限列表
  const loadPermissions = useCallback(async () => {
    try {
      setIsLoading(true)
      const permsData = await permissionService.getPermissions()
      setPermissions(permsData)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('permissions.loadFailed')
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [t])

  // 初始加载
  useEffect(() => {
    const loadData = async () => {
      await loadModules()
      await loadPermissions()
    }
    loadData()
  }, [loadModules, loadPermissions])

  // 当模块加载完成后，默认展开所有模块
  useEffect(() => {
    if (modules.length > 0) {
      const allModuleCodes = modules.map(m => m.code)
      setExpandedModules(new Set(allModuleCodes))
    }
  }, [modules])

  // 获取所有MODULE类型的权限
  const modulePermissions = useMemo(() => {
    return permissions.filter(p => p.type === PermissionType.MODULE)
  }, [permissions])

  // 按模块组织权限（用于树形视图的层级结构）
  const hierarchicalPermissions = useMemo(() => {
    const result: Record<string, { module: ModuleListItem, modulePermission: Permission | undefined, actions: Permission[] }> = {}

    // 为每个模块（从模块管理API）收集其关联的权限
    modules.forEach(module => {
      // 找到该模块对应的 MODULE 类型权限（如果有的话）
      const modulePermission = permissions.find(
        p => p.type === PermissionType.MODULE && p.moduleId === module.id
      )

      // 找到该模块下的所有 ACTION 类型权限
      const actions = permissions.filter(
        p => p.type === PermissionType.ACTION && p.moduleId === module.id
      )

      result[module.id] = {
        module,
        modulePermission,
        actions
      }
    })

    return result
  }, [permissions, modules])

  // 过滤权限
  const filteredPermissions = useMemo(() => {
    let filtered = permissions

    // 按搜索文本过滤
    if (searchText) {
      const lower = searchText.toLowerCase()
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(lower) ||
          p.code.toLowerCase().includes(lower) ||
          p.path?.toLowerCase().includes(lower) ||
          p.description?.toLowerCase().includes(lower)
      )
    }

    // 按类型过滤
    if (typeFilter !== 'all') {
      filtered = filtered.filter(p => p.type === typeFilter)
    }

    // 按所属模块过滤
    if (moduleFilter !== 'all') {
      filtered = filtered.filter(p =>
        // MODULE类型：检查权限自己的moduleId是否匹配
        // ACTION类型：检查权限的moduleId是否匹配选中的模块
        p.moduleId === moduleFilter
      )
    }

    return filtered
  }, [permissions, searchText, typeFilter, moduleFilter])

  // 切换模块展开状态
  const toggleModule = (module: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(module)) {
        newSet.delete(module)
      } else {
        newSet.add(module)
      }
      return newSet
    })
  }

  // 展开所有模块
  const expandAll = () => {
    const allModuleCodes = modules.map(m => m.code)
    setExpandedModules(new Set(allModuleCodes))
  }

  // 折叠所有模块
  const collapseAll = () => {
    setExpandedModules(new Set())
  }

  // 处理创建权限
  const handleCreatePermission = () => {
    setEditingPermission(null)
    setPermissionDialogOpen(true)
  }

  // 处理编辑权限
  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission)
    setPermissionDialogOpen(true)
  }

  // 处理权限表单提交
  const handlePermissionSubmit = async (data: CreatePermissionRequest | UpdatePermissionRequest) => {
    try {
      if (editingPermission) {
        // 更新权限
        await permissionService.updatePermission(editingPermission.id, data as UpdatePermissionRequest)
        toast.success(t('permissions.permissionUpdated'))
      } else {
        // 创建权限
        await permissionService.createPermission(data as CreatePermissionRequest)
        toast.success(t('permissions.permissionCreated'))
      }

      setPermissionDialogOpen(false)
      setEditingPermission(null)
      await loadPermissions()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('permissions.saveFailed')
      toast.error(message)
      throw error // 让表单保持打开状态
    }
  }

  // 处理删除权限
  const handleDeleteClick = (permission: Permission) => {
    setDeletingPermission(permission)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingPermission) return

    try {
      await permissionService.deletePermission(deletingPermission.id)
      toast.success(t('permissions.permissionDeleted').replace('{name}', deletingPermission.name))
      setDeleteDialogOpen(false)
      setDeletingPermission(null)
      await loadPermissions()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('permissions.deleteFailed')
      toast.error(message)
    }
  }

  // 模块Badge渲染器（显示所属模块，ACTION类型才有值）
  const ModuleCellRenderer = (props: ICellRendererParams<Permission>) => {
    const permission = props.data
    if (!permission) return null

    // MODULE类型显示自身code
    if (permission.type === PermissionType.MODULE) {
      return (
        <Badge variant='default' className='capitalize bg-blue-600'>
          {permission.code}
        </Badge>
      )
    }

    // ACTION类型显示所属module
    if (permission.moduleCode) {
      return (
        <Badge variant='outline' className='capitalize'>
          {permission.moduleCode}
        </Badge>
      )
    }

    return null
  }

  // Path渲染器
  const PathCellRenderer = (props: ICellRendererParams<Permission>) => {
    const path = props.value
    if (!path) return null

    return (
      <code className='text-xs bg-muted px-2 py-1 rounded'>
        {path}
      </code>
    )
  }

  // 操作按钮渲染器
  const ActionsCellRenderer = (props: ICellRendererParams<Permission>) => {
    if (!props.data) return null
    const permission = props.data

    return (
      <div className='flex items-center gap-1'>
        <Button size='sm' variant='ghost' onClick={() => handleEdit(permission)}>
          <Edit className='h-4 w-4' />
        </Button>
        <Button
          size='sm'
          variant='ghost'
          onClick={() => handleDeleteClick(permission)}
        >
          <Trash2 className='h-4 w-4 text-destructive' />
        </Button>
      </div>
    )
  }

  // 类型Badge渲染器
  const TypeCellRenderer = (props: ICellRendererParams<Permission>) => {
    const type = props.value
    if (!type) return null

    return (
      <Badge
        variant={type === PermissionType.MODULE ? 'default' : 'outline'}
        className={type === PermissionType.MODULE ? 'bg-blue-600 text-white' : ''}
      >
        {type === PermissionType.MODULE ? 'MODULE' : 'ACTION'}
      </Badge>
    )
  }

  // 列定义
  const columnDefs: ColDef<Permission>[] = useMemo(
    () => [
      {
        field: 'type',
        headerName: t('permissions.columnType'),
        width: 100,
        cellRenderer: TypeCellRenderer,
        filter: true,
      },
      {
        field: 'name',
        headerName: t('permissions.columnPermissionName'),
        flex: 1,
        filter: true,
      },
      {
        field: 'code',
        headerName: t('permissions.columnCode'),
        width: 180,
        filter: true,
        cellRenderer: (props: ICellRendererParams<Permission>) => {
          return (
            <Badge variant='secondary' className='font-mono text-xs'>
              {props.value}
            </Badge>
          )
        },
      },
      {
        field: 'moduleCode',
        headerName: t('permissions.columnModule'),
        width: 150,
        cellRenderer: ModuleCellRenderer,
        filter: true,
      },
      {
        field: 'path',
        headerName: 'API Path',
        width: 250,
        cellRenderer: PathCellRenderer,
        filter: true,
      },
      {
        field: 'description',
        headerName: t('permissions.columnDescription'),
        flex: 1,
        filter: true,
      },
      {
        headerName: t('permissions.columnActions'),
        width: 120,
        cellRenderer: ActionsCellRenderer,
        pinned: 'right',
        sortable: false,
        filter: false,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  )

  return (
    <div className='flex flex-1 flex-col'>
      <PageHeader
        breadcrumbs={[
          { title: 'Home', href: '/' },
          { title: 'System Management' },
          { title: 'User Management', href: '/users' },
          { title: 'Permissions' },
        ]}
      />

      <div className='flex-1 p-4 md:p-6 lg:p-8'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>{t('permissions.title')}</CardTitle>
                <CardDescription>
                  {t('permissions.description')}
                </CardDescription>
              </div>
              <div className='flex gap-2'>
                <Button onClick={handleCreatePermission}>
                  <Plus className='mr-2 h-4 w-4' />
                  {t('permissions.addPermission')}
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setViewMode('table')}
                >
                  {t('permissions.tableView')}
                </Button>
                <Button
                  variant={viewMode === 'tree' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setViewMode('tree')}
                >
                  {t('permissions.treeView')}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {/* 搜索和筛选 */}
              <div className='flex items-center gap-4 flex-wrap'>
                <Input
                  placeholder={t('permissions.searchPlaceholder')}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className='max-w-sm'
                />
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
                  <SelectTrigger className='w-[150px]'>
                    <SelectValue placeholder='Filter by Type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Types</SelectItem>
                    <SelectItem value={PermissionType.MODULE}>MODULE</SelectItem>
                    <SelectItem value={PermissionType.ACTION}>ACTION</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={moduleFilter} onValueChange={setModuleFilter}>
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder={t('permissions.filterByModule')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>{t('permissions.allModules')}</SelectItem>
                    {modules.map((module) => (
                      <SelectItem key={module.id} value={module.id} className='capitalize'>
                        {module.name} ({module.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {viewMode === 'tree' && (
                  <div className='flex gap-2'>
                    <Button variant='outline' size='sm' onClick={expandAll}>
                      {t('permissions.expandAll')}
                    </Button>
                    <Button variant='outline' size='sm' onClick={collapseAll}>
                      {t('permissions.collapseAll')}
                    </Button>
                  </div>
                )}
              </div>

              {/* 统计信息 */}
              <div className='flex gap-4 text-sm text-muted-foreground'>
                <span>{t('permissions.totalPermissions').replace('{count}', permissions.length.toString())}</span>
                <span>{t('permissions.modulesCount').replace('{count}', modulePermissions.length.toString())}</span>
                {searchText || moduleFilter !== 'all' || typeFilter !== 'all' ? (
                  <span className='text-primary font-medium'>
                    {t('permissions.filteredPermissions').replace('{count}', filteredPermissions.length.toString())}
                  </span>
                ) : null}
              </div>

              {/* 表格视图 */}
              {viewMode === 'table' && (
                <AgGridTable
                  rowData={filteredPermissions}
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
              )}

              {/* 树形视图 - 显示MODULE和ACTION层级结构 */}
              {viewMode === 'tree' && (
                <div className='rounded-md border'>
                  <div className='divide-y'>
                    {Object.entries(hierarchicalPermissions)
                      .filter(
                        ([moduleId]) =>
                          moduleFilter === 'all' || moduleId === moduleFilter
                      )
                      .map(([moduleId, { module, modulePermission, actions }]) => {
                        // 应用搜索过滤
                        const matchesSearch = (p: Permission) => {
                          if (!searchText) return true
                          const lower = searchText.toLowerCase()
                          return (
                            p.name.toLowerCase().includes(lower) ||
                            p.code.toLowerCase().includes(lower) ||
                            p.path?.toLowerCase().includes(lower) ||
                            p.description?.toLowerCase().includes(lower)
                          )
                        }

                        // 模块搜索匹配（ModuleListItem）
                        const moduleMatchesSearch = () => {
                          if (!searchText) return true
                          const lower = searchText.toLowerCase()
                          return (
                            module.name.toLowerCase().includes(lower) ||
                            module.code.toLowerCase().includes(lower) ||
                            module.description?.toLowerCase().includes(lower)
                          )
                        }

                        const moduleMatches = moduleMatchesSearch()
                        const filteredActions = actions.filter(matchesSearch)

                        // 如果模块和所有action都不匹配搜索，跳过
                        if (!moduleMatches && filteredActions.length === 0) return null

                        return (
                          <div key={moduleId} className='p-4'>
                            {/* 模块头部 */}
                            <div className='flex items-center gap-2 mb-3'>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-6 w-6 p-0'
                                onClick={() => toggleModule(module.code)}
                              >
                                {expandedModules.has(module.code) ? (
                                  <ChevronDown className='h-4 w-4' />
                                ) : (
                                  <ChevronRight className='h-4 w-4' />
                                )}
                              </Button>
                              <Shield className='h-5 w-5 text-primary' />
                              <span className='font-semibold text-lg'>
                                {module.name}
                              </span>
                              <Badge variant='outline' className='font-mono text-xs'>
                                {module.code}
                              </Badge>
                              <Badge variant='default' className='ml-2 bg-blue-600'>
                                MODULE
                              </Badge>
                              <Badge variant='outline' className='ml-auto'>
                                {filteredActions.length} actions
                              </Badge>
                            </div>

                            {/* 模块详情和action列表 */}
                            {expandedModules.has(module.code) && (
                              <div className='ml-8 space-y-4'>
                                {/* MODULE权限卡片 - 仅在有MODULE类型权限时显示 */}
                                {modulePermission && (
                                  <div className='flex items-start gap-3 p-3 rounded-md bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors group border-l-4 border-blue-500'>
                                    <Shield className='h-4 w-4 mt-1 text-blue-600 dark:text-blue-400' />
                                    <div className='flex-1 space-y-1'>
                                      <div className='flex items-center gap-2 flex-wrap'>
                                        <span className='font-medium'>
                                          {modulePermission.name}
                                        </span>
                                        {modulePermission.path && (
                                          <code className='text-xs bg-blue-200 dark:bg-blue-900 px-2 py-1 rounded'>
                                            {modulePermission.path}
                                          </code>
                                        )}
                                      </div>
                                      {modulePermission.description && (
                                        <p className='text-sm text-muted-foreground'>
                                          {modulePermission.description}
                                        </p>
                                      )}
                                    </div>
                                    <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                                      <Button size='sm' variant='ghost' onClick={() => handleEdit(modulePermission)}>
                                        <Edit className='h-4 w-4' />
                                      </Button>
                                      <Button
                                        size='sm'
                                        variant='ghost'
                                        onClick={() => handleDeleteClick(modulePermission)}
                                      >
                                        <Trash2 className='h-4 w-4 text-destructive' />
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {/* ACTION权限列表 */}
                                {filteredActions.length > 0 && (
                                  <div className='ml-6 space-y-2 border-l-2 border-muted pl-4'>
                                    {filteredActions.map((action) => (
                                      <div
                                        key={action.id}
                                        className='flex items-start gap-3 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors group'
                                      >
                                        <Shield className='h-3 w-3 mt-1 text-muted-foreground' />
                                        <div className='flex-1 space-y-1'>
                                          <div className='flex items-center gap-2 flex-wrap'>
                                            <Badge variant='outline' className='text-xs'>ACTION</Badge>
                                            <span className='text-sm font-medium'>
                                              {action.name}
                                            </span>
                                            <Badge variant='secondary' className='font-mono text-xs'>
                                              {action.code}
                                            </Badge>
                                            <code className='text-xs bg-muted px-2 py-1 rounded'>
                                              {action.path}
                                            </code>
                                          </div>
                                          {action.description && (
                                            <p className='text-xs text-muted-foreground'>
                                              {action.description}
                                            </p>
                                          )}
                                        </div>
                                        <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                                          <Button size='sm' variant='ghost' onClick={() => handleEdit(action)}>
                                            <Edit className='h-3 w-3' />
                                          </Button>
                                          <Button
                                            size='sm'
                                            variant='ghost'
                                            onClick={() => handleDeleteClick(action)}
                                          >
                                            <Trash2 className='h-3 w-3 text-destructive' />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 权限创建/编辑对话框 - 新模型 */}
      <PermissionDialogNew
        open={permissionDialogOpen}
        onOpenChange={setPermissionDialogOpen}
        permission={editingPermission}
        modules={modules}
        onSubmit={handlePermissionSubmit}
      />

      {/* 删除确认对话框 */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('permissions.deleteTitle')}
        itemName={deletingPermission?.name}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
