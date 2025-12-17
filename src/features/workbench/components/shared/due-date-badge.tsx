import { format, isToday, isTomorrow, isPast } from 'date-fns'
import { Calendar, AlertTriangle } from 'lucide-react'

import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface DueDateBadgeProps {
  dueAt?: string
  className?: string
}

export function DueDateBadge({ dueAt, className }: DueDateBadgeProps) {
  const { t } = useI18n()

  if (!dueAt) return null

  const dueDate = new Date(dueAt)
  const isOverdue = isPast(dueDate) && !isToday(dueDate)
  const isDueToday = isToday(dueDate)
  const isDueTomorrow = isTomorrow(dueDate)

  let displayText: string
  let variant: 'overdue' | 'today' | 'tomorrow' | 'default'

  if (isOverdue) {
    displayText = t('workbench.common.overdue')
    variant = 'overdue'
  } else if (isDueToday) {
    displayText = t('workbench.common.today')
    variant = 'today'
  } else if (isDueTomorrow) {
    displayText = t('workbench.common.tomorrow')
    variant = 'tomorrow'
  } else {
    displayText = format(dueDate, 'MMM d')
    variant = 'default'
  }

  const variantStyles = {
    overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    today: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    tomorrow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    default: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  }

  const Icon = isOverdue ? AlertTriangle : Calendar

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {displayText}
    </span>
  )
}
