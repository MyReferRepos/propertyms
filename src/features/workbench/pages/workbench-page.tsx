import { isSameDay } from 'date-fns'
import { Bell, ListTodo, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockMessages, mockReminders, mockTasks } from '@/data/mock/workbench'
import { useI18n } from '@/lib/i18n'

import { ActionItemList } from '../components/action-items'
import { MessageList } from '../components/messages'
import { TodayFocusCard } from '../components/today-focus'
import type { ActionItem, ActionItemFilters, Message, Reminder, Task } from '../types/workbench'

export function WorkbenchPage() {
  const { t } = useI18n()

  // State for action items and messages
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders)
  const [messages, setMessages] = useState<Message[]>(mockMessages)

  // Filter state
  const [timeFilter, setTimeFilter] = useState<ActionItemFilters['timeRange']>('all')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Combine tasks and reminders into action items
  const actionItems: ActionItem[] = [...tasks, ...reminders]

  // Task handlers
  const handleTaskStart = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: 'in_progress' as const, updatedAt: new Date().toISOString() } : task
      )
    )
  }

  const handleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: 'completed' as const,
              completedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    )
  }

  const handleTaskCancel = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: 'cancelled' as const, updatedAt: new Date().toISOString() } : task
      )
    )
  }

  const handleTaskSnooze = (id: string) => {
    // For now, snooze by 1 day
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, dueAt: tomorrow.toISOString(), updatedAt: new Date().toISOString() } : task
      )
    )
  }

  // Reminder handlers
  const handleReminderConvert = (id: string) => {
    const reminder = reminders.find((r) => r.id === id)
    if (!reminder) return

    // Create a new task from the reminder
    const newTask: Task = {
      id: `task-converted-${Date.now()}`,
      itemType: 'task',
      title: reminder.title,
      description: reminder.description,
      priority: reminder.priority,
      status: 'pending',
      category: 'general',
      dueAt: reminder.dueAt,
      relatedEntity: reminder.relatedEntity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user-001',
    }

    setTasks((prev) => [newTask, ...prev])
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'dismissed' as const, convertedToTaskId: newTask.id } : r))
    )
  }

  const handleReminderSnooze = (id: string) => {
    // Snooze by 1 day
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id
          ? {
              ...reminder,
              status: 'snoozed' as const,
              snoozedUntil: tomorrow.toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : reminder
      )
    )
  }

  const handleReminderDismiss = (id: string) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id
          ? { ...reminder, status: 'dismissed' as const, updatedAt: new Date().toISOString() }
          : reminder
      )
    )
  }

  // Message handlers
  const handleMarkAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === id ? { ...message, status: 'read' as const, readAt: new Date().toISOString() } : message
      )
    )
  }

  const handleArchive = (id: string) => {
    setMessages((prev) =>
      prev.map((message) => (message.id === id ? { ...message, status: 'archived' as const } : message))
    )
  }

  const handleReply = (_id: string) => {
    // For demo, placeholder
  }

  const handleMessageToTask = (id: string) => {
    const message = messages.find((m) => m.id === id)
    if (!message) return

    const newTask: Task = {
      id: `task-from-msg-${Date.now()}`,
      itemType: 'task',
      title: `Follow up: ${message.subject}`,
      description: message.content,
      priority: message.requiresAction ? 'high' : 'medium',
      status: 'pending',
      category: 'general',
      relatedEntity: message.relatedEntity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user-001',
    }

    setTasks((prev) => [newTask, ...prev])
    handleMarkAsRead(id)
  }

  const handleMessageToReminder = (id: string) => {
    const message = messages.find((m) => m.id === id)
    if (!message) return

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const newReminder: Reminder = {
      id: `rem-from-msg-${Date.now()}`,
      itemType: 'reminder',
      title: `Follow up: ${message.subject}`,
      description: message.content,
      priority: 'medium',
      status: 'active',
      source: 'manual',
      dueAt: tomorrow.toISOString(),
      relatedEntity: message.relatedEntity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user-001',
    }

    setReminders((prev) => [newReminder, ...prev])
    handleMarkAsRead(id)
  }

  // Filter active items (not completed/cancelled/dismissed)
  const activeActionItems = useMemo(() => {
    return actionItems.filter((item) => {
      if (item.itemType === 'task') {
        return item.status !== 'completed' && item.status !== 'cancelled'
      }
      return item.status !== 'dismissed'
    })
  }, [actionItems])

  // Filter by selected date if any
  const filteredActionItems = useMemo(() => {
    if (!selectedDate) return activeActionItems

    return activeActionItems.filter((item) => {
      if (!item.dueAt) return false
      return isSameDay(new Date(item.dueAt), selectedDate)
    })
  }, [activeActionItems, selectedDate])

  // Handle date selection from calendar
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setTimeFilter('all') // Reset time filter when selecting a date
  }

  // Handle filter change from stats
  const handleFilterChange = (filter: ActionItemFilters['timeRange']) => {
    setTimeFilter(filter)
    setSelectedDate(null) // Clear date selection when using filter
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('workbench.title')}</h1>
          <p className="text-muted-foreground">{t('workbench.subtitle')}</p>
        </div>

        {/* New Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('workbench.common.new')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <ListTodo className="mr-2 h-4 w-4" />
              {t('workbench.create.newTask')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              {t('workbench.create.newReminder')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Today's Focus with Calendar */}
      <TodayFocusCard items={activeActionItems} onFilterChange={handleFilterChange} onDateSelect={handleDateSelect} />

      {/* Main Content: Action Items + Messages */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Action Items */}
        <ActionItemList
          items={selectedDate ? filteredActionItems : activeActionItems}
          initialFilter={timeFilter}
          onTaskStart={handleTaskStart}
          onTaskComplete={handleTaskComplete}
          onTaskCancel={handleTaskCancel}
          onTaskSnooze={handleTaskSnooze}
          onReminderConvert={handleReminderConvert}
          onReminderSnooze={handleReminderSnooze}
          onReminderDismiss={handleReminderDismiss}
        />

        {/* Messages */}
        <MessageList
          messages={messages}
          onMarkAsRead={handleMarkAsRead}
          onArchive={handleArchive}
          onReply={handleReply}
          onConvertToTask={handleMessageToTask}
          onSetReminder={handleMessageToReminder}
        />
      </div>
    </div>
  )
}
