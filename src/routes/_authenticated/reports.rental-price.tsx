import { createFileRoute } from '@tanstack/react-router'
import { RentalPriceReportsPage } from '@/features/reports/pages/rental-price-reports-page'

export const Route = createFileRoute('/_authenticated/reports/rental-price')({
  component: RentalPriceReportsPage,
})
