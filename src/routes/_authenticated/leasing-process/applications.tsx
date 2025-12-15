import { createFileRoute } from '@tanstack/react-router'
import { ApplicationsPage } from '@/features/leasing-process'

export const Route = createFileRoute('/_authenticated/leasing-process/applications')({
  component: ApplicationsPage,
})
