/**
 * Menu Item Form Component
 * 菜单项表单组件
 */

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useQuery } from '@tanstack/react-query'
import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { IconPicker } from '@/components/common/icon-picker'
import { menuGroupApi, menuItemApi } from '../../api/menu-api'
import { permissionService } from '@/features/users/services'
import { PermissionType } from '@/features/users/types'
import { MenuType, type Menu, type MenuFormData } from '../../types'

interface MenuItemFormProps {
  initialData?: Menu
  onSubmit: (data: MenuFormData) => Promise<void>
  onCancel: () => void
}

export function MenuItemForm({
  initialData,
  onSubmit,
  onCancel,
}: MenuItemFormProps) {
  const { t } = useI18n()

  // 获取菜单组列表
  const { data: menuGroups } = useQuery({
    queryKey: ['menu-groups'],
    queryFn: () => menuGroupApi.list(),
  })

  // 获取菜单项树形结构（用于选择父菜单）
  const { data: menuTree } = useQuery({
    queryKey: ['menu-items-tree'],
    queryFn: () => menuItemApi.tree(),
  })

  // 获取所有权限（MODULE和ACTION类型）
  const { data: permissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionService.getPermissions(),
  })

  // 所有权限都可以关联到菜单
  const availablePermissions = permissions || []

  // 创建动态schema（匹配后端 CreateMenuDto / UpdateMenuDto）
  // 后端已全面支持所有字段，添加字段长度校验
  const formSchema = z.object({
    parentId: z.string().nullable(),
    menuGroupId: z.string().nullable(),
    name: z.string().min(1, t('menu.form.routeNameRequired')).max(100, '路由名称最长100字符'),
    title: z.string().min(1, t('menu.form.displayTitleRequired')).max(100, '显示标题最长100字符'),
    i18nKey: z.string().max(100, '国际化键最长100字符').nullable().optional(),
    path: z.string().max(255, '路径最长255字符').nullable().optional(),
    redirect: z.string().max(255, '重定向路径最长255字符').nullable().optional(),
    component: z.string().max(255, '组件路径最长255字符').nullable().optional(),
    icon: z.string().max(100, '图标最长100字符').nullable().optional(),
    badge: z.string().max(50, '徽章最长50字符').nullable().optional(),
    sortOrder: z.coerce.number().int().min(0).default(0),
    menuType: z.nativeEnum(MenuType),
    visible: z.boolean().default(true),
    isActive: z.boolean().default(true),
    keepAlive: z.boolean().default(false),
    isExternal: z.boolean().default(false),
    hiddenInBreadcrumb: z.boolean().optional(),
    alwaysShow: z.boolean().default(false),
    remark: z.string().max(500, '备注最长500字符').nullable().optional(),
    permissionId: z.string().nullable().optional(),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          parentId: initialData.parentId,
          menuGroupId: initialData.menuGroupId,
          name: initialData.name,
          title: initialData.title,
          i18nKey: initialData.i18nKey || null,
          path: initialData.path || null,
          redirect: initialData.redirect || null,
          component: initialData.component || null,
          icon: initialData.icon || null,
          badge: initialData.badge || null,
          sortOrder: initialData.sortOrder,
          menuType: initialData.menuType,
          visible: initialData.visible,
          isActive: initialData.isActive,
          keepAlive: initialData.keepAlive,
          isExternal: initialData.isExternal,
          hiddenInBreadcrumb: initialData.hiddenInBreadcrumb,
          alwaysShow: initialData.alwaysShow,
          remark: initialData.remark || null,
          permissionId: initialData.permissionId || null,
        }
      : {
          parentId: null,
          menuGroupId: null,
          name: '',
          title: '',
          i18nKey: null,
          path: null,
          redirect: null,
          component: null,
          icon: null,
          badge: null,
          sortOrder: 0,
          menuType: MenuType.MENU,
          visible: true,
          isActive: true,
          keepAlive: false,
          isExternal: false,
          hiddenInBreadcrumb: false,
          alwaysShow: false,
          remark: null,
          permissionId: null,
        },
  })

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        parentId: initialData.parentId,
        menuGroupId: initialData.menuGroupId,
        name: initialData.name,
        title: initialData.title,
        i18nKey: initialData.i18nKey || null,
        path: initialData.path || null,
        redirect: initialData.redirect || null,
        component: initialData.component || null,
        icon: initialData.icon || null,
        badge: initialData.badge || null,
        sortOrder: initialData.sortOrder,
        menuType: initialData.menuType,
        visible: initialData.visible,
        isActive: initialData.isActive,
        keepAlive: initialData.keepAlive,
        isExternal: initialData.isExternal,
        hiddenInBreadcrumb: initialData.hiddenInBreadcrumb,
        alwaysShow: initialData.alwaysShow,
        remark: initialData.remark || null,
        permissionId: initialData.permissionId || null,
      })
    } else {
      form.reset({
        parentId: null,
        menuGroupId: null,
        name: '',
        title: '',
        i18nKey: null,
        path: null,
        redirect: null,
        component: null,
        icon: null,
        badge: null,
        sortOrder: 0,
        menuType: MenuType.MENU,
        visible: true,
        isActive: true,
        keepAlive: false,
        isExternal: false,
        hiddenInBreadcrumb: false,
        alwaysShow: false,
        remark: null,
        permissionId: null,
      })
    }
  }, [initialData, form])

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    await onSubmit(data as MenuFormData)
  }

  // 将菜单树扁平化为选项列表（用于父菜单选择）
  const flattenMenuTree = (items: any[], level = 0): any[] => {
    return items.reduce((acc, item) => {
      // 排除当前编辑的菜单项本身
      if (!initialData || item.id !== initialData.id) {
        acc.push({ ...item, level })
        if (item.children && item.children.length > 0) {
          acc.push(...flattenMenuTree(item.children, level + 1))
        }
      }
      return acc
    }, [])
  }

  const parentMenuOptions = menuTree ? flattenMenuTree(menuTree) : []

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Name (Route Name) */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('menu.form.routeName')} *</FormLabel>
              <FormControl>
                <Input placeholder={t('menu.form.routeNamePlaceholder')} {...field} />
              </FormControl>
              <FormDescription>
                Internal route name (PascalCase, no spaces)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title (Display Title) */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('menu.form.displayTitle')} *</FormLabel>
              <FormControl>
                <Input placeholder={t('menu.form.displayTitlePlaceholder')} {...field} />
              </FormControl>
              <FormDescription>
                Title shown in UI (can have spaces)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* I18n Key (Optional) */}
        <FormField
          control={form.control}
          name="i18nKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('menu.form.i18nKeyOptional')}</FormLabel>
              <FormControl>
                <Input placeholder={t('menu.form.i18nKeyMenuPlaceholder')} {...field} value={field.value || ''} />
              </FormControl>
              <FormDescription>
                Translation key for multi-language support
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="menuType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('menu.form.menuTypeLabel')} *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={MenuType.DIRECTORY}>{t('menu.menuType.directory')}</SelectItem>
                    <SelectItem value={MenuType.MENU}>{t('menu.menuType.menu')}</SelectItem>
                    <SelectItem value={MenuType.ACTION}>{t('menu.menuType.action')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Directory: container, Menu: actual page, Action: operation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>

        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('menu.parentMenu')}</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange(value === 'null' ? null : value)
                }
                defaultValue={field.value || 'null'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null">{t('menu.noParent')}</SelectItem>
                  {parentMenuOptions.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {'─'.repeat(item.level * 2)} {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="menuGroupId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('menu.form.menuGroup')}</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange(value === 'null' ? null : value)
                }
                value={field.value || 'null'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null">{t('menu.noGroup')}</SelectItem>
                  {menuGroups?.items.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Assign menu to a group (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Path (Route Path) */}
        <FormField
          control={form.control}
          name="path"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('menu.form.routePath')}</FormLabel>
              <FormControl>
                <Input placeholder={t('menu.form.routePathPlaceholder')} {...field} value={field.value || ''} />
              </FormControl>
              <FormDescription>
                Path for routing (e.g., /users, /settings)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Component (Component Path) */}
        <FormField
          control={form.control}
          name="component"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('menu.form.componentPath')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('menu.form.componentPathPlaceholder')}
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Component to render for this route
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Redirect (Redirect Path) */}
        <FormField
          control={form.control}
          name="redirect"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('menu.form.redirectPath')}</FormLabel>
              <FormControl>
                <Input placeholder={t('menu.form.redirectPathPlaceholder')} {...field} value={field.value || ''} />
              </FormControl>
              <FormDescription>
                Automatically redirect to this path
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('menu.icon')}</FormLabel>
                <FormControl>
                  <IconPicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="badge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('menu.badge')}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>{t('menu.badgeExample')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Permission ID - Single select */}
        <FormField
          control={form.control}
          name="permissionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('menu.form.requiredPermissions')}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value === 'null' ? null : value)}
                  value={field.value || 'null'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('menu.form.selectPermissions')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">
                      <span className="text-muted-foreground">无权限要求（公开）</span>
                    </SelectItem>
                    {availablePermissions.map((permission) => (
                      <SelectItem key={permission.id} value={permission.id}>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={permission.type === PermissionType.MODULE ? 'default' : 'secondary'}
                            className="font-mono text-xs"
                          >
                            {permission.type === PermissionType.MODULE ? 'MODULE' : 'ACTION'}
                          </Badge>
                          <Badge variant="outline" className="font-mono text-xs">
                            {permission.code}
                          </Badge>
                          <span>{permission.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                {t('menu.form.permissionsDescription')} - 单个权限关联
              </FormDescription>
              {field.value && (
                <div className="mt-2">
                  {(() => {
                    const perm = availablePermissions.find(p => p.id === field.value)
                    return perm ? (
                      <Badge variant="outline">
                        {perm.type === PermissionType.MODULE ? 'MODULE' : 'ACTION'}: {perm.code}
                      </Badge>
                    ) : null
                  })()}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remark */}
        <FormField
          control={form.control}
          name="remark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('menu.form.remark')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('menu.form.remarkPlaceholder')}
                  rows={3}
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Boolean Settings */}
        <div className="space-y-3 border rounded-lg p-4">
          <h3 className="text-sm font-medium">Settings</h3>

          <FormField
            control={form.control}
            name="visible"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>{t('menu.form.visibleInMenu')}</FormLabel>
                  <FormDescription>
                    {t('menu.form.visibleInMenu')}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>{t('menu.form.activeLabel')}</FormLabel>
                  <FormDescription>
                    {t('menu.form.activeLabel')}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="keepAlive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>{t('menu.form.keepAlive')}</FormLabel>
                  <FormDescription>
                    {t('menu.form.keepAlive')}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isExternal"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>{t('menu.form.externalLink')}</FormLabel>
                  <FormDescription>
                    {t('menu.form.externalLink')}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hiddenInBreadcrumb"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>{t('menu.form.hiddenInBreadcrumb')}</FormLabel>
                  <FormDescription>
                    {t('menu.form.hiddenInBreadcrumb')}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alwaysShow"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>{t('menu.form.alwaysShow')}</FormLabel>
                  <FormDescription>
                    {t('menu.form.alwaysShow')}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('menu.cancel')}
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? t('menu.loading') : t('menu.save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
