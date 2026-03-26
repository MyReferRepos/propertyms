import { createFileRoute } from '@tanstack/react-router'
import { FinancialAuditPage } from '@/features/accounting'

export const Route = createFileRoute('/_authenticated/accounting/audit/financial')({
  component: FinancialAuditPage,
})
