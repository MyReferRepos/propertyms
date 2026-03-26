import { createFileRoute } from '@tanstack/react-router'
import { AuditLogsPage } from '@/features/accounting'

export const Route = createFileRoute('/_authenticated/accounting/audit/logs')({
  component: AuditLogsPage,
})
