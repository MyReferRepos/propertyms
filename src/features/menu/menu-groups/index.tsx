/**
 * Menu Groups Management Page
 * 菜单组管理页面
 */

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2 } from 'lucide-react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/layout/page-header'
import { menuGroupApi } from '../api/menu-api'
import { MenuGroupForm } from './components/menu-group-form'
import type { MenuGroup, MenuGroupFormData } from '../types'

export function MenuGroups() {
  const { t } = useI18n()
  const queryClient = useQueryClient()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<MenuGroup | null>(null)
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null)

  // 获取菜单组列表
  const { data, isLoading } = useQuery({
    queryKey: ['menu-groups'],
    queryFn: () => menuGroupApi.list(),
  })

  // 创建菜单组
  const createMutation = useMutation({
    mutationFn: (data: MenuGroupFormData) => menuGroupApi.create(data),
    onSuccess: () => {
      toast.success(t('menu.createSuccess'))
      queryClient.invalidateQueries({ queryKey: ['menu-groups'] })
      setDialogOpen(false)
    },
    onError: () => {
      toast.error(t('menu.createError'))
    },
  })

  // 更新菜单组
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: MenuGroupFormData
    }) => menuGroupApi.update(id, data),
    onSuccess: () => {
      toast.success(t('menu.updateSuccess'))
      queryClient.invalidateQueries({ queryKey: ['menu-groups'] })
      setDialogOpen(false)
      setEditingGroup(null)
    },
    onError: () => {
      toast.error(t('menu.updateError'))
    },
  })

  // 删除菜单组
  const deleteMutation = useMutation({
    mutationFn: (id: string) => menuGroupApi.delete(id),
    onSuccess: () => {
      toast.success(t('menu.deleteSuccess'))
      queryClient.invalidateQueries({ queryKey: ['menu-groups'] })
      setDeleteDialogOpen(false)
      setDeletingGroupId(null)
    },
    onError: () => {
      toast.error(t('menu.deleteError'))
    },
  })

  const handleCreate = () => {
    setEditingGroup(null)
    setDialogOpen(true)
  }

  const handleEdit = (group: MenuGroup) => {
    setEditingGroup(group)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeletingGroupId(id)
    setDeleteDialogOpen(true)
  }

  const handleSubmit = async (data: MenuGroupFormData) => {
    if (editingGroup) {
      await updateMutation.mutateAsync({ id: editingGroup.id, data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  const confirmDelete = () => {
    if (deletingGroupId) {
      deleteMutation.mutate(deletingGroupId)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        breadcrumbs={[
          { title: t('menu.breadcrumb.home'), href: '/' },
          { title: t('menu.breadcrumb.systemManagement') },
          { title: t('menu.breadcrumb.menuManagement') },
          { title: t('menu.breadcrumb.menuGroups') },
        ]}
      />

      <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('menu.menuGroups')}</CardTitle>
                <CardDescription>
                  {t('menu.total', { total: data?.total || 0 })}
                </CardDescription>
              </div>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                {t('menu.create')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('menu.loading')}
            </div>
          ) : !data?.items.length ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('menu.noData')}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('menu.title')}</TableHead>
                  <TableHead>{t('menu.sortOrder')}</TableHead>
                  <TableHead>{t('menu.isActive')}</TableHead>
                  <TableHead>{t('menu.createdAt')}</TableHead>
                  <TableHead className="text-right">{t('menu.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell>{group.sortOrder}</TableCell>
                    <TableCell>
                      <Badge variant={group.isActive ? 'default' : 'secondary'}>
                        {group.isActive ? t('menu.active') : t('menu.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(group.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(group)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(group.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          </CardContent>
        </Card>
      </div>

      {/* 创建/编辑对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? t('menu.editMenuGroup') : t('menu.createMenuGroup')}
            </DialogTitle>
            <DialogDescription>
              {editingGroup
                ? t('menu.editMenuGroupDescription')
                : t('menu.createMenuGroupDescription')}
            </DialogDescription>
          </DialogHeader>
          <MenuGroupForm
            initialData={editingGroup || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setDialogOpen(false)
              setEditingGroup(null)
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
              {t('menu.confirmDeleteMenuGroup')}
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
