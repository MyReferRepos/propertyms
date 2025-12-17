import { CheckCircle2, Circle, Clock, MoreHorizontal, Play, X } from 'lucide-react'

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

import type { Task } from '../../types/workbench'
import { DueDateBadge, EntityLink, PriorityBadge } from '../shared'

interface TaskItemProps {
  task: Task
  onStart?: (id: string) => void
  onComplete?: (id: string) => void
  onCancel?: (id: string) => void
  onSnooze?: (id: string) => void
}

const statusIcons = {
  pending: Circle,
  in_progress: Play,
  completed: CheckCircle2,
  cancelled: X,
}

export function TaskItem({ task, onStart, onComplete, onCancel, onSnooze }: TaskItemProps) {
  const { t } = useI18n()

  const StatusIcon = statusIcons[task.status]
  const isCompleted = task.status === 'completed'
  const isCancelled = task.status === 'cancelled'

  const completedSubtasks = task.subtasks?.filter((st) => st.completed).length ?? 0
  const totalSubtasks = task.subtasks?.length ?? 0

  return (
    <Card className={cn('p-4 transition-all hover:shadow-md', (isCompleted || isCancelled) && 'opacity-60')}>
      <div className="flex items-start gap-3">
        {/* Status Icon / Checkbox */}
        <button
          onClick={() => {
            if (task.status === 'pending') onStart?.(task.id)
            else if (task.status === 'in_progress') onComplete?.(task.id)
          }}
          className={cn(
            'mt-0.5 flex-shrink-0 rounded-full p-1 transition-colors',
            task.status === 'pending' && 'hover:bg-gray-100 dark:hover:bg-gray-800',
            task.status === 'in_progress' && 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30',
            task.status === 'completed' && 'text-green-500',
            task.status === 'cancelled' && 'text-gray-400'
          )}
          disabled={isCompleted || isCancelled}
        >
          <StatusIcon className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className={cn('font-medium', (isCompleted || isCancelled) && 'line-through')}>{task.title}</h4>
              {task.description && (
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{task.description}</p>
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
                {task.status === 'pending' && (
                  <DropdownMenuItem onClick={() => onStart?.(task.id)}>
                    <Play className="mr-2 h-4 w-4" />
                    {t('workbench.task.actions.start')}
                  </DropdownMenuItem>
                )}
                {task.status === 'in_progress' && (
                  <DropdownMenuItem onClick={() => onComplete?.(task.id)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {t('workbench.task.actions.complete')}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onSnooze?.(task.id)}>
                  <Clock className="mr-2 h-4 w-4" />
                  {t('workbench.task.actions.snooze')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onCancel?.(task.id)} className="text-red-600 dark:text-red-400">
                  <X className="mr-2 h-4 w-4" />
                  {t('workbench.task.actions.cancel')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Subtasks Progress */}
          {totalSubtasks > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>
                  {t('workbench.task.subtasks')}: {completedSubtasks}/{totalSubtasks}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <PriorityBadge priority={task.priority} />
            <DueDateBadge dueAt={task.dueAt} />
            <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
              {t(`workbench.task.category.${task.category}`)}
            </span>
          </div>

          {/* Related Entity */}
          {task.relatedEntity && (
            <div className="mt-2">
              <EntityLink entity={task.relatedEntity} />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
