import { useState, useEffect } from 'react'
import { Sparkles, X, Check, ChevronRight, Bell, TrendingUp, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { dashboardAPI } from '@/services/api'
import type { AIInsight } from '@/types'
import { cn } from '@/lib/utils'

const insightIcons = {
  warning: AlertTriangle,
  task: Bell,
  opportunity: TrendingUp,
  recommendation: Sparkles,
}

const insightColors = {
  warning: 'text-amber-600 bg-amber-50 border-amber-200',
  task: 'text-blue-600 bg-blue-50 border-blue-200',
  opportunity: 'text-green-600 bg-green-50 border-green-200',
  recommendation: 'text-purple-600 bg-purple-50 border-purple-200',
}

export function PropertyPilot() {
  const [isOpen, setIsOpen] = useState(false)
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInsights()
  }, [])

  const loadInsights = async () => {
    try {
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

  const handleDismiss = async (id: string) => {
    try {
      await dashboardAPI.dismissInsight(id)
      setInsights(insights.filter((i) => i.id !== id))
    } catch (error) {
      console.error('Failed to dismiss insight:', error)
    }
  }

  const handleAction = (insight: AIInsight) => {
    if (insight.action?.handler) {
      insight.action.handler()
    }
  }

  const actionableCount = insights.filter((i) => i.actionable).length
  const highPriorityCount = insights.filter((i) => i.priority === 'high').length

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <Sparkles className="h-6 w-6" />
            {actionableCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
                {actionableCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Expanded Panel */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-40 w-96 shadow-2xl">
          <CardHeader className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="h-5 w-5" />
                  PropertyPilot
                </CardTitle>
                <p className="text-sm text-purple-100 mt-1">
                  Your AI property management assistant
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-4 flex gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                {actionableCount} actionable
              </Badge>
              {highPriorityCount > 0 && (
                <Badge variant="secondary" className="bg-red-500/90 text-white hover:bg-red-500">
                  {highPriorityCount} high priority
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-sm text-muted-foreground">Loading insights...</p>
                  </div>
                </div>
              ) : insights.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                  <div className="rounded-full bg-green-100 p-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="mt-4 font-semibold">All caught up!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    No pending tasks or recommendations right now.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {insights.map((insight) => {
                    const Icon = insightIcons[insight.type]
                    return (
                      <div key={insight.id} className="p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border',
                              insightColors[insight.type],
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-sm">{insight.title}</h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 flex-shrink-0"
                                onClick={() => handleDismiss(insight.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>

                            <p className="text-sm text-muted-foreground">{insight.description}</p>

                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-xs',
                                  insight.priority === 'high' && 'border-red-600 text-red-700',
                                  insight.priority === 'medium' && 'border-amber-600 text-amber-700',
                                  insight.priority === 'low' && 'border-blue-600 text-blue-700',
                                )}
                              >
                                {insight.priority}
                              </Badge>

                              <span className="text-xs text-muted-foreground">
                                {new Date(insight.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            {insight.actionable && insight.action && (
                              <Button
                                size="sm"
                                className="w-full"
                                onClick={() => handleAction(insight)}
                              >
                                {insight.action.label}
                                <ChevronRight className="ml-2 h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </>
  )
}
