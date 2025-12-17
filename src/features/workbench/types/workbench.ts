// Workbench Types for PropertyMS

// Related Entity - links action items to business entities
export interface RelatedEntity {
  type: 'property' | 'tenant' | 'tenancy' | 'maintenance' | 'compliance' | 'inspection' | 'owner' | 'supplier'
  id: string
  name: string
}

// Priority levels
export type Priority = 'low' | 'medium' | 'high' | 'urgent'

// Base type for all action items
export interface ActionItemBase {
  id: string
  title: string
  description?: string
  priority: Priority
  dueAt?: string // ISO date string
  snoozedUntil?: string // ISO date string

  // Related business entity
  relatedEntity?: RelatedEntity

  // Metadata
  createdAt: string
  updatedAt: string
  createdBy: string
}

// Task status
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

// Task category
export type TaskCategory = 'maintenance' | 'leasing' | 'compliance' | 'financial' | 'inspection' | 'general'

// SubTask
export interface SubTask {
  id: string
  title: string
  completed: boolean
}

// Task type
export interface Task extends ActionItemBase {
  itemType: 'task'
  status: TaskStatus
  completedAt?: string
  assignee?: string
  subtasks?: SubTask[]
  category: TaskCategory
}

// Reminder status
export type ReminderStatus = 'active' | 'snoozed' | 'dismissed'

// Recurrence type
export type RecurrenceType = 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'

// Recurrence configuration
export interface Recurrence {
  type: RecurrenceType
  interval?: number // Every N periods
  daysOfWeek?: number[] // [1,2,3,4,5] = Mon-Fri
  dayOfMonth?: number // 1-31
  endDate?: string // ISO date string
  occurrences?: number // Total occurrences
}

// Reminder source
export type ReminderSource = 'manual' | 'system' | 'workflow'

// Reminder type
export interface Reminder extends ActionItemBase {
  itemType: 'reminder'
  status: ReminderStatus
  recurrence?: Recurrence
  source: ReminderSource
  convertedToTaskId?: string
}

// Message type/source
export type MessageType = 'tenant' | 'owner' | 'supplier' | 'system' | 'team'

// Message status
export type MessageStatus = 'unread' | 'read' | 'archived'

// Message sender
export interface MessageSender {
  id: string
  name: string
  avatar?: string
  type: MessageType
}

// Message type
export interface Message {
  id: string
  type: MessageType
  subject: string
  content: string
  preview: string // First 100 chars
  sender: MessageSender

  // Status
  status: MessageStatus
  requiresAction: boolean
  actionTakenAt?: string

  // Related entity
  relatedEntity?: RelatedEntity
  threadId?: string // Conversation thread

  // Metadata
  receivedAt: string
  readAt?: string
}

// Union types
export type ActionItem = Task | Reminder
export type WorkbenchItem = ActionItem | Message

// Today's Focus summary
export interface TodayFocus {
  overdue: ActionItem[]
  dueToday: ActionItem[]
  urgent: ActionItem[]
  unreadMessages: number
  requiresAction: number
}

// Filter options for action items
export interface ActionItemFilters {
  type: 'all' | 'task' | 'reminder'
  timeRange: 'overdue' | 'today' | 'week' | 'later' | 'all'
  priority?: Priority
  category?: TaskCategory
  entityType?: RelatedEntity['type']
}

// Filter options for messages
export interface MessageFilters {
  status: 'all' | 'unread' | 'requires_action' | 'archived'
  type?: MessageType
}

// Snooze options
export interface SnoozeOption {
  label: string
  value: string // ISO duration or specific date
  minutes?: number
  hours?: number
  days?: number
}

// Default snooze options
export const DEFAULT_SNOOZE_OPTIONS: SnoozeOption[] = [
  { label: '1 hour', value: 'PT1H', hours: 1 },
  { label: '3 hours', value: 'PT3H', hours: 3 },
  { label: 'Tomorrow', value: 'P1D', days: 1 },
  { label: 'Next week', value: 'P7D', days: 7 },
]

// Helper functions
export function isTask(item: ActionItem): item is Task {
  return item.itemType === 'task'
}

export function isReminder(item: ActionItem): item is Reminder {
  return item.itemType === 'reminder'
}

export function isOverdue(item: ActionItem): boolean {
  if (!item.dueAt) return false
  return new Date(item.dueAt) < new Date()
}

export function isDueToday(item: ActionItem): boolean {
  if (!item.dueAt) return false
  const dueDate = new Date(item.dueAt)
  const today = new Date()
  return (
    dueDate.getFullYear() === today.getFullYear() &&
    dueDate.getMonth() === today.getMonth() &&
    dueDate.getDate() === today.getDate()
  )
}

export function isDueThisWeek(item: ActionItem): boolean {
  if (!item.dueAt) return false
  const dueDate = new Date(item.dueAt)
  const today = new Date()
  const weekFromNow = new Date(today)
  weekFromNow.setDate(weekFromNow.getDate() + 7)
  return dueDate >= today && dueDate <= weekFromNow
}

// Priority order for sorting
export const PRIORITY_ORDER: Record<Priority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
}

// Sort action items by priority and due date
export function sortActionItems(items: ActionItem[]): ActionItem[] {
  return [...items].sort((a, b) => {
    // Overdue items first
    const aOverdue = isOverdue(a)
    const bOverdue = isOverdue(b)
    if (aOverdue !== bOverdue) return aOverdue ? -1 : 1

    // Then by priority
    const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    if (priorityDiff !== 0) return priorityDiff

    // Then by due date
    if (a.dueAt && b.dueAt) {
      return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
    }
    if (a.dueAt) return -1
    if (b.dueAt) return 1

    return 0
  })
}
