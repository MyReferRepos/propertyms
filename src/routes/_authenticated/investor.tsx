import { createFileRoute } from '@tanstack/react-router'
import { InvestorDashboardPage } from '@/features/investor/pages/investor-dashboard-page'

export const Route = createFileRoute('/_authenticated/investor')({
  component: InvestorDashboardPage,
})
