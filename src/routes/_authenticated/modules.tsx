/**
 * Modules Management Route
 * 模块管理路由
 */

import { createFileRoute } from '@tanstack/react-router'
import { ModulesPage } from '@/features/modules'
import { requirePermission } from '@/lib/auth/permission-utils'

export const Route = createFileRoute('/_authenticated/modules')({
  beforeLoad: async () => {
    // 需要模块管理权限
    requirePermission('module:list')
  },
  component: ModulesPage,
})
