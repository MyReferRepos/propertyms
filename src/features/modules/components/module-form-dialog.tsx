/**
 * Module Form Dialog
 * 模块创建/编辑表单对话框
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
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { IconPicker } from '@/components/common/icon-picker'
import type { ModuleListItem, CreateModuleRequest } from '../types'

// 表单验证模式
const moduleSchema = z.object({
  code: z.string()
    .min(1, '模块代码是必填的')
    .max(50, '模块代码最多50字符')
    .regex(/^[a-z][a-z0-9_]*$/, '代码必须以小写字母开头，只能包含小写字母、数字和下划线'),
  name: z.string()
    .min(1, '模块名称是必填的')
    .max(100, '模块名称最多100字符'),
  description: z.string()
    .max(500, '描述最多500字符')
    .optional(),
  icon: z.string()
    .max(100, '图标最多100字符')
    .optional(),
  sortOrder: z.number()
    .int('排序必须是整数')
    .min(0, '排序不能小于0'),
  isActive: z.boolean(),
})

type ModuleFormData = z.infer<typeof moduleSchema>

interface ModuleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  module?: ModuleListItem | null
  onSubmit: (data: CreateModuleRequest) => Promise<void>
}

export function ModuleFormDialog({
  open,
  onOpenChange,
  module,
  onSubmit
}: ModuleFormDialogProps) {
  const isEdit = !!module

  const form = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      icon: '',
      sortOrder: 0,
      isActive: true,
    },
  })

  // 当模块数据变化时，更新表单
  useEffect(() => {
    if (module && isEdit) {
      form.reset({
        code: module.code,
        name: module.name,
        description: module.description || '',
        icon: module.icon || '',
        sortOrder: module.sortOrder,
        isActive: module.isActive,
      })
    } else if (!module) {
      form.reset({
        code: '',
        name: '',
        description: '',
        icon: '',
        sortOrder: 0,
        isActive: true,
      })
    }
  }, [module, isEdit, form])

  const handleSubmit = async (data: ModuleFormData) => {
    await onSubmit(data)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? '编辑模块' : '创建模块'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? '修改模块信息' : '填写模块详细信息'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <div className="grid grid-cols-2 gap-4">
              {/* Module Code */}
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>模块代码 *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='例如: user_module'
                        {...field}
                        disabled={isEdit}
                      />
                    </FormControl>
                    <FormDescription>
                      唯一标识，创建后不可修改
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Module Name */}
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>模块名称 *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='例如: 用户管理模块'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      显示名称
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Icon */}
            <FormField
              control={form.control}
              name='icon'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>图标</FormLabel>
                  <FormControl>
                    <IconPicker
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    选择一个图标代表此模块
                  </FormDescription>
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
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='描述该模块的用途...'
                      className='resize-none'
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    可选，最多500字符
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Sort Order */}
              <FormField
                control={form.control}
                name='sortOrder'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>排序顺序</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      数字越小越靠前
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Is Active */}
              <FormField
                control={form.control}
                name='isActive'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        激活状态
                      </FormLabel>
                      <FormDescription>
                        是否启用此模块
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* 示例说明 */}
            <div className="rounded-lg border p-4 bg-muted/50">
              <h4 className="text-sm font-medium mb-2">💡 示例：</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• 代码: user_module</p>
                <p>• 名称: 用户管理模块</p>
                <p>• 描述: 负责用户、角色、权限等管理功能</p>
              </div>
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
                {isEdit ? '更新模块' : '创建模块'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
