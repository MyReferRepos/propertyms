import { createFileRoute } from '@tanstack/react-router'
import { TenanciesPage } from '@/features/tenancies/pages/tenancies-page'

export const Route = createFileRoute('/_authenticated/tenancies')({
  component: TenanciesPage,
})
