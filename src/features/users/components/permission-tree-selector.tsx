/**
 * Permission Tree Selector
 * 权限树选择器 - 支持层级选择和批量操作
 */

import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useI18n } from '@/lib/i18n'
import type { Permission } from '../types'
import { PermissionType } from '../types'

interface PermissionNode {
  permission: Permission
  children: Permission[]
}

interface PermissionModule {
  module: string
  moduleName: string
  nodes: PermissionNode[]
}

interface PermissionTreeSelectorProps {
  /** 所有可用权限列表 */
  permissions: Permission[]
  /** 已选中的权限代码列表 */
  selectedPermissions: string[]
  /** 权限选择变化回调 */
  onChange: (selectedPermissions: string[]) => void
  /** 是否禁用 */
  disabled?: boolean
  /** 最大高度 */
  maxHeight?: string
}

/**
 * 权限树选择器组件
 *
 * 功能特性：
 * - 按模块分组显示权限
 * - Page 权限作为父节点，API 权限作为子节点
 * - 支持全选/取消全选
 * - 支持折叠/展开
 * - 选中父节点自动选中所有子节点
 * - 支持部分选中状态（indeterminate）
 */
export function PermissionTreeSelector({
  permissions,
  selectedPermissions,
  onChange,
  disabled = false,
  maxHeight = '500px',
}: PermissionTreeSelectorProps) {
  const { t } = useI18n()
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  // 构建权限树结构 - 新模型：MODULE/ACTION
  const permissionTree = useMemo(() => {
    // 按MODULE类型权限分组
    const modulePermissions = permissions.filter(p => p.type === PermissionType.MODULE)

    // 构建树形结构
    const tree: PermissionModule[] = []

    modulePermissions.forEach((modulePerm) => {
      // 找出该模块下的所有 ACTION 权限
      const actionPermissions = permissions.filter(
        (p) => p.type === PermissionType.ACTION && p.moduleCode === modulePerm.code
      )

      const nodes: PermissionNode[] = [{
        permission: modulePerm,
        children: actionPermissions,
      }]

      tree.push({
        module: modulePerm.code,
        moduleName: modulePerm.name,
        nodes: nodes,
      })
    })

    // 也包含没有模块的 ACTION 权限（孤立权限 - 理论上不应该存在）
    const orphanActions = permissions.filter(
      (p) => p.type === PermissionType.ACTION && !p.moduleCode
    )

    if (orphanActions.length > 0) {
      const orphanNodes: PermissionNode[] = orphanActions.map(orphan => ({
        permission: orphan,
        children: [],
      }))

      tree.push({
        module: 'orphan',
        moduleName: 'Orphan Actions (无模块)',
        nodes: orphanNodes,
      })
    }

    return tree
  }, [permissions])

  // 默认展开所有模块
  useEffect(() => {
    const allModules = new Set(permissionTree.map((m) => m.module))
    setExpandedModules(allModules)
  }, [permissionTree])

  // 切换模块展开/折叠
  const toggleModule = (module: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(module)) {
        next.delete(module)
      } else {
        next.add(module)
      }
      return next
    })
  }

  // 切换节点展开/折叠
  const toggleNodeExpanded = (nodeCode: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(nodeCode)) {
        next.delete(nodeCode)
      } else {
        next.add(nodeCode)
      }
      return next
    })
  }

  // 检查权限是否已选中
  const isPermissionSelected = (code: string) => {
    return selectedPermissions.includes(code)
  }

  // 检查节点的所有子权限是否全部选中
  const areAllChildrenSelected = (node: PermissionNode) => {
    if (node.children.length === 0) return false
    return node.children.every((child) => isPermissionSelected(child.code))
  }

  // 检查节点的子权限是否部分选中
  const areSomeChildrenSelected = (node: PermissionNode) => {
    if (node.children.length === 0) return false
    return node.children.some((child) => isPermissionSelected(child.code))
  }

  // 检查模块的所有权限是否全部选中
  const areAllModulePermissionsSelected = (moduleData: PermissionModule) => {
    const allPermissions = moduleData.nodes.flatMap((node) => [
      node.permission.code,
      ...node.children.map((c) => c.code),
    ])
    return allPermissions.every((code) => selectedPermissions.includes(code))
  }

  // 检查模块的权限是否部分选中
  const areSomeModulePermissionsSelected = (moduleData: PermissionModule) => {
    const allPermissions = moduleData.nodes.flatMap((node) => [
      node.permission.code,
      ...node.children.map((c) => c.code),
    ])
    return allPermissions.some((code) => selectedPermissions.includes(code))
  }

  // 切换单个权限
  const togglePermission = (code: string) => {
    if (disabled) return

    const newSelected = selectedPermissions.includes(code)
      ? selectedPermissions.filter((c) => c !== code)
      : [...selectedPermissions, code]

    onChange(newSelected)
  }

  // 切换节点（包括其所有子权限）
  const toggleNode = (node: PermissionNode) => {
    if (disabled) return

    const allCodes = [node.permission.code, ...node.children.map((c) => c.code)]
    const allSelected = allCodes.every((code) => selectedPermissions.includes(code))

    let newSelected: string[]
    if (allSelected) {
      // 取消选中所有
      newSelected = selectedPermissions.filter((code) => !allCodes.includes(code))
    } else {
      // 选中所有
      const toAdd = allCodes.filter((code) => !selectedPermissions.includes(code))
      newSelected = [...selectedPermissions, ...toAdd]
    }

    onChange(newSelected)
  }

  // 切换模块（包括其所有权限）
  const toggleModulePermissions = (moduleData: PermissionModule) => {
    if (disabled) return

    const allCodes = moduleData.nodes.flatMap((node) => [
      node.permission.code,
      ...node.children.map((c) => c.code),
    ])

    const allSelected = allCodes.every((code) => selectedPermissions.includes(code))

    let newSelected: string[]
    if (allSelected) {
      // 取消选中所有
      newSelected = selectedPermissions.filter((code) => !allCodes.includes(code))
    } else {
      // 选中所有
      const toAdd = allCodes.filter((code) => !selectedPermissions.includes(code))
      newSelected = [...selectedPermissions, ...toAdd]
    }

    onChange(newSelected)
  }

  // 全选/取消全选
  const toggleAll = () => {
    if (disabled) return

    const allCodes = permissions.map((p) => p.code)
    const allSelected = allCodes.every((code) => selectedPermissions.includes(code))

    if (allSelected) {
      onChange([])
    } else {
      onChange(allCodes)
    }
  }

  const allSelected = useMemo(() => {
    const allCodes = permissions.map((p) => p.code)
    return allCodes.length > 0 && allCodes.every((code) => selectedPermissions.includes(code))
  }, [permissions, selectedPermissions])

  const someSelected = useMemo(() => {
    return selectedPermissions.length > 0 && !allSelected
  }, [selectedPermissions, allSelected])

  return (
    <div className="space-y-4">
      {/* 全选/取消全选 */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={allSelected ? true : someSelected ? 'indeterminate' : false}
            onCheckedChange={toggleAll}
            disabled={disabled}
          />
          <span className="font-medium">
            {allSelected ? t('permissions.deselectAll') : t('permissions.selectAll')} ({selectedPermissions.length} / {permissions.length})
          </span>
        </div>
      </div>

      {/* 权限树 */}
      <ScrollArea className="pr-4" style={{ maxHeight }}>
        <div className="space-y-4">
          {permissionTree.map((moduleData) => (
            <div key={moduleData.module} className="space-y-2">
              {/* 模块标题 */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleModule(moduleData.module)}
                  disabled={disabled}
                >
                  {expandedModules.has(moduleData.module) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                <Checkbox
                  checked={
                    areAllModulePermissionsSelected(moduleData)
                      ? true
                      : areSomeModulePermissionsSelected(moduleData)
                        ? 'indeterminate'
                        : false
                  }
                  onCheckedChange={() => toggleModulePermissions(moduleData)}
                  disabled={disabled}
                />
                <span className="font-semibold text-sm">{moduleData.moduleName}</span>
              </div>

              {/* 模块内容 */}
              {expandedModules.has(moduleData.module) && (
                <div className="ml-6 space-y-3">
                  {moduleData.nodes.map((node) => (
                    <div key={node.permission.code} className="space-y-2">
                      {/* 父节点（Page 权限） */}
                      <div className="flex items-center gap-2">
                        {node.children.length > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleNodeExpanded(node.permission.code)}
                            disabled={disabled}
                          >
                            {expandedNodes.has(node.permission.code) ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                        {node.children.length === 0 && <div className="w-6" />}
                        <Checkbox
                          checked={
                            isPermissionSelected(node.permission.code) || areAllChildrenSelected(node)
                              ? true
                              : areSomeChildrenSelected(node)
                                ? 'indeterminate'
                                : false
                          }
                          onCheckedChange={() => toggleNode(node)}
                          disabled={disabled}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{node.permission.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {node.permission.code}
                          </div>
                        </div>
                      </div>

                      {/* 子节点（Action 权限） */}
                      {expandedNodes.has(node.permission.code) && node.children.length > 0 && (
                        <div className="ml-8 space-y-2">
                          {node.children.map((child) => (
                            <div key={child.code} className="flex items-center gap-2">
                              <Checkbox
                                checked={isPermissionSelected(child.code)}
                                onCheckedChange={() => togglePermission(child.code)}
                                disabled={disabled}
                              />
                              <div className="flex-1">
                                <div className="text-sm">{child.name}</div>
                                <div className="text-xs text-muted-foreground">{child.code}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

