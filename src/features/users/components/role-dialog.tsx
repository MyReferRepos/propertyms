/**
 * Role Create/Edit Dialog with Permission Assignment
 * 角色创建/编辑对话框（含权限分配）
 */

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, AlertCircle } from 'lucide-react'
import { z } from 'zod'

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { PermissionTreeSelector } from './permission-tree-selector'
import type { Role, Permission } from '../types'

// 表单验证 - 使用 i18n 的动态验证
const createRoleSchema = (t: (key: string, params?: Record<string, string | number>) => string) =>
  z.object({
    name: z.string().min(2, t('roles.validation.nameMin', { min: 2 })),
    code: z
      .string()
      .min(2, t('roles.validation.codeMin', { min: 2 }))
      .regex(/^[a-z_]+$/, t('roles.validation.codePattern')),
    description: z.string().optional(),
    permissions: z.array(z.string()).min(1, t('roles.validation.permissionsMin')),
  })

type RoleFormData = z.infer<ReturnType<typeof createRoleSchema>>

interface RoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: Role | null
  permissions: Permission[]
  onSubmit: (data: RoleFormData) => Promise<void>
}

export function RoleDialog({ open, onOpenChange, role, permissions, onSubmit }: RoleDialogProps) {
  const { t } = useI18n()
  const isEdit = !!role
  const [activeTab, setActiveTab] = useState<'basic' | 'permissions'>('basic')

  // 使用 useMemo 缓存 schema，避免每次渲染都重新创建
  const roleSchema = useMemo(() => createRoleSchema(t), [t])

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      permissions: [],
    },
  })

  // 当对话框打开/关闭时重置表单状态
  useEffect(() => {
    if (!open) {
      // 对话框关闭时重置表单
      form.reset({
        name: '',
        code: '',
        description: '',
        permissions: [],
      })
      setActiveTab('basic') // 重置到第一个标签页
    } else {
      setActiveTab('basic') // 打开时也重置到第一个标签页
    }
  }, [open, form])

  // 当角色数据变化时，更新表单
  useEffect(() => {
    if (open && role && isEdit) {
      // 使用 permission code 而不是 permission id
      const rolePermissions = Array.isArray(role.permissions)
        ? role.permissions.map(p => (typeof p === 'string' ? p : p.code))
        : []

      form.reset({
        name: role.name,
        code: role.code,
        description: role.description || '',
        permissions: rolePermissions,
      })
    } else if (open && !role) {
      form.reset({
        name: '',
        code: '',
        description: '',
        permissions: [],
      })
    }
  }, [open, role, isEdit, form])

  // 检测哪个标签页有错误
  const hasBasicErrors = !!(
    form.formState.errors.name ||
    form.formState.errors.code ||
    form.formState.errors.description
  )
  const hasPermissionsErrors = !!form.formState.errors.permissions

  const handleSubmit = async (data: RoleFormData) => {
    await onSubmit(data)
    form.reset()
  }

  // 表单提交失败时，自动切换到有错误的标签页
  const handleInvalidSubmit = () => {
    // 优先检查基本信息标签
    if (hasBasicErrors) {
      setActiveTab('basic')
    } else if (hasPermissionsErrors) {
      setActiveTab('permissions')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl flex flex-col max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle>{isEdit ? t('roles.editRole') : t('roles.createRole')}</DialogTitle>
          <DialogDescription>
            {isEdit ? t('roles.editRoleDescription') : t('roles.createRoleDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, handleInvalidSubmit)}
            className='flex flex-col flex-1 overflow-hidden'
          >
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as 'basic' | 'permissions')}
              className='flex-1 flex flex-col overflow-hidden'
            >
              <TabsList className='w-full grid grid-cols-2'>
                <TabsTrigger value='basic' className='relative'>
                  {t('roles.tab.basicInfo')}
                  {hasBasicErrors && (
                    <AlertCircle className='ml-1 h-4 w-4 text-destructive' />
                  )}
                </TabsTrigger>
                <TabsTrigger value='permissions' className='relative'>
                  {t('roles.tab.permissions')}
                  {hasPermissionsErrors && (
                    <AlertCircle className='ml-1 h-4 w-4 text-destructive' />
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value='basic' className='flex-1 overflow-y-auto space-y-6 mt-6 pr-2'>
                {/* Role Name */}
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('roles.roleNameLabel')} *</FormLabel>
                      <FormControl>
                        <Input placeholder={t('roles.roleNamePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Role Code */}
                <FormField
                  control={form.control}
                  name='code'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('roles.roleCodeLabel')} *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('roles.roleCodePlaceholder')}
                          {...field}
                          disabled={isEdit} // 编辑时不能修改code
                        />
                      </FormControl>
                      <FormDescription>{t('roles.roleCodeDescription')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('roles.descriptionLabel')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('roles.descriptionPlaceholder')}
                          className='resize-none'
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Permissions Tab */}
              <TabsContent value='permissions' className='flex-1 overflow-y-auto mt-6 pr-2'>
                <FormField
                  control={form.control}
                  name='permissions'
                  render={({ field }) => (
                    <FormItem className='flex flex-col h-full'>
                      <FormLabel>{t('roles.permissionsLabel')} *</FormLabel>
                      <FormDescription>
                        {t('roles.permissionsDescription')}
                      </FormDescription>
                      <FormControl>
                        <PermissionTreeSelector
                          permissions={permissions}
                          selectedPermissions={field.value || []}
                          onChange={field.onChange}
                          disabled={form.formState.isSubmitting}
                          maxHeight="450px"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter className='mt-6 shrink-0'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                {t('roles.cancel')}
              </Button>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                {isEdit ? t('roles.updateRole') : t('roles.createRoleButton')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
