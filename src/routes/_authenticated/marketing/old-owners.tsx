import { createFileRoute } from '@tanstack/react-router'
import { OldOwnersPage } from '@/features/marketing'

export const Route = createFileRoute('/_authenticated/marketing/old-owners')({
  component: OldOwnersPage,
})
