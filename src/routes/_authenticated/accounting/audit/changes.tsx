import { createFileRoute } from '@tanstack/react-router'
import { ChangeTrackingPage } from '@/features/accounting'

export const Route = createFileRoute('/_authenticated/accounting/audit/changes')({
  component: ChangeTrackingPage,
})
