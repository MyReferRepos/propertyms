/**
 * Users Management Page - With Real API Integration
 * 用户管理页面 - 真实API集成
 */

import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import { createFileRoute } from '@tanstack/react-router'
import {
  Plus,
  Edit,
  Trash2,
  UserX,
  UserCheck,
  Key,
  MoreVertical,
  RefreshCw,
} from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog'

import { UserDialog } from '@/features/users/components/user-dialog'
import { ChangePasswordDialog } from '@/features/users/components/change-password-dialog'
import { userService, roleService } from '@/features/users/services'
import { UserStatus, type CreateUserRequest, type Role, type UpdateUserRequest, type User } from '@/features/users/types'
import { useI18n } from '@/lib/i18n'

export const Route = createFileRoute('/_authenticated/users/')({
  component: UsersPage,
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

function UsersPage() {
  const { t } = useI18n()

  // 状态管理
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [searchText, setSearchText] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [currentPage, _setCurrentPage] = useState(1)
  const [pageSize, _setPageSize] = useState(10)

  // 对话框状态
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false)
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false)
  const [changePasswordUser, setChangePasswordUser] = useState<User | null>(null)

  // 加载用户列表
  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await userService.getUsers({
        page: currentPage,
        pageSize,
        keyword: searchText || undefined,
        status: statusFilter !== 'all' ? (statusFilter as UserStatus) : undefined,
      })

      // 前端角色过滤
      let filteredUsers = response.data
      if (roleFilter !== 'all') {
        filteredUsers = response.data.filter((user) => {
          const userRoles = Array.isArray(user.roles)
            ? user.roles.map((r) => (typeof r === 'string' ? r : r.id))
            : []
          return userRoles.includes(roleFilter)
        })
      }

      setUsers(filteredUsers)
      setTotal(roleFilter !== 'all' ? filteredUsers.length : (response.total ?? 0))
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || t('users.loadFailed'))
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, searchText, roleFilter, statusFilter, t])

  // 加载角色列表
  const loadRoles = useCallback(async () => {
    try {
      const roles = await roleService.getRoles()
      setRoles(roles)
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || t('users.roleLoadFailed'))
    }
  }, [t])

  // 初始加载
  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  useEffect(() => {
    loadRoles()
  }, [loadRoles])

  // 处理创建用户
  const handleCreateUser = () => {
    setEditingUser(null)
    setUserDialogOpen(true)
  }

  // 处理编辑用户
  const handleEdit = (user: User) => {
    setEditingUser(user)
    setUserDialogOpen(true)
  }

  // 处理用户表单提交
  const handleUserSubmit = async (data: CreateUserRequest | UpdateUserRequest) => {
    try {
      if (editingUser) {
        // 更新用户
        await userService.updateUser(editingUser.id, data as UpdateUserRequest)
        toast.success(t('users.userUpdated'))
      } else {
        // 创建用户
        await userService.createUser(data as CreateUserRequest)
        toast.success(t('users.userCreated'))
      }

      setUserDialogOpen(false)
      setEditingUser(null)
      await loadUsers()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || t('users.saveFailed'))
      throw error // 让表单保持打开状态
    }
  }

  // 处理删除用户
  const handleDeleteClick = (user: User) => {
    setDeletingUser(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return

    try {
      await userService.deleteUser(deletingUser.id)
      toast.success(t('users.userDeleted').replace('{name}', deletingUser.displayName || deletingUser.username))
      setDeleteDialogOpen(false)
      setDeletingUser(null)
      await loadUsers()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || t('users.deleteFailed'))
    }
  }

  // 处理批量删除
  const handleBatchDeleteClick = () => {
    if (selectedUsers.length === 0) return
    setBatchDeleteDialogOpen(true)
  }

  const handleBatchDeleteConfirm = async () => {
    try {
      const ids = selectedUsers.map(u => u.id)
      await userService.batchDeleteUsers(ids)
      toast.success(t('users.deleteSelected').replace('{count}', selectedUsers.length.toString()) + ' successfully')
      setBatchDeleteDialogOpen(false)
      setSelectedUsers([])
      await loadUsers()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || t('users.deleteFailed'))
    }
  }

  // 处理状态变更
  const handleChangeStatus = async (user: User, newStatus: UserStatus) => {
    try {
      await userService.changeUserStatus(user.id, newStatus)
      toast.success(`Status updated to ${newStatus}`)
      await loadUsers()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || t('users.saveFailed'))
    }
  }

  // 处理修改密码点击
  const handleChangePasswordClick = (user: User) => {
    setChangePasswordUser(user)
    setChangePasswordDialogOpen(true)
  }

  // 处理修改密码提交
  const handleChangePasswordSubmit = async (userId: string, newPassword: string) => {
    try {
      await userService.changePassword({
        userId,
        newPassword,
        confirmPassword: newPassword,
      })
      toast.success(t('users.changePasswordDialog.success'))
      setChangePasswordDialogOpen(false)
      setChangePasswordUser(null)
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || t('users.changePasswordDialog.failed'))
    }
  }

  // 状态Badge渲染器
  const StatusCellRenderer = (props: ICellRendererParams<User>) => {
    const status = props.value as UserStatus
    const variants = {
      [UserStatus.ACTIVE]: 'default' as const,
      [UserStatus.INACTIVE]: 'secondary' as const,
      [UserStatus.SUSPENDED]: 'destructive' as const,
      [UserStatus.PENDING]: 'outline' as const,
    }

    return (
      <Badge variant={variants[status]} className='capitalize'>
        {status}
      </Badge>
    )
  }

  // 角色渲染器
  const RolesCellRenderer = (props: ICellRendererParams<User>) => {
    const roles = props.data?.roles
    if (!Array.isArray(roles) || roles.length === 0) return null

    return (
      <div className='flex items-center justify-center flex-wrap gap-1'>
        {roles.map((role, index) => {
          const roleName = typeof role === 'string' ? role : role.name
          return (
            <Badge key={index} variant='outline' className='text-xs'>
              {roleName}
            </Badge>
          )
        })}
      </div>
    )
  }

  // 操作按钮渲染器
  const ActionsCellRenderer = (props: ICellRendererParams<User>) => {
    if (!props.data) return null
    const user = props.data

    return (
      <div className='flex items-center gap-1'>
        <Button size='sm' variant='ghost' onClick={() => handleEdit(user)}>
          <Edit className='h-4 w-4' />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size='sm' variant='ghost'>
              <MoreVertical className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => handleChangePasswordClick(user)}>
              <Key className='mr-2 h-4 w-4' />
              {t('users.changePassword')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user.status === UserStatus.ACTIVE ? (
              <DropdownMenuItem onClick={() => handleChangeStatus(user, UserStatus.SUSPENDED)}>
                <UserX className='mr-2 h-4 w-4' />
                {t('users.suspendUser')}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => handleChangeStatus(user, UserStatus.ACTIVE)}>
                <UserCheck className='mr-2 h-4 w-4' />
                {t('users.activateUser')}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive focus:text-destructive'
              onClick={() => handleDeleteClick(user)}
            >
              <Trash2 className='mr-2 h-4 w-4' />
              {t('users.deleteUser')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
  const columnDefs: ColDef<User>[] = useMemo(
    () => [
      {
        field: 'username',
        headerName: t('users.columnUsername'),
        flex: 1,
        filter: true,
      },
      {
        field: 'email',
        headerName: t('users.columnEmail'),
        flex: 1.2,
        filter: true,
      },
      {
        field: 'displayName',
        headerName: t('users.columnName'),
        flex: 1,
        filter: true,
      },
      {
        field: 'department',
        headerName: t('users.columnDepartment'),
        width: 130,
        filter: true,
      },
      {
        field: 'position',
        headerName: t('users.columnPosition'),
        width: 130,
        filter: true,
      },
      {
        field: 'roles',
        headerName: t('users.columnRoles'),
        width: 150,
        cellRenderer: RolesCellRenderer,
        cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
        // 为对象数组提供 valueGetter 以避免 AG Grid 警告
        valueGetter: (params) => {
          if (!params.data?.roles) return ''
          const roles = params.data.roles
          return Array.isArray(roles)
            ? roles.map(r => typeof r === 'string' ? r : r.name).join(', ')
            : ''
        },
      },
      {
        field: 'status',
        headerName: t('users.columnStatus'),
        width: 120,
        cellRenderer: StatusCellRenderer,
        filter: true,
        // 为状态字段提供 valueGetter
        valueGetter: (params) => params.data?.status || '',
      },
      {
        field: 'lastLoginAt',
        headerName: t('users.columnLastLogin'),
        width: 130,
        valueFormatter: dateFormatter,
        filter: 'agDateColumnFilter',
      },
      {
        headerName: t('users.columnActions'),
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
          { title: 'Users' },
        ]}
      />

      <div className='flex-1 p-4 md:p-6 lg:p-8'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>{t('users.title')}</CardTitle>
                <CardDescription>{t('users.description')}</CardDescription>
              </div>
              <div className='flex gap-2'>
                <Button variant='outline' onClick={loadUsers} disabled={isLoading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {t('users.refresh')}
                </Button>
                <Button onClick={handleCreateUser}>
                  <Plus className='mr-2 h-4 w-4' />
                  {t('users.addUser')}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {/* 搜索和筛选 */}
              <div className='flex items-center gap-4'>
                <Input
                  placeholder={t('users.searchPlaceholder')}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className='max-w-sm'
                />
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder={t('users.filterByRole')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>{t('users.allRoles')}</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder={t('users.filterByStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>{t('users.allStatus')}</SelectItem>
                    <SelectItem value={UserStatus.ACTIVE}>{t('users.active')}</SelectItem>
                    <SelectItem value={UserStatus.INACTIVE}>{t('users.inactive')}</SelectItem>
                    <SelectItem value={UserStatus.SUSPENDED}>{t('users.suspended')}</SelectItem>
                    <SelectItem value={UserStatus.PENDING}>{t('users.pending')}</SelectItem>
                  </SelectContent>
                </Select>
                {selectedUsers.length > 0 && (
                  <Button variant='destructive' size='sm' onClick={handleBatchDeleteClick}>
                    <Trash2 className='mr-2 h-4 w-4' />
                    {t('users.deleteSelected').replace('{count}', selectedUsers.length.toString())}
                  </Button>
                )}
              </div>

              {/* 统计信息 */}
              <div className='flex gap-4 text-sm text-muted-foreground'>
                <span>{t('users.totalUsers').replace('{count}', (total ?? 0).toString())}</span>
                <span>{t('users.showingUsers').replace('{count}', (users?.length ?? 0).toString())}</span>
                {selectedUsers.length > 0 && (
                  <span className='text-primary font-medium'>
                    {t('users.selectedUsers').replace('{count}', selectedUsers.length.toString())}
                  </span>
                )}
              </div>

              {/* 用户表格 */}
              <AgGridTable
                rowData={users}
                columnDefs={columnDefs}
                height='600px'
                pagination
                paginationPageSize={pageSize}
                onSelectionChanged={setSelectedUsers}
                loading={isLoading}
                gridOptions={{
                  rowSelection: {
                    mode: 'multiRow',
                    checkboxes: true,
                    headerCheckbox: true,
                    enableClickSelection: false,
                  },
                  animateRows: true,
                  paginationPageSizeSelector: [10, 20, 50, 100],
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 用户创建/编辑对话框 */}
      <UserDialog
        open={userDialogOpen}
        onOpenChange={setUserDialogOpen}
        user={editingUser}
        roles={roles}
        onSubmit={handleUserSubmit}
      />

      {/* 单个删除确认对话框 */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('users.deleteTitle')}
        itemName={deletingUser?.displayName || deletingUser?.username}
        onConfirm={handleDeleteConfirm}
      />

      {/* 批量删除确认对话框 */}
      <DeleteConfirmDialog
        open={batchDeleteDialogOpen}
        onOpenChange={setBatchDeleteDialogOpen}
        title={t('users.deleteMultipleTitle')}
        description={t('users.deleteConfirm').replace('{count}', selectedUsers.length.toString())}
        onConfirm={handleBatchDeleteConfirm}
      />

      {/* 修改密码对话框 */}
      <ChangePasswordDialog
        open={changePasswordDialogOpen}
        onOpenChange={setChangePasswordDialogOpen}
        user={changePasswordUser}
        onSubmit={handleChangePasswordSubmit}
      />
    </div>
  )
}
