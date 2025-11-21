import { createFileRoute } from '@tanstack/react-router'
import { InspectionsPage } from '@/features/inspections/pages/inspections-page'

export const Route = createFileRoute('/_authenticated/inspections')({
  component: InspectionsPage,
})
