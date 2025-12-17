import { Bell, BellOff, Clock, ListTodo, MoreHorizontal, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

import type { Reminder } from '../../types/workbench'
import { DueDateBadge, EntityLink, PriorityBadge } from '../shared'

interface ReminderItemProps {
  reminder: Reminder
  onConvertToTask?: (id: string) => void
  onSnooze?: (id: string) => void
  onDismiss?: (id: string) => void
}

export function ReminderItem({ reminder, onConvertToTask, onSnooze, onDismiss }: ReminderItemProps) {
  const { t } = useI18n()

  const isDismissed = reminder.status === 'dismissed'
  const isSnoozed = reminder.status === 'snoozed'
  const hasRecurrence = !!reminder.recurrence && reminder.recurrence.type !== 'once'

  return (
    <Card className={cn('p-4 transition-all hover:shadow-md', isDismissed && 'opacity-60')}>
      <div className="flex items-start gap-3">
        {/* Reminder Icon */}
        <div
          className={cn(
            'flex-shrink-0 rounded-full p-2',
            isSnoozed
              ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
          )}
        >
          {isSnoozed ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className={cn('font-medium', isDismissed && 'line-through')}>{reminder.title}</h4>
              {reminder.description && (
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{reminder.description}</p>
              )}
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onConvertToTask?.(reminder.id)}>
                  <ListTodo className="mr-2 h-4 w-4" />
                  {t('workbench.reminder.actions.convertToTask')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSnooze?.(reminder.id)}>
                  <Clock className="mr-2 h-4 w-4" />
                  {t('workbench.reminder.actions.snooze')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDismiss?.(reminder.id)}
                  className="text-red-600 dark:text-red-400"
                >
                  <BellOff className="mr-2 h-4 w-4" />
                  {t('workbench.reminder.actions.dismiss')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Meta Info */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <PriorityBadge priority={reminder.priority} />
            <DueDateBadge dueAt={reminder.dueAt} />

            {/* Recurrence Badge */}
            {hasRecurrence && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                <RefreshCw className="h-3 w-3" />
                {t(`workbench.reminder.recurrence.${reminder.recurrence?.type}`)}
              </span>
            )}

            {/* Source Badge */}
            <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
              {t(`workbench.reminder.source.${reminder.source}`)}
            </span>
          </div>

          {/* Snoozed Until */}
          {isSnoozed && reminder.snoozedUntil && (
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>
                {t('workbench.reminder.snoozedUntil')}: {new Date(reminder.snoozedUntil).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Related Entity */}
          {reminder.relatedEntity && (
            <div className="mt-2">
              <EntityLink entity={reminder.relatedEntity} />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
