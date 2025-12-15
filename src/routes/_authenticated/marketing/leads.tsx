import { createFileRoute } from '@tanstack/react-router'
import { LeadsPage } from '@/features/marketing'

export const Route = createFileRoute('/_authenticated/marketing/leads')({
  component: LeadsPage,
})
