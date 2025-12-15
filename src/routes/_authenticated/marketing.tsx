import { createFileRoute } from '@tanstack/react-router'
import { MarketingPage } from '@/features/marketing'

export const Route = createFileRoute('/_authenticated/marketing')({
  component: MarketingPage,
})
