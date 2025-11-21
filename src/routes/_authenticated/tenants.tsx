import { createFileRoute } from '@tanstack/react-router'
import { TenantsPage } from '@/features/tenants/pages/tenants-page'

export const Route = createFileRoute('/_authenticated/tenants')({
  component: TenantsPage,
})
