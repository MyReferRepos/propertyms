import { createFileRoute } from '@tanstack/react-router'
import { SuppliersPage } from '@/features/suppliers'

export const Route = createFileRoute('/_authenticated/suppliers/')({
  component: SuppliersPage,
})
