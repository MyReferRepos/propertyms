import { createFileRoute } from '@tanstack/react-router'
import { AssignmentsPage } from '@/features/suppliers'

export const Route = createFileRoute('/_authenticated/suppliers/assignments')({
  component: AssignmentsPage,
})
