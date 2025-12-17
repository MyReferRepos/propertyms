import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

import type { ActionItem } from '../../types/workbench'

interface MiniCalendarProps {
  items: ActionItem[]
  onDateSelect?: (date: Date) => void
  selectedDate?: Date
}

export function MiniCalendar({ items, onDateSelect, selectedDate }: MiniCalendarProps) {
  const { t } = useI18n()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Get dates with items
  const itemDates = useMemo(() => {
    const dates = new Map<string, { count: number; hasOverdue: boolean; hasUrgent: boolean }>()

    items.forEach((item) => {
      if (item.dueAt) {
        const dateKey = format(new Date(item.dueAt), 'yyyy-MM-dd')
        const existing = dates.get(dateKey) || { count: 0, hasOverdue: false, hasUrgent: false }
        existing.count++

        const dueDate = new Date(item.dueAt)
        if (dueDate < new Date() && !isToday(dueDate)) {
          existing.hasOverdue = true
        }
        if (item.priority === 'urgent' || item.priority === 'high') {
          existing.hasUrgent = true
        }

        dates.set(dateKey, existing)
      }
    })

    return dates
  }, [items])

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentMonth])

  // Week day headers
  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => format(addDays(start, i), 'EEE'))
  }, [])

  const goToPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const goToToday = () => setCurrentMonth(new Date())

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToPrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[120px] text-center text-sm font-medium">{format(currentMonth, 'MMMM yyyy')}</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={goToToday}>
          {t('workbench.common.today')}
        </Button>
      </div>

      {/* Week day headers */}
      <div className="mb-1 grid grid-cols-7 gap-0.5">
        {weekDays.map((day) => (
          <div key={day} className="text-muted-foreground py-1 text-center text-xs font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd')
          const itemInfo = itemDates.get(dateKey)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isTodayDate = isToday(day)

          return (
            <button
              key={dateKey}
              onClick={() => onDateSelect?.(day)}
              className={cn(
                'relative flex h-8 w-full items-center justify-center rounded-md text-sm transition-colors',
                !isCurrentMonth && 'text-muted-foreground/50',
                isCurrentMonth && 'hover:bg-muted',
                isTodayDate && 'font-bold',
                isTodayDate && !isSelected && 'bg-primary/10 text-primary',
                isSelected && 'bg-primary text-primary-foreground'
              )}
            >
              {format(day, 'd')}

              {/* Indicator dots */}
              {itemInfo && itemInfo.count > 0 && (
                <span
                  className={cn(
                    'absolute bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full',
                    itemInfo.hasOverdue
                      ? 'bg-red-500'
                      : itemInfo.hasUrgent
                        ? 'bg-orange-500'
                        : 'bg-blue-500',
                    isSelected && 'bg-primary-foreground'
                  )}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-2 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-muted-foreground">{t('workbench.todayFocus.overdue')}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          <span className="text-muted-foreground">{t('workbench.priority.urgent')}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-muted-foreground">{t('workbench.task.title')}</span>
        </div>
      </div>
    </div>
  )
}
