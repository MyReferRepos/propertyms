import { createFileRoute } from '@tanstack/react-router'
import { ListingPage } from '@/features/leasing-process'

export const Route = createFileRoute('/_authenticated/leasing-process/listing')({
  component: ListingPage,
})
