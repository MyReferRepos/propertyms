import { createFileRoute } from '@tanstack/react-router'
import { LeasingPage } from '@/features/leasing-process'

export const Route = createFileRoute('/_authenticated/leasing-process/')({
  component: LeasingPage,
})
