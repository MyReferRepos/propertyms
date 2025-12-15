import { createFileRoute } from '@tanstack/react-router'
import { ReviewsPage } from '@/features/suppliers'

export const Route = createFileRoute('/_authenticated/suppliers/reviews')({
  component: ReviewsPage,
})
