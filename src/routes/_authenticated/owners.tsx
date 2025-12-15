import { createFileRoute } from '@tanstack/react-router'
import { OwnersPage } from '@/features/owners'

export const Route = createFileRoute('/_authenticated/owners')({
  component: OwnersPage,
})
