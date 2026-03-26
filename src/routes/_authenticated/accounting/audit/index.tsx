import { createFileRoute } from '@tanstack/react-router'
import { AuditOverviewPage } from '@/features/accounting'

export const Route = createFileRoute('/_authenticated/accounting/audit/')({
  component: AuditOverviewPage,
})
