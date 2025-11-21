import { AlertTriangle, CheckCircle2, Lightbulb, ListTodo, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { AIInsight } from '@/types'

interface AIInsightCardProps {
  insight: AIInsight
  onAction?: () => void
  onDismiss?: () => void
}

const insightIcons = {
  warning: AlertTriangle,
  task: ListTodo,
  opportunity: Lightbulb,
  recommendation: CheckCircle2,
}

const insightColors = {
  warning: 'text-amber-600 bg-amber-50',
  task: 'text-blue-600 bg-blue-50',
  opportunity: 'text-green-600 bg-green-50',
  recommendation: 'text-purple-600 bg-purple-50',
}

const priorityColors = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-amber-100 text-amber-700',
}

export function AIInsightCard({ insight, onAction, onDismiss }: AIInsightCardProps) {
  const Icon = insightIcons[insight.type]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', insightColors[insight.type])}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="text-sm font-semibold">{insight.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{insight.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={cn('text-xs', priorityColors[insight.priority])}>
                  {insight.priority}
                </Badge>
                {onDismiss && (
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDismiss}>
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            {insight.actionable && insight.action && (
              <Button size="sm" variant="outline" className="h-8" onClick={onAction}>
                {insight.action.label}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
