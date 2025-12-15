import { createFileRoute } from '@tanstack/react-router'
import { ViewingPage } from '@/features/leasing-process'

export const Route = createFileRoute('/_authenticated/leasing-process/viewing')({
  component: ViewingPage,
})
