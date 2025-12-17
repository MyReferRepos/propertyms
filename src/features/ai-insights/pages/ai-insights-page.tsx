import { useState, useEffect } from 'react'
import { Sparkles, AlertTriangle, Info, Lightbulb, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { dashboardAPI } from '@/services/api'
import type { AIInsight } from '@/types'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

export function AIInsightsPage() {
  const { t } = useI18n()
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | AIInsight['type']>('all')

  useEffect(() => {
    loadInsights()
  }, [])

  const loadInsights = async () => {
    try {
      setLoading(true)
      const response = await dashboardAPI.getAIInsights()
      if (response.success) {
        setInsights(response.data)
      }
    } catch (error) {
      console.error('Failed to load AI insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredInsights = insights.filter((i) => (filter === 'all' ? true : i.type === filter))

  const stats = {
    total: insights.length,
    warnings: insights.filter((i) => i.type === 'warning').length,
    recommendations: insights.filter((i) => i.type === 'recommendation').length,
    opportunities: insights.filter((i) => i.type === 'opportunity').length,
    tasks: insights.filter((i) => i.type === 'task').length,
  }

  const typeIcons = {
    warning: AlertTriangle,
    recommendation: Lightbulb,
    opportunity: TrendingUp,
    task: Info,
  }

  const typeColors = {
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    recommendation: 'bg-blue-100 text-blue-700 border-blue-200',
    opportunity: 'bg-green-100 text-green-700 border-green-200',
    task: 'bg-purple-100 text-purple-700 border-purple-200',
  }

  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-blue-100 text-blue-700',
  }

  const handleAction = (insight: AIInsight) => {
    if (insight.action?.handler) {
      insight.action.handler()
    }
  }

  const handleDismiss = (insightId: string) => {
    setInsights((prev) => prev.filter((i) => i.id !== insightId))
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">{t('aiInsights.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">{t('aiInsights.title')}</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          {t('aiInsights.subtitle')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <button
          className={cn(
            'rounded-lg border p-4 text-left transition-colors hover:bg-accent',
            filter === 'all' && 'border-primary bg-accent'
          )}
          onClick={() => setFilter('all')}
        >
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">{t('aiInsights.stats.all')}</div>
        </button>

        <button
          className={cn(
            'rounded-lg border p-4 text-left transition-colors hover:bg-accent',
            filter === 'warning' && 'border-primary bg-accent'
          )}
          onClick={() => setFilter('warning')}
        >
          <div className="text-2xl font-bold text-amber-600">{stats.warnings}</div>
          <div className="text-sm text-muted-foreground">{t('aiInsights.stats.warnings')}</div>
        </button>

        <button
          className={cn(
            'rounded-lg border p-4 text-left transition-colors hover:bg-accent',
            filter === 'recommendation' && 'border-primary bg-accent'
          )}
          onClick={() => setFilter('recommendation')}
        >
          <div className="text-2xl font-bold text-blue-600">{stats.recommendations}</div>
          <div className="text-sm text-muted-foreground">{t('aiInsights.stats.suggestions')}</div>
        </button>

        <button
          className={cn(
            'rounded-lg border p-4 text-left transition-colors hover:bg-accent',
            filter === 'opportunity' && 'border-primary bg-accent'
          )}
          onClick={() => setFilter('opportunity')}
        >
          <div className="text-2xl font-bold text-green-600">{stats.opportunities}</div>
          <div className="text-sm text-muted-foreground">{t('aiInsights.stats.opportunities')}</div>
        </button>

        <button
          className={cn(
            'rounded-lg border p-4 text-left transition-colors hover:bg-accent',
            filter === 'task' && 'border-primary bg-accent'
          )}
          onClick={() => setFilter('task')}
        >
          <div className="text-2xl font-bold text-purple-600">{stats.tasks}</div>
          <div className="text-sm text-muted-foreground">{t('aiInsights.stats.tasks')}</div>
        </button>
      </div>

      {/* Insights List */}
      <div className="grid gap-4">
        {filteredInsights.map((insight) => {
          const TypeIcon = typeIcons[insight.type]

          return (
            <Card key={insight.id} className="relative overflow-hidden">
              <div
                className={cn(
                  'absolute left-0 top-0 h-full w-1',
                  insight.type === 'warning' && 'bg-amber-500',
                  insight.type === 'recommendation' && 'bg-blue-500',
                  insight.type === 'opportunity' && 'bg-green-500',
                  insight.type === 'task' && 'bg-purple-500'
                )}
              />

              <CardHeader className="pl-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <Badge className={cn(typeColors[insight.type])}>
                        {insight.type.toUpperCase()}
                      </Badge>
                      <Badge className={cn(priorityColors[insight.priority])}>
                        {insight.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1">{insight.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDismiss(insight.id)}>
                    {t('aiInsights.actions.dismiss')}
                  </Button>
                </div>
              </CardHeader>

              {(insight.actionable || insight.relatedEntityId) && (
                <CardContent className="pl-6">
                  <div className="flex items-center gap-2">
                    {insight.actionable && insight.action && (
                      <Button size="sm" onClick={() => handleAction(insight)}>
                        {insight.action.label}
                      </Button>
                    )}

                    {insight.relatedEntityId && insight.relatedEntityType === 'property' && (
                      <Badge variant="outline">Property: {insight.relatedEntityId}</Badge>
                    )}

                    {insight.relatedEntityId && insight.relatedEntityType === 'tenancy' && (
                      <Badge variant="outline">Tenancy: {insight.relatedEntityId}</Badge>
                    )}

                    {insight.relatedEntityId && insight.relatedEntityType === 'maintenance' && (
                      <Badge variant="outline">Maintenance: {insight.relatedEntityId}</Badge>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}

        {filteredInsights.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Sparkles className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">{t('aiInsights.empty.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {filter === 'all'
                  ? t('aiInsights.empty.allMessage')
                  : t('aiInsights.empty.filterMessage', { type: filter })}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
