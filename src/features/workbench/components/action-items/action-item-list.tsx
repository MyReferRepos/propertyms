import { Bell, CheckSquare, Inbox } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

import type { ActionItem, ActionItemFilters, Reminder, Task } from '../../types/workbench'
import { isDueThisWeek, isDueToday, isOverdue, isReminder, isTask, sortActionItems } from '../../types/workbench'

import { ReminderItem } from './reminder-item'
import { TaskItem } from './task-item'

interface ActionItemListProps {
  items: ActionItem[]
  initialFilter?: ActionItemFilters['timeRange']
  onTaskStart?: (id: string) => void
  onTaskComplete?: (id: string) => void
  onTaskCancel?: (id: string) => void
  onTaskSnooze?: (id: string) => void
  onReminderConvert?: (id: string) => void
  onReminderSnooze?: (id: string) => void
  onReminderDismiss?: (id: string) => void
}

type TypeFilter = 'all' | 'task' | 'reminder'
type TimeFilter = 'all' | 'overdue' | 'today' | 'week' | 'later'

export function ActionItemList({
  items,
  initialFilter = 'all',
  onTaskStart,
  onTaskComplete,
  onTaskCancel,
  onTaskSnooze,
  onReminderConvert,
  onReminderSnooze,
  onReminderDismiss,
}: ActionItemListProps) {
  const { t } = useI18n()
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(initialFilter)

  // Apply filters
  const filteredItems = items.filter((item) => {
    // Type filter
    if (typeFilter === 'task' && !isTask(item)) return false
    if (typeFilter === 'reminder' && !isReminder(item)) return false

    // Time filter
    if (timeFilter === 'overdue') return isOverdue(item)
    if (timeFilter === 'today') return isDueToday(item) && !isOverdue(item)
    if (timeFilter === 'week') return isDueThisWeek(item) && !isDueToday(item) && !isOverdue(item)
    if (timeFilter === 'later') return !isDueThisWeek(item) && !isOverdue(item)

    return true
  })

  // Sort items
  const sortedItems = sortActionItems(filteredItems)

  // Group by type for display
  const tasks = sortedItems.filter(isTask) as Task[]
  const reminders = sortedItems.filter(isReminder) as Reminder[]

  const typeFilters: { key: TypeFilter; label: string; icon: typeof Inbox }[] = [
    { key: 'all', label: t('workbench.actionItems.all'), icon: Inbox },
    { key: 'task', label: t('workbench.actionItems.tasks'), icon: CheckSquare },
    { key: 'reminder', label: t('workbench.actionItems.reminders'), icon: Bell },
  ]

  const timeFilters: { key: TimeFilter; label: string }[] = [
    { key: 'all', label: t('workbench.actionItems.all') },
    { key: 'overdue', label: t('workbench.actionItems.overdue') },
    { key: 'today', label: t('workbench.actionItems.today') },
    { key: 'week', label: t('workbench.actionItems.week') },
    { key: 'later', label: t('workbench.actionItems.later') },
  ]

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{t('workbench.actionItems.title')}</CardTitle>

        {/* Type Filter */}
        <div className="flex gap-1 pt-2">
          {typeFilters.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={typeFilter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter(key)}
              className="h-8"
            >
              <Icon className="mr-1 h-3 w-3" />
              {label}
            </Button>
          ))}
        </div>

        {/* Time Filter */}
        <div className="flex flex-wrap gap-1 pt-1">
          {timeFilters.map(({ key, label }) => (
            <Button
              key={key}
              variant="ghost"
              size="sm"
              onClick={() => setTimeFilter(key)}
              className={cn('h-7 text-xs', timeFilter === key && 'bg-muted')}
            >
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto">
        {sortedItems.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-8 text-center">
            <Inbox className="mb-2 h-12 w-12 opacity-50" />
            <p>{t('workbench.actionItems.noItems')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Show by type or mixed based on filter */}
            {typeFilter === 'all' ? (
              <>
                {/* Tasks Section */}
                {tasks.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-muted-foreground flex items-center gap-1 text-xs font-medium uppercase">
                      <CheckSquare className="h-3 w-3" />
                      {t('workbench.actionItems.tasks')} ({tasks.length})
                    </h5>
                    {tasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onStart={onTaskStart}
                        onComplete={onTaskComplete}
                        onCancel={onTaskCancel}
                        onSnooze={onTaskSnooze}
                      />
                    ))}
                  </div>
                )}

                {/* Reminders Section */}
                {reminders.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-muted-foreground flex items-center gap-1 text-xs font-medium uppercase">
                      <Bell className="h-3 w-3" />
                      {t('workbench.actionItems.reminders')} ({reminders.length})
                    </h5>
                    {reminders.map((reminder) => (
                      <ReminderItem
                        key={reminder.id}
                        reminder={reminder}
                        onConvertToTask={onReminderConvert}
                        onSnooze={onReminderSnooze}
                        onDismiss={onReminderDismiss}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : typeFilter === 'task' ? (
              tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onStart={onTaskStart}
                  onComplete={onTaskComplete}
                  onCancel={onTaskCancel}
                  onSnooze={onTaskSnooze}
                />
              ))
            ) : (
              reminders.map((reminder) => (
                <ReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  onConvertToTask={onReminderConvert}
                  onSnooze={onReminderSnooze}
                  onDismiss={onReminderDismiss}
                />
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
