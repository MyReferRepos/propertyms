/**
 * Role Basic Info Edit Dialog
 * 角色基本信息编辑对话框（不含权限设置）
 */

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, AlertTriangle } from 'lucide-react'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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

import type { Role } from '../types'

// 表单验证（不包含权限）- 使用 i18n 的动态验证
const createRoleBasicSchema = (t: (key: string, params?: Record<string, string | number>) => string) =>
  z.object({
    name: z.string().min(2, t('roles.validation.nameMin', { min: 2 })),
    code: z
      .string()
      .min(2, t('roles.validation.codeMin', { min: 2 }))
      .regex(/^[a-z_]+$/, t('roles.validation.codePattern')),
    description: z.string().optional(),
  })

type RoleBasicFormData = z.infer<ReturnType<typeof createRoleBasicSchema>>

interface RoleBasicDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: Role | null
  onSubmit: (data: RoleBasicFormData) => Promise<void>
}

export function RoleBasicDialog({ open, onOpenChange, role, onSubmit }: RoleBasicDialogProps) {
  const { t } = useI18n()
  const isEdit = !!role

  // 跟踪原始 code 值和确认对话框状态
  const [originalCode, setOriginalCode] = useState<string>('')
  const [pendingData, setPendingData] = useState<RoleBasicFormData | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // 使用 useMemo 缓存 schema，避免每次渲染都重新创建
  const roleBasicSchema = useMemo(() => createRoleBasicSchema(t), [t])

  const form = useForm<RoleBasicFormData>({
    resolver: zodResolver(roleBasicSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
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
      })
    }
  }, [open, form])

  // 当角色数据变化时，更新表单
  useEffect(() => {
    if (open && role && isEdit) {
      setOriginalCode(role.code) // 保存原始 code
      form.reset({
        name: role.name,
        code: role.code,
        description: role.description || '',
      })
    } else if (open && !role) {
      setOriginalCode('')
      form.reset({
        name: '',
        code: '',
        description: '',
      })
    }
  }, [open, role, isEdit, form])

  const handleSubmit = async (data: RoleBasicFormData) => {
    // 检查 code 是否改变
    if (isEdit && data.code !== originalCode) {
      // 显示确认对话框
      setPendingData(data)
      setShowConfirmDialog(true)
      return
    }

    // 没有改变或确认后，直接提交
    await onSubmit(data)
    form.reset()
  }

  const handleConfirmCodeChange = async () => {
    if (!pendingData) return

    setShowConfirmDialog(false)
    try {
      await onSubmit(pendingData)
      form.reset()
    } finally {
      setPendingData(null)
    }
  }

  const handleCancelCodeChange = () => {
    setShowConfirmDialog(false)
    setPendingData(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-xl'>
        <DialogHeader>
          <DialogTitle>{isEdit ? t('roles.editRoleBasic') : t('roles.createRole')}</DialogTitle>
          <DialogDescription>
            {isEdit ? t('roles.editRoleBasicDescription') : t('roles.createRoleDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
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
                    />
                  </FormControl>
                  <FormDescription>{t('roles.roleCodeDescription')}</FormDescription>
                  <FormMessage />

                  {/* 编辑时显示警告 */}
                  {isEdit && (
                    <Alert variant='destructive' className='mt-2'>
                      <AlertTriangle className='h-4 w-4' />
                      <AlertTitle>{t('roles.codeChangeWarning.title')}</AlertTitle>
                      <AlertDescription>
                        {t('roles.codeChangeWarning.description')}
                      </AlertDescription>
                    </Alert>
                  )}
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
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
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

      {/* Code Change Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('roles.codeChangeConfirm.title')}</AlertDialogTitle>
            <AlertDialogDescription className='space-y-2'>
              <p>
                {t('roles.codeChangeConfirm.description', {
                  oldCode: originalCode,
                  newCode: pendingData?.code || '',
                })}
              </p>
              <p className='font-semibold text-destructive'>
                {t('roles.codeChangeConfirm.warning')}
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelCodeChange}>
              {t('roles.codeChangeConfirm.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCodeChange}>
              {t('roles.codeChangeConfirm.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}
