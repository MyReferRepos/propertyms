/**
 * Menu Items Management Page
 * 菜单项管理页面
 */

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, ChevronRight, ChevronDown } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/layout/page-header'
import { getIconComponent } from '@/components/layout/utils/icon-mapper'
import { menuItemApi } from '../api/menu-api'
import { MenuItemForm } from './components/menu-item-form'
import type { Menu, MenuFormData, MenuTreeNode } from '../types'

export function MenuItems() {
  const { t } = useI18n()
  const queryClient = useQueryClient()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Menu | null>(null)
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  // 获取菜单树形结构
  const { data: menuTree, isLoading } = useQuery({
    queryKey: ['menu-items-tree'],
    queryFn: () => menuItemApi.tree(),
  })

  // 创建菜单项
  const createMutation = useMutation({
    mutationFn: (data: MenuFormData) => menuItemApi.create(data),
    onSuccess: () => {
      toast.success(t('menu.createSuccess'))
      queryClient.invalidateQueries({ queryKey: ['menu-items-tree'] })
      queryClient.invalidateQueries({ queryKey: ['sidebar-menu'] })
      setDialogOpen(false)
    },
    onError: () => {
      toast.error(t('menu.createError'))
    },
  })

  // 更新菜单项
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: MenuFormData
    }) => menuItemApi.update(id, data),
    onSuccess: () => {
      toast.success(t('menu.updateSuccess'))
      queryClient.invalidateQueries({ queryKey: ['menu-items-tree'] })
      queryClient.invalidateQueries({ queryKey: ['sidebar-menu'] })
      setDialogOpen(false)
      setEditingItem(null)
    },
    onError: () => {
      toast.error(t('menu.updateError'))
    },
  })

  // 删除菜单项
  const deleteMutation = useMutation({
    mutationFn: (id: string) => menuItemApi.delete(id),
    onSuccess: () => {
      toast.success(t('menu.deleteSuccess'))
      queryClient.invalidateQueries({ queryKey: ['menu-items-tree'] })
      queryClient.invalidateQueries({ queryKey: ['sidebar-menu'] })
      setDeleteDialogOpen(false)
      setDeletingItemId(null)
    },
    onError: () => {
      toast.error(t('menu.deleteError'))
    },
  })

  const handleCreate = () => {
    setEditingItem(null)
    setDialogOpen(true)
  }

  const handleEdit = (item: Menu) => {
    setEditingItem(item)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeletingItemId(id)
    setDeleteDialogOpen(true)
  }

  const handleSubmit = async (data: MenuFormData) => {
    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  const confirmDelete = () => {
    if (deletingItemId) {
      deleteMutation.mutate(deletingItemId)
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const expandAll = () => {
    if (!menuTree) return
    const allIds = new Set<string>()
    const collectIds = (items: MenuTreeNode[]) => {
      items.forEach((item) => {
        if (item.children && item.children.length > 0) {
          allIds.add(item.id)
          collectIds(item.children)
        }
      })
    }
    collectIds(menuTree)
    setExpandedIds(allIds)
  }

  const collapseAll = () => {
    setExpandedIds(new Set())
  }

  // 递归渲染菜单树
  const renderMenuTree = (items: MenuTreeNode[], level = 0) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0
      const isExpanded = expandedIds.has(item.id)
      const IconComponent = item.icon ? getIconComponent(item.icon) : null

      return (
        <div key={item.id}>
          <div
            className={cn(
              'flex items-center gap-2 py-2 px-3 hover:bg-muted rounded-lg',
              level > 0 && 'ml-6'
            )}
            style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
          >
            <div className="flex items-center gap-2 flex-1">
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="p-0 hover:bg-transparent"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              ) : (
                <div className="w-4" />
              )}

              {IconComponent && <IconComponent className="h-4 w-4" />}

              <span className="font-medium">{item.title}</span>

              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}

              <Badge variant="outline" className="text-xs">
                {t(`menu.menuType.${item.menuType}`)}
              </Badge>

              {item.path && (
                <span className="text-xs text-muted-foreground">{item.path}</span>
              )}

              <Badge
                variant={item.isActive ? 'default' : 'secondary'}
                className="text-xs ml-auto"
              >
                {item.isActive ? t('menu.active') : t('menu.inactive')}
              </Badge>
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleEdit(item)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {hasChildren && isExpanded && (
            <div>{renderMenuTree(item.children!, level + 1)}</div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        breadcrumbs={[
          { title: t('menu.breadcrumb.home'), href: '/' },
          { title: t('menu.breadcrumb.systemManagement') },
          { title: t('menu.breadcrumb.menuManagement') },
          { title: t('menu.breadcrumb.menuItems') },
        ]}
      />

      <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('menu.menuItems')}</CardTitle>
                <CardDescription>{t('menu.menuItemsDescription')}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={expandAll}>
                  {t('menu.expandAll')}
                </Button>
                <Button variant="outline" size="sm" onClick={collapseAll}>
                  {t('menu.collapseAll')}
                </Button>
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('menu.create')}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('menu.loading')}
            </div>
          ) : !menuTree || menuTree.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('menu.noData')}
            </div>
          ) : (
            <div className="space-y-1">{renderMenuTree(menuTree)}</div>
          )}
          </CardContent>
        </Card>
      </div>

      {/* 创建/编辑对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? t('menu.editMenuItem') : t('menu.createMenuItem')}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? t('menu.editMenuItemDescription') : t('menu.createMenuItemDescription')}
            </DialogDescription>
          </DialogHeader>
          <MenuItemForm
            initialData={editingItem || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setDialogOpen(false)
              setEditingItem(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('menu.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('menu.confirmDeleteMenuItem')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('menu.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {t('menu.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
