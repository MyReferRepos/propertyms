import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

import type { Priority } from '../../types/workbench'

interface PriorityBadgeProps {
  priority: Priority
  className?: string
}

const priorityStyles: Record<Priority, string> = {
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const { t } = useI18n()

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        priorityStyles[priority],
        className
      )}
    >
      {t(`workbench.priority.${priority}`)}
    </span>
  )
}
