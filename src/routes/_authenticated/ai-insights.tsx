import { createFileRoute } from '@tanstack/react-router'
import { AIInsightsPage } from '@/features/ai-insights/pages/ai-insights-page'

export const Route = createFileRoute('/_authenticated/ai-insights')({
  component: AIInsightsPage,
})
