import { createFileRoute } from '@tanstack/react-router'
import { MaintenancePage } from '@/features/maintenance/pages/maintenance-page'

export const Route = createFileRoute('/_authenticated/maintenance')({
  component: MaintenancePage,
})
