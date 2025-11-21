/**
 * Roles Management Page - With Real API Integration
 * 角色管理页面 - 真实API集成
 */

import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import { createFileRoute } from '@tanstack/react-router'
import { Plus, Edit, Trash2, Shield } from 'lucide-react'
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
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog'
import { useI18n } from '@/lib/i18n'

import { RoleDialog } from '@/features/users/components/role-dialog'
import { RoleBasicDialog } from '@/features/users/components/role-basic-dialog'
import { RolePermissionsDialog } from '@/features/users/components/role-permissions-dialog'
import { roleService, permissionService } from '@/features/users/services'
import type { Permission, Role, RoleFormData } from '@/features/users/types'

export const Route = createFileRoute('/_authenticated/users/roles')({
  component: RolesPage,
})

// 辅助函数：安全提取错误消息
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return 'Unknown error'
}

function RolesPage() {
  const { t } = useI18n()

  // 状态管理
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 对话框状态
  const [roleDialogOpen, setRoleDialogOpen] = useState(false) // 用于创建角色（含权限）
  const [basicDialogOpen, setBasicDialogOpen] = useState(false) // 用于编辑基本信息
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingRole, setDeletingRole] = useState<Role | null>(null)
  const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false)
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false)
  const [managingPermissionsRole, setManagingPermissionsRole] = useState<Role | null>(null)

  // 加载角色列表
  const loadRoles = useCallback(async () => {
    try {
      setIsLoading(true)
      const rolesData = await roleService.getRoles()
      setRoles(rolesData)
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || t('roles.loadFailed'))
    } finally {
      setIsLoading(false)
    }
  }, [t])

  // 加载权限列表
  const loadPermissions = useCallback(async () => {
    try {
      const permsData = await permissionService.getPermissions()
      setPermissions(permsData)
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || t('roles.loadPermissionsFailed'))
    }
  }, [t])

  // 初始加载
  useEffect(() => {
    loadRoles()
  }, [loadRoles])

  useEffect(() => {
    loadPermissions()
  }, [loadPermissions])

  // 处理创建角色
  const handleCreateRole = () => {
    setEditingRole(null)
    setRoleDialogOpen(true)
  }

  // 处理编辑角色基本信息
  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setBasicDialogOpen(true)
  }

  // 处理基本信息表单提交（仅用于编辑）
  // 使用新的 API: PUT /api/Roles/{id} - 只更新基本信息，不包含权限
  const handleBasicInfoSubmit = async (data: { name: string; code: string; description?: string }) => {
    try {
      if (!editingRole) return

      await roleService.updateRole(editingRole.id, {
        name: data.name,
        code: data.code, // 必须传递 code，否则后端会更新为空
        description: data.description,
      })

      toast.success(t('roles.roleUpdated'))
      setBasicDialogOpen(false)
      setEditingRole(null)
      await loadRoles()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || t('roles.saveFailed'))
      throw error
    }
  }

  // 处理完整角色表单提交（仅用于创建）
  const handleRoleSubmit = async (data: RoleFormData) => {
    try {
      // 将权限代码转换为权限ID（后端期望的是ID列表）
      const permissionIds = permissions
        .filter(p => data.permissions.includes(p.code))
        .map(p => p.id)

      // 创建角色
      await roleService.createRole({
        ...data,
        permissions: permissionIds,
      })
      toast.success(t('roles.roleCreated'))

      setRoleDialogOpen(false)
      await loadRoles()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || t('roles.saveFailed'))
      throw error // 让表单保持打开状态
    }
  }

  // 处理删除角色
  const handleDeleteClick = (role: Role) => {
    if (role.isSystem) {
      toast.error(t('roles.cannotDeleteSystem'))
      return
    }

    if (role.userCount && role.userCount > 0) {
      toast.error(t('roles.cannotDeleteWithUsers').replace('{count}', role.userCount.toString()))
      return
    }

    setDeletingRole(role)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingRole) return

    try {
      await roleService.deleteRole(deletingRole.id)
      toast.success(t('roles.roleDeleted').replace('{name}', deletingRole.name))
      setDeleteDialogOpen(false)
      setDeletingRole(null)
      await loadRoles()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || t('roles.deleteFailed'))
    }
  }

  // 处理批量删除
  const handleBatchDeleteClick = () => {
    const systemRoles = selectedRoles.filter((r) => r.isSystem)
    const rolesWithUsers = selectedRoles.filter((r) => r.userCount && r.userCount > 0)

    if (systemRoles.length > 0) {
      toast.error(t('roles.cannotDeleteSystemBatch'))
      return
    }

    if (rolesWithUsers.length > 0) {
      toast.error(t('roles.cannotDeleteWithUsersBatch'))
      return
    }

    if (selectedRoles.length === 0) return
    setBatchDeleteDialogOpen(true)
  }

  const handleBatchDeleteConfirm = async () => {
    try {
      const ids = selectedRoles.map(r => r.id)
      await roleService.batchDeleteRoles(ids)
      toast.success(t('roles.rolesDeleted').replace('{count}', selectedRoles.length.toString()))
      setBatchDeleteDialogOpen(false)
      setSelectedRoles([])
      await loadRoles()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || t('roles.deleteFailed'))
    }
  }

  // 处理管理权限
  const handleManagePermissions = (role: Role) => {
    setManagingPermissionsRole(role)
    setPermissionsDialogOpen(true)
  }

  // 处理权限更新
  // 使用新的 API: PUT /api/Roles/{id}/permissions - 只更新权限，不更新角色基本信息
  const handlePermissionsUpdate = async (roleId: string, permissionCodes: string[], allPermissions: Permission[]) => {
    try {
      // 将权限代码转换为权限ID（后端期望的是 permissionIds 数组）
      const permissionIds = allPermissions
        .filter(p => permissionCodes.includes(p.code))
        .map(p => p.id)

      await roleService.updateRolePermissions(roleId, permissionIds)

      toast.success(t('roles.permissionsUpdated'))
      setPermissionsDialogOpen(false)
      setManagingPermissionsRole(null)
      await loadRoles()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || t('roles.saveFailed'))
      throw error
    }
  }


  // 系统角色Badge渲染器
  const SystemBadgeCellRenderer = (props: ICellRendererParams<Role>) => {
    const isSystem = props.value
    if (!isSystem) return null

    return (
      <Badge variant='secondary' className='text-xs'>
        {t('roles.system')}
      </Badge>
    )
  }

  // 用户数量渲染器
  const UserCountCellRenderer = (props: ICellRendererParams<Role>) => {
    const count = props.value || 0
    return <span>{count}</span>
  }

  // 权限数量渲染器
  const PermissionsCountCellRenderer = (props: ICellRendererParams<Role>) => {
    if (!props.data) return null
    const permissions = props.data.permissions

    let count = 0
    if (Array.isArray(permissions)) {
      count = permissions.length
    }

    const permissionText = count === 1
      ? t('roles.permissionCount.singular')
      : t('roles.permissionCount.plural')

    return (
      <div className='flex items-center gap-2'>
        <Badge variant='outline' className='font-medium'>
          {count} {permissionText}
        </Badge>
      </div>
    )
  }

  // 操作按钮渲染器
  const ActionsCellRenderer = (props: ICellRendererParams<Role>) => {
    if (!props.data) return null
    const role = props.data

    return (
      <div className='flex items-center justify-center gap-0.5'>
        <Button
          size='sm'
          variant='ghost'
          onClick={() => handleEdit(role)}
          title={t('roles.editRole')}
          className='h-8 w-8 p-0'
        >
          <Edit className='h-3.5 w-3.5' />
        </Button>
        <Button
          size='sm'
          variant='ghost'
          onClick={() => handleManagePermissions(role)}
          title={t('roles.managePermissions')}
          className='h-8 w-8 p-0'
        >
          <Shield className='h-3.5 w-3.5 text-primary' />
        </Button>
        <Button
          size='sm'
          variant='ghost'
          onClick={() => handleDeleteClick(role)}
          disabled={role.isSystem || (role.userCount || 0) > 0}
          title={t('roles.deleteTitle')}
          className='h-8 w-8 p-0'
        >
          <Trash2 className='h-3.5 w-3.5 text-destructive' />
        </Button>
      </div>
    )
  }

  // 日期格式化
  const dateFormatter = (params: { value: string }) => {
    if (!params.value) return '-'
    const date = new Date(params.value)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 列定义
  const columnDefs: ColDef<Role>[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: t('roles.columnRoleName'),
        flex: 1,
        filter: true,
      },
      {
        field: 'code',
        headerName: t('roles.columnCode'),
        width: 150,
        filter: true,
      },
      {
        field: 'description',
        headerName: t('roles.columnDescription'),
        flex: 1.5,
        filter: true,
      },
      {
        field: 'permissions',
        headerName: t('roles.columnPermissions'),
        width: 180,
        cellRenderer: PermissionsCountCellRenderer,
        valueGetter: (params) => {
          const permissions = params.data?.permissions
          return Array.isArray(permissions) ? permissions.length : 0
        },
        sortable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'userCount',
        headerName: t('roles.columnUsers'),
        width: 120,
        cellRenderer: UserCountCellRenderer,
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'isSystem',
        headerName: t('roles.columnType'),
        width: 100,
        cellRenderer: SystemBadgeCellRenderer,
        filter: true,
      },
      {
        field: 'createdAt',
        headerName: t('roles.columnCreated'),
        width: 130,
        valueFormatter: dateFormatter,
        filter: 'agDateColumnFilter',
      },
      {
        headerName: t('roles.columnActions'),
        width: 150,
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
          { title: t('roles.breadcrumb.home'), href: '/' },
          { title: t('roles.breadcrumb.systemManagement') },
          { title: t('roles.breadcrumb.userManagement'), href: '/users' },
          { title: t('roles.breadcrumb.roles') },
        ]}
      />

      <div className='flex-1 p-4 md:p-6 lg:p-8'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>{t('roles.title')}</CardTitle>
                <CardDescription>
                  {t('roles.description')}
                </CardDescription>
              </div>
              <Button onClick={handleCreateRole}>
                <Plus className='mr-2 h-4 w-4' />
                {t('roles.addRole')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
          <div className='space-y-4'>
            {/* 操作栏 */}
            <div className='flex items-center gap-4'>
              {selectedRoles.length > 0 && (
                <Button variant='destructive' size='sm' onClick={handleBatchDeleteClick}>
                  <Trash2 className='mr-2 h-4 w-4' />
                  {t('roles.deleteSelected').replace('{count}', selectedRoles.length.toString())}
                </Button>
              )}
            </div>

            {/* 统计信息 */}
            <div className='flex gap-4 text-sm text-muted-foreground'>
              <span>{t('roles.totalRoles').replace('{count}', roles.length.toString())}</span>
              <span>
                {t('roles.systemRoles').replace('{count}', roles.filter((r) => r.isSystem).length.toString())} |{' '}
                {t('roles.customRoles').replace('{count}', roles.filter((r) => !r.isSystem).length.toString())}
              </span>
              {selectedRoles.length > 0 && (
                <span className='text-primary font-medium'>
                  {t('roles.selectedRoles').replace('{count}', selectedRoles.length.toString())}
                </span>
              )}
            </div>

            {/* 角色表格 */}
            <AgGridTable
              rowData={roles}
              columnDefs={columnDefs}
              height='500px'
              pagination
              paginationPageSize={10}
              onSelectionChanged={setSelectedRoles}
              loading={isLoading}
              gridOptions={{
                rowSelection: {
                  mode: 'multiRow',
                  checkboxes: true,
                  headerCheckbox: true,
                  enableClickSelection: false,
                },
                animateRows: true,
                paginationPageSizeSelector: [10, 20, 50],
              }}
            />
          </div>
          </CardContent>
        </Card>
      </div>

      {/* 角色创建对话框 */}
      <RoleDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        role={null}
        permissions={permissions}
        onSubmit={handleRoleSubmit}
      />

      {/* 角色基本信息编辑对话框 */}
      <RoleBasicDialog
        open={basicDialogOpen}
        onOpenChange={setBasicDialogOpen}
        role={editingRole}
        onSubmit={handleBasicInfoSubmit}
      />

      {/* 单个删除确认对话框 */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('roles.deleteTitle')}
        itemName={deletingRole?.name}
        onConfirm={handleDeleteConfirm}
      />

      {/* 批量删除确认对话框 */}
      <DeleteConfirmDialog
        open={batchDeleteDialogOpen}
        onOpenChange={setBatchDeleteDialogOpen}
        title={t('roles.deleteMultipleTitle')}
        description={t('roles.deleteConfirm').replace('{count}', selectedRoles.length.toString())}
        onConfirm={handleBatchDeleteConfirm}
      />

      {/* 权限管理对话框 */}
      <RolePermissionsDialog
        open={permissionsDialogOpen}
        onOpenChange={setPermissionsDialogOpen}
        role={managingPermissionsRole}
        onSubmit={handlePermissionsUpdate}
      />
    </div>
  )
}
