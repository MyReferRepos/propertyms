/**
 * Role Permissions Management Dialog
 * 角色权限管理对话框 - 单独管理角色权限
 */

import { useCallback, useEffect, useState } from 'react'
import { Loader2, Shield } from 'lucide-react'
import { toast } from 'sonner'

import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { PermissionTreeSelector } from './permission-tree-selector'
import { permissionService } from '../services'
import type { Role, Permission } from '../types'

interface RolePermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  onSubmit: (roleId: string, permissionCodes: string[], allPermissions: Permission[]) => Promise<void>
}

export function RolePermissionsDialog({
  open,
  onOpenChange,
  role,
  onSubmit,
}: RolePermissionsDialogProps) {
  const { t } = useI18n()
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 加载权限列表
  const loadPermissions = useCallback(async () => {
    try {
      setIsLoading(true)
      const permsData = await permissionService.getPermissions()
      setPermissions(permsData || [])
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load permissions'
      toast.error(message)
      setPermissions([]) // 确保出错时也设置为空数组
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 打开对话框时加载权限
  useEffect(() => {
    if (open) {
      loadPermissions()
    }
  }, [open, loadPermissions])

  // 当角色数据变化时，更新选中的权限
  useEffect(() => {
    if (role) {
      const rolePermissions = Array.isArray(role.permissions)
        ? role.permissions.map(p => (typeof p === 'string' ? p : p.code))
        : []
      setSelectedPermissions(rolePermissions)
    } else {
      setSelectedPermissions([])
    }
  }, [role])

  const handleSubmit = async () => {
    if (!role) return

    try {
      setIsSubmitting(true)
      await onSubmit(role.id, selectedPermissions, permissions)
      onOpenChange(false)
    } catch (error) {
      // 错误已经在父组件处理
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!role) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl flex flex-col max-h-[90vh]'>
        <DialogHeader>
          <div className='flex items-center gap-2'>
            <Shield className='h-5 w-5 text-primary' />
            <DialogTitle>{t('roles.managePermissionsTitle')}</DialogTitle>
          </div>
          <DialogDescription>
            {t('roles.managePermissionsFor')} <span className='font-semibold'>{role.name}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Role Info Card with Stats */}
        <div className='rounded-lg border p-4 bg-muted/50 grid grid-cols-2 gap-4 shrink-0'>
          <div className='space-y-2 text-sm'>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground'>{t('roles.roleName')}:</span>
              <span className='font-medium'>{role.name}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground'>{t('roles.roleCode')}:</span>
              <span className='font-mono text-xs bg-background px-2 py-1 rounded'>{role.code}</span>
            </div>
          </div>
          <div className='flex items-center justify-center'>
            <div className='rounded-lg border border-primary/20 bg-primary/5 px-4 py-2'>
              <div className='text-xs text-muted-foreground mb-1'>{t('roles.selectedPermissionsCount')}</div>
              <div className='text-2xl font-bold text-primary'>
                {selectedPermissions?.length || 0}
                <span className='text-sm font-normal text-muted-foreground'> / {permissions?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Selector - Scrollable Area */}
        <div className='flex-1 overflow-hidden flex flex-col min-h-0'>
          <h4 className='text-sm font-medium mb-3 shrink-0'>{t('roles.selectPermissions')}</h4>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          ) : (
            <div className='overflow-y-auto pr-2 flex-1'>
              <PermissionTreeSelector
                permissions={permissions || []}
                selectedPermissions={selectedPermissions || []}
                onChange={setSelectedPermissions}
                disabled={isSubmitting}
                maxHeight="100%"
              />
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        <DialogFooter className='shrink-0 mt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t('roles.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {t('roles.savePermissions')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
