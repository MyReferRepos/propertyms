import { format } from 'date-fns'
import { AlertTriangle, Calendar, CalendarDays } from 'lucide-react'
import { useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

import type { ActionItem, ActionItemFilters } from '../../types/workbench'
import { isDueThisWeek, isDueToday, isOverdue } from '../../types/workbench'

import { MiniCalendar } from './mini-calendar'

interface TodayFocusCardProps {
  items: ActionItem[]
  onFilterChange?: (filter: ActionItemFilters['timeRange']) => void
  onDateSelect?: (date: Date) => void
}

interface StatBadgeProps {
  icon: typeof AlertTriangle
  label: string
  count: number
  variant: 'overdue' | 'today' | 'week'
  active?: boolean
  onClick?: () => void
}

function StatBadge({ icon: Icon, label, count, variant, active, onClick }: StatBadgeProps) {
  const variantStyles = {
    overdue: 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30',
    today:
      'bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30',
    week: 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30',
  }

  const activeStyles = {
    overdue: 'ring-2 ring-red-500',
    today: 'ring-2 ring-orange-500',
    week: 'ring-2 ring-blue-500',
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 transition-all',
        variantStyles[variant],
        active && activeStyles[variant],
        count === 0 && 'opacity-50'
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="text-lg font-bold">{count}</span>
      <span className="text-xs">{label}</span>
    </button>
  )
}

export function TodayFocusCard({ items, onFilterChange, onDateSelect }: TodayFocusCardProps) {
  const { t } = useI18n()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [activeFilter, setActiveFilter] = useState<'overdue' | 'today' | 'week' | null>(null)

  const overdueItems = items.filter(isOverdue)
  const dueTodayItems = items.filter((item) => isDueToday(item) && !isOverdue(item))
  const dueThisWeekItems = items.filter((item) => isDueThisWeek(item) && !isDueToday(item) && !isOverdue(item))

  const handleFilterClick = (filter: 'overdue' | 'today' | 'week') => {
    if (activeFilter === filter) {
      setActiveFilter(null)
      onFilterChange?.('all')
    } else {
      setActiveFilter(filter)
      onFilterChange?.(filter)
    }
    setSelectedDate(undefined)
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setActiveFilter(null)
    onDateSelect?.(date)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          {/* Left: Stats badges */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">{t('workbench.todayFocus.title')}</h3>
            <div className="flex flex-wrap gap-2">
              <StatBadge
                icon={AlertTriangle}
                label={t('workbench.todayFocus.overdue')}
                count={overdueItems.length}
                variant="overdue"
                active={activeFilter === 'overdue'}
                onClick={() => handleFilterClick('overdue')}
              />
              <StatBadge
                icon={Calendar}
                label={t('workbench.todayFocus.dueToday')}
                count={dueTodayItems.length}
                variant="today"
                active={activeFilter === 'today'}
                onClick={() => handleFilterClick('today')}
              />
              <StatBadge
                icon={CalendarDays}
                label={t('workbench.todayFocus.thisWeek')}
                count={dueThisWeekItems.length}
                variant="week"
                active={activeFilter === 'week'}
                onClick={() => handleFilterClick('week')}
              />
            </div>

            {/* Selected date info */}
            {selectedDate && (
              <div className="rounded-md bg-muted px-3 py-2 text-sm">
                <span className="text-muted-foreground">{t('workbench.common.dueAt')}: </span>
                <span className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
              </div>
            )}
          </div>

          {/* Right: Mini calendar */}
          <div className="flex-1 lg:max-w-[320px]">
            <MiniCalendar items={items} onDateSelect={handleDateSelect} selectedDate={selectedDate} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
