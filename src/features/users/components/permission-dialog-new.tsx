/**
 * Permission Create/Edit Dialog - New Permission Model
 * 权限创建/编辑对话框 - 新权限模型
 *
 * 支持 MODULE 和 ACTION 两种类型
 */

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import type { CreatePermissionRequest, Permission } from '../types'
import { PermissionType } from '../types'
import type { ModuleListItem } from '@/features/modules/types'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// 权限类型选项（新模型 - 首字母大写以匹配后端）
const PERMISSION_TYPES = [
  { value: 'Module', label: 'Module (模块)', description: '功能模块权限' },
  { value: 'Action', label: 'Action (行为)', description: '操作行为权限' },
] as const

// 表单验证 - 匹配后端 PermissionCreateDto
const permissionSchema = z.object({
  name: z.string().min(1, '权限名称是必填的').max(100, '权限名称最长100字符'),
  code: z.string()
    .min(1, '权限代码是必填的')
    .max(100, '权限代码最长100字符')
    .regex(/^[a-z0-9_-]+$/, '代码只能包含小写字母、数字、下划线或短横线'),
  description: z.string().max(500, '描述最长500字符').optional(),
  type: z.enum(['Module', 'Action']),
  moduleId: z.string().uuid('请选择所属模块'),
  action: z.string().max(50, '操作名称最长50字符').optional(),
  path: z.string().max(255, 'API路径最长255字符').optional(),
  httpMethod: z.string().max(10, 'HTTP方法最长10字符').optional(),
})

type PermissionFormData = z.infer<typeof permissionSchema>

interface PermissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  permission?: Permission | null
  modules?: ModuleListItem[]  // 模块列表，用于选择所属模块
  onSubmit: (data: CreatePermissionRequest) => Promise<void>
}

export function PermissionDialogNew({
  open,
  onOpenChange,
  permission,
  modules = [],
  onSubmit
}: PermissionDialogProps) {
  const isEdit = !!permission

  const form = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: '',
      code: '',
      type: 'Module',
      moduleId: '',
      action: '',
      path: '',
      httpMethod: '',
      description: '',
    },
  })

  const type = form.watch('type')

  // 调试：查看modules prop (仅开发环境)
  useEffect(() => {
    if (import.meta.env.DEV && open) {
      console.log('[PermissionDialog] modules prop:', modules)
      if (permission) {
        console.log('[PermissionDialog] editing permission:', permission)
        console.log('[PermissionDialog] permission.moduleId:', permission.moduleId)
      }
    }
  }, [modules, permission, open])

  // 当权限数据变化时，更新表单
  useEffect(() => {
    if (permission && isEdit) {
      // 对于编辑模式，需要确保moduleId有有效值
      // 如果是MODULE类型且没有moduleId，可能表示它是顶级模块，使用自己的id
      const effectiveModuleId = permission.moduleId || (permission.type === PermissionType.MODULE ? permission.id : '')

      form.reset({
        name: permission.name,
        code: permission.code,
        type: permission.type,
        moduleId: effectiveModuleId,
        action: permission.action || '',
        path: permission.path || '',
        httpMethod: permission.httpMethod || '',
        description: permission.description || '',
      })
    } else if (!permission) {
      form.reset({
        name: '',
        code: '',
        type: 'Module',
        moduleId: '',
        action: '',
        path: '',
        httpMethod: '',
        description: '',
      })
    }
  }, [permission, isEdit, form])

  // 注意：ModuleListItem 不包含 path 字段，因此无法自动填充 path 前缀
  // 如果需要此功能，可以考虑在后端 ModuleListItem DTO 中添加 path 字段

  const handleSubmit = async (data: PermissionFormData) => {
    const submitData: CreatePermissionRequest = {
      name: data.name,
      code: data.code,
      description: data.description,
      type: data.type === 'Module' ? PermissionType.MODULE : PermissionType.ACTION,
      moduleId: data.moduleId,
      action: data.action,
      path: data.path,
      httpMethod: data.httpMethod,
    }

    await onSubmit(submitData)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? '编辑权限' : '创建权限'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? '修改权限信息' : '填写权限详细信息'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            {/* Permission Type */}
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>权限类型 *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isEdit}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='选择权限类型' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PERMISSION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex flex-col">
                            <span>{type.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {type.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {type === 'Module'
                      ? '模块权限代表一个功能模块，path 通常为 /api/xxx/*'
                      : '行为权限代表具体操作，如列表、创建、删除等'
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Module Selection - 必填字段，所有类型都需要 */}
            <FormField
              control={form.control}
              name='moduleId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>所属模块 *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isEdit}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='选择所属模块' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {modules.length > 0 ? (
                        modules.map((module) => (
                          <SelectItem key={module.id} value={module.id}>
                            <div className="flex items-center gap-2">
                              <span>{module.name}</span>
                              <code className="text-xs text-muted-foreground">
                                {module.code}
                              </code>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                          暂无模块，请先在模块管理页面创建模块
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {type === 'Module'
                      ? '创建Module类型权限后，可以在此选择自己作为所属模块'
                      : '选择该行为权限所属的模块'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action - 仅在 Action 类型时显示 */}
            {type === 'Action' && (
              <FormField
                control={form.control}
                name='action'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>操作名称</FormLabel>
                    <FormControl>
                      <Input placeholder='例如: list, create, update, delete' {...field} />
                    </FormControl>
                    <FormDescription>
                      操作的英文名称，建议使用动词
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Permission Name */}
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>权限名称 *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={type === 'Module' ? '用户管理模块' : '用户列表'}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      名称必须唯一
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Permission Code */}
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>权限代码 *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={type === 'Module' ? 'user_module' : 'user_list'}
                        {...field}
                        disabled={isEdit}
                      />
                    </FormControl>
                    <FormDescription>
                      代码必须唯一，只能包含小写字母、数字、下划线或短横线
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* API Path */}
              <FormField
                control={form.control}
                name='path'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API 路径</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          type === 'Module'
                            ? '/api/users/*'
                            : '/api/users 或 /api/users/:id'
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {type === 'Module'
                        ? '模块路径，通常以 /* 结尾'
                        : '具体的 API 路径，支持参数'
                      }
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* HTTP Method - 仅在 Action 类型时显示 */}
              {type === 'Action' && (
                <FormField
                  control={form.control}
                  name='httpMethod'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HTTP方法</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='选择HTTP方法' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        API请求的HTTP方法
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述（可选）</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='描述该权限的用途...'
                      className='resize-none'
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 示例说明 */}
            <div className="rounded-lg border p-4 bg-muted/50">
              <h4 className="text-sm font-medium mb-2">💡 示例：</h4>
              {type === 'Module' ? (
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• 名称: 用户管理模块</p>
                  <p>• 代码: user_module</p>
                  <p>• 路径: /api/users/*</p>
                </div>
              ) : (
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• 列表: user_list → /api/users (GET)</p>
                  <p>• 详情: user_view → /api/users/:id (GET)</p>
                  <p>• 创建: user_create → /api/users (POST)</p>
                  <p>• 删除: user_delete → /api/users/:id (DELETE)</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                取消
              </Button>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                {isEdit ? '更新权限' : '创建权限'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
