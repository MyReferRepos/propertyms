/**
 * Menu Group Form Component
 * 菜单组表单组件
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { IconPicker } from '@/components/common/icon-picker'
import type { MenuGroup, MenuGroupFormData } from '../../types'

interface MenuGroupFormProps {
  initialData?: MenuGroup
  onSubmit: (data: MenuGroupFormData) => Promise<void>
  onCancel: () => void
}

export function MenuGroupForm({
  initialData,
  onSubmit,
  onCancel,
}: MenuGroupFormProps) {
  const { t } = useI18n()

  // 表单校验 (匹配后端 CreateMenuGroupDto / UpdateMenuGroupDto)
  const formSchema = z.object({
    name: z.string().min(1, t('menu.form.nameRequired')),
    i18nKey: z.string().nullable().optional(),
    icon: z.string().optional(),
    description: z.string().optional(),
    sortOrder: z.coerce.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          i18nKey: initialData.i18nKey || null,
          icon: initialData.icon || '',
          description: initialData.description || '',
          sortOrder: initialData.sortOrder,
          isActive: initialData.isActive,
        }
      : {
          name: '',
          i18nKey: null,
          icon: '',
          description: '',
          sortOrder: 0,
          isActive: true,
        },
  })

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    await onSubmit(data as MenuGroupFormData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('menu.form.name')} *</FormLabel>
              <FormControl>
                <Input placeholder={t('menu.form.namePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* I18n Key */}
        <FormField
          control={form.control}
          name="i18nKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('menu.form.i18nKey')} (Optional)</FormLabel>
              <FormControl>
                <Input placeholder={t('menu.form.i18nKeyPlaceholder')} {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Icon */}
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('menu.icon')} (Optional)</FormLabel>
              <FormControl>
                <IconPicker
                  value={field.value || null}
                  onChange={(value) => field.onChange(value || '')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('menu.form.description')} (Optional)</FormLabel>
              <FormControl>
                <Input placeholder={t('menu.form.descriptionPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sort Order */}
        <FormField
          control={form.control}
          name="sortOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('menu.sortOrder')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value as number}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Is Active */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>{t('menu.active')}</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('menu.cancel')}
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? t('menu.form.saving') : t('menu.form.save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
