import { createFileRoute } from '@tanstack/react-router'
import { AuditLogsPage } from '@/features/audit-logs'
import { requireAnyPermission } from '@/lib/auth/permission-utils'

export const Route = createFileRoute('/_authenticated/audit-logs')({
  beforeLoad: async () => {
    // Support both permission code formats (backend DbSeeder uses colon, setup script uses underscore)
    requireAnyPermission(['audit_log:list', 'audit_log_list'])
  },
  component: AuditLogsPage,
})
