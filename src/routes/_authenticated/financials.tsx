import { createFileRoute } from '@tanstack/react-router'
import { FinancialsPage } from '@/features/financials/pages/financials-page'

export const Route = createFileRoute('/_authenticated/financials')({
  component: FinancialsPage,
})
