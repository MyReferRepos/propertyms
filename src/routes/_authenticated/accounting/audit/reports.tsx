import { createFileRoute } from '@tanstack/react-router'
import { ComplianceReportsPage } from '@/features/accounting'

export const Route = createFileRoute('/_authenticated/accounting/audit/reports')({
  component: ComplianceReportsPage,
})
