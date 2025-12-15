import { createFileRoute } from '@tanstack/react-router'
import { AgreementsPage } from '@/features/leasing-process'

export const Route = createFileRoute('/_authenticated/leasing-process/agreements')({
  component: AgreementsPage,
})
