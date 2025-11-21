import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    label: string
  }
  icon: LucideIcon
  iconClassName?: string
}

export function StatsCard({ title, value, change, icon: Icon, iconClassName }: StatsCardProps) {
  const isPositive = change && change.value > 0
  const isNegative = change && change.value < 0

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className="text-xs text-muted-foreground">
                <span
                  className={cn(
                    'font-medium',
                    isPositive && 'text-green-600',
                    isNegative && 'text-red-600',
                  )}
                >
                  {isPositive && '+'}
                  {change.value}%
                </span>{' '}
                {change.label}
              </p>
            )}
          </div>
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg',
              iconClassName || 'bg-primary/10 text-primary',
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
