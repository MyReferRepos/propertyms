import { createFileRoute } from '@tanstack/react-router'
import { AuditPage } from '@/features/accounting'

export const Route = createFileRoute('/_authenticated/accounting/audit')({
  component: AuditPage,
})
