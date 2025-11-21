/**
 * Menu Items Content Component
 * 菜单项内容组件 - 用于嵌入到综合页面
 */

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, ChevronRight, ChevronDown } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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
import { getIconComponent } from '@/components/layout/utils/icon-mapper'
import { menuItemApi } from '../api/menu-api'
import { MenuItemForm } from '../menu-items/components/menu-item-form'
import { translateMenuTitle } from '../utils/menu-i18n'
import type { Menu, MenuFormData, MenuTreeNode } from '../types'

export function MenuItemsContent() {
  const { t } = useI18n()
  const queryClient = useQueryClient()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Menu | null>(null)
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  // 获取菜单树形结构
  const { data: menuTree, isLoading, error } = useQuery({
    queryKey: ['menu-items-tree'],
    queryFn: () => menuItemApi.tree(),
  })

  // 如果有错误，在控制台输出
  if (error) {
    console.error('Menu items tree load error:', error)
  }

  // 创建菜单项
  const createMutation = useMutation({
    mutationFn: (data: MenuFormData) => menuItemApi.create(data),
    onSuccess: () => {
      toast.success(t('menu.createSuccess'))
      queryClient.invalidateQueries({ queryKey: ['menu-items-tree'] })
      queryClient.invalidateQueries({ queryKey: ['sidebar-menu'] })
      setDialogOpen(false)
    },
    onError: (error: any) => {
      console.error('Create menu item error:', error)
      toast.error(error?.message || t('menu.createError'))
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
    onError: (error: any) => {
      console.error('Update menu item error:', error)
      toast.error(error?.message || t('menu.updateError'))
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
    onError: (error: any) => {
      console.error('Delete menu item error:', error)
      toast.error(error?.message || t('menu.deleteError'))
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
    return items.map((item, index) => {
      const hasChildren = item.children && item.children.length > 0
      const isExpanded = expandedIds.has(item.id)
      const IconComponent = item.icon ? getIconComponent(item.icon) : null
      const isLastItem = index === items.length - 1

      return (
        <div key={item.id} className={cn('relative', level > 0 && 'ml-8')}>
          {/* 垂直连接线 */}
          {level > 0 && (
            <div className="absolute left-0 top-0 bottom-0 w-px bg-border"
                 style={{ left: '-1rem', height: isLastItem ? '1.5rem' : '100%' }} />
          )}

          {/* 水平连接线 */}
          {level > 0 && (
            <div className="absolute left-0 top-6 w-4 h-px bg-border"
                 style={{ left: '-1rem' }} />
          )}

          <div
            className={cn(
              'group relative flex items-start gap-3 p-3 mb-2 rounded-lg border bg-card',
              'hover:shadow-md transition-all duration-200',
              level === 0 && 'border-l-4',
              level === 0 && item.isActive && 'border-l-primary',
              level === 0 && !item.isActive && 'border-l-muted',
              level > 0 && 'bg-muted/30'
            )}
          >
            {/* 左侧：展开按钮和图标 */}
            <div className="flex items-center gap-2 pt-0.5">
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              ) : (
                <div className="w-6" />
              )}

              {IconComponent && (
                <div className="p-1.5 bg-primary/10 rounded">
                  <IconComponent className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>

            {/* 中间：内容区域 */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* 标题行 */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-base">{translateMenuTitle(item.title, t)}</span>

                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}

                <Badge
                  variant={item.isActive ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {item.isActive ? t('menu.active') : t('menu.inactive')}
                </Badge>
              </div>

              {/* 详情行 */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="font-medium">{t('menu.type')}:</span>
                  <Badge variant="outline" className="text-xs">
                    {item.menuType === 'Directory' ? 'Directory' : item.menuType === 'Menu' ? 'Menu' : 'Action'}
                  </Badge>
                </div>

                {item.path && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{t('menu.url')}:</span>
                    <code className="px-2 py-0.5 bg-muted rounded text-xs">{item.path}</code>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <span className="font-medium">{t('menu.sortOrder')}:</span>
                  <span className="text-xs">{item.sortOrder}</span>
                </div>
              </div>

              {/* 权限信息 - 单个权限 */}
              {item.permission && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{t('menu.permission')}:</span>
                    <code className="px-1.5 py-0.5 bg-muted rounded">{item.permission.code}</code>
                    <span className="text-xs">({item.permission.type})</span>
                  </div>
                </div>
              )}
            </div>

            {/* 右侧：操作按钮 */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleEdit(item)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* 子菜单 */}
          {hasChildren && isExpanded && (
            <div className="mt-2">
              {renderMenuTree(item.children!, level + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            {t('menu.expandAll')}
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            {t('menu.collapseAll')}
          </Button>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t('menu.create')}
        </Button>
      </div>

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
