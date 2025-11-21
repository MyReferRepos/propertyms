/**
 * User Create/Edit Dialog
 * 用户创建/编辑对话框
 */

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useI18n } from '@/lib/i18n'

import { UserStatus, type Role, type User } from '../types'

// 创建用户表单验证
const createUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Username can only contain letters, numbers, dots, underscores, and hyphens'),
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  roles: z.array(z.string()).min(1, 'Please select at least one role'),
  status: z.enum(['active', 'inactive', 'suspended', 'pending'] as const),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// 编辑用户表单验证（密码可选）
const editUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Username can only contain letters, numbers, dots, underscores, and hyphens'),
  email: z.email('Invalid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  roles: z.array(z.string()).min(1, 'Please select at least one role'),
  status: z.enum(UserStatus) //z.enum(['active', 'inactive', 'suspended', 'pending'] as const),
})

type CreateUserFormData = z.infer<typeof createUserSchema>
type EditUserFormData = z.infer<typeof editUserSchema>

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  roles: Role[]
  onSubmit: (data: any) => Promise<void>
}

export function UserDialog({ open, onOpenChange, user, roles, onSubmit }: UserDialogProps) {
  const isEdit = !!user
  const { t } = useI18n()

  const form = useForm<CreateUserFormData | EditUserFormData>({
    resolver: zodResolver(isEdit ? editUserSchema : createUserSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      department: '',
      position: '',
      roles: [],
      status: UserStatus.ACTIVE,
    },
  })

  // 当对话框打开时，更新表单
  useEffect(() => {
    if (!open) return

    if (user && isEdit) {
      const userRoles = Array.isArray(user.roles)
        ? user.roles.map(r => typeof r === 'string' ? r : r.id)
        : []

      // 将 status 转换为小写以匹配 UserStatus enum
      const normalizedStatus = (user.status?.toLowerCase() || 'active') as UserStatus

      // 使用 setTimeout 确保 DOM 已经渲染
      setTimeout(() => {
        form.reset({
          username: user.username,
          email: user.email,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
          department: user.department || '',
          position: user.position || '',
          roles: userRoles,
          status: normalizedStatus,
        })
      }, 0)
    } else if (!user) {
      form.reset({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
        department: '',
        position: '',
        roles: [],
        status: UserStatus.ACTIVE,
      })
    }
  }, [open, user, isEdit, form])

  const handleSubmit = async (data: CreateUserFormData | EditUserFormData) => {
    // 将 status 转换为 UserStatus 类型
    const submitData = {
      ...data,
      status: data.status as UserStatus,
    }
    await onSubmit(submitData as any)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('users.dialog.editTitle') : t('users.dialog.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? t('users.dialog.editDescription') : t('users.dialog.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              {/* Username */}
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('users.dialog.username')} {t('users.dialog.required')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('users.dialog.usernamePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('users.dialog.email')} {t('users.dialog.required')}</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder={t('users.dialog.emailPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Password fields (only for create) */}
            {!isEdit && (
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('users.dialog.password')} {t('users.dialog.required')}</FormLabel>
                      <FormControl>
                        <Input type='password' placeholder={t('users.dialog.passwordPlaceholder')} {...field} />
                      </FormControl>
                      <FormDescription>{t('users.dialog.passwordHint')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('users.dialog.confirmPassword')} {t('users.dialog.required')}</FormLabel>
                      <FormControl>
                        <Input type='password' placeholder={t('users.dialog.passwordPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className='grid grid-cols-2 gap-4'>
              {/* First Name */}
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('users.dialog.firstName')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('users.dialog.lastName')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              {/* Phone */}
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('users.dialog.phone')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('users.dialog.phonePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('users.dialog.status')} {t('users.dialog.required')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('users.dialog.selectStatus')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserStatus.ACTIVE}>{t('users.active')}</SelectItem>
                        <SelectItem value={UserStatus.INACTIVE}>{t('users.inactive')}</SelectItem>
                        <SelectItem value={UserStatus.SUSPENDED}>{t('users.suspended')}</SelectItem>
                        <SelectItem value={UserStatus.PENDING}>{t('users.pending')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              {/* Department */}
              <FormField
                control={form.control}
                name='department'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('users.dialog.department')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Position */}
              <FormField
                control={form.control}
                name='position'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('users.dialog.position')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Roles */}
            <FormField
              control={form.control}
              name='roles'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users.dialog.roles')} {t('users.dialog.required')}</FormLabel>
                  <div className='space-y-2'>
                    {roles.map((role) => (
                      <div key={role.id} className='flex items-center space-x-2'>
                        <input
                          type='checkbox'
                          id={`role-${role.id}`}
                          checked={field.value?.includes(role.id)}
                          onChange={(e) => {
                            const checked = e.target.checked
                            const current = field.value || []
                            if (checked) {
                              field.onChange([...current, role.id])
                            } else {
                              field.onChange(current.filter((id) => id !== role.id))
                            }
                          }}
                          className='rounded border-gray-300'
                        />
                        <label htmlFor={`role-${role.id}`} className='text-sm font-medium'>
                          {role.name}
                          {role.description && (
                            <span className='text-muted-foreground ml-2 text-xs'>
                              ({role.description})
                            </span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
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
                {t('users.dialog.cancel')}
              </Button>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                {isEdit ? t('users.dialog.update') : t('users.dialog.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
