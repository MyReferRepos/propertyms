import { createFileRoute } from '@tanstack/react-router'
import { CompliancePage } from '@/features/compliance/pages/compliance-page'

export const Route = createFileRoute('/_authenticated/compliance')({
  component: CompliancePage,
})
