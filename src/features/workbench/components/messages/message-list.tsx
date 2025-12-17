import { Bell, Building2, Inbox, Mail, MailOpen, Truck, User, Users } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

import type { Message, MessageFilters, MessageType } from '../../types/workbench'

import { MessageItem } from './message-item'

interface MessageListProps {
  messages: Message[]
  onMarkAsRead?: (id: string) => void
  onArchive?: (id: string) => void
  onReply?: (id: string) => void
  onConvertToTask?: (id: string) => void
  onSetReminder?: (id: string) => void
}

type StatusFilter = MessageFilters['status']

export function MessageList({
  messages,
  onMarkAsRead,
  onArchive,
  onReply,
  onConvertToTask,
  onSetReminder,
}: MessageListProps) {
  const { t } = useI18n()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [typeFilter, setTypeFilter] = useState<MessageType | 'all'>('all')

  // Apply filters
  const filteredMessages = messages.filter((message) => {
    // Status filter
    if (statusFilter === 'unread' && message.status !== 'unread') return false
    if (statusFilter === 'requires_action' && !message.requiresAction) return false
    if (statusFilter === 'archived' && message.status !== 'archived') return false

    // Type filter
    if (typeFilter !== 'all' && message.type !== typeFilter) return false

    return true
  })

  // Sort by received date (newest first)
  const sortedMessages = [...filteredMessages].sort(
    (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  )

  // Count unread
  const unreadCount = messages.filter((m) => m.status === 'unread').length
  const requiresActionCount = messages.filter((m) => m.requiresAction && m.status !== 'archived').length

  const statusFilters: { key: StatusFilter; label: string; icon: typeof Mail; count?: number }[] = [
    { key: 'all', label: t('workbench.messages.all'), icon: Inbox },
    { key: 'unread', label: t('workbench.messages.unread'), icon: Mail, count: unreadCount },
    { key: 'requires_action', label: t('workbench.messages.requiresAction'), icon: MailOpen, count: requiresActionCount },
    { key: 'archived', label: t('workbench.messages.archived'), icon: Inbox },
  ]

  const typeFilters: { key: MessageType | 'all'; label: string; icon: typeof Users }[] = [
    { key: 'all', label: t('workbench.messages.all'), icon: Inbox },
    { key: 'tenant', label: t('workbench.messages.type.tenant'), icon: Users },
    { key: 'owner', label: t('workbench.messages.type.owner'), icon: User },
    { key: 'supplier', label: t('workbench.messages.type.supplier'), icon: Truck },
    { key: 'system', label: t('workbench.messages.type.system'), icon: Bell },
    { key: 'team', label: t('workbench.messages.type.team'), icon: Building2 },
  ]

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{t('workbench.messages.title')}</span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium text-white">{unreadCount}</span>
          )}
        </CardTitle>

        {/* Status Filter */}
        <div className="flex gap-1 pt-2">
          {statusFilters.map(({ key, label, count }) => (
            <Button
              key={key}
              variant={statusFilter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(key)}
              className="h-8"
            >
              {label}
              {count !== undefined && count > 0 && (
                <span className="ml-1 rounded-full bg-white/20 px-1.5 text-xs">{count}</span>
              )}
            </Button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap gap-1 pt-1">
          {typeFilters.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant="ghost"
              size="sm"
              onClick={() => setTypeFilter(key)}
              className={cn('h-7 text-xs', typeFilter === key && 'bg-muted')}
            >
              <Icon className="mr-1 h-3 w-3" />
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto">
        {sortedMessages.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-8 text-center">
            <Inbox className="mb-2 h-12 w-12 opacity-50" />
            <p>{t('workbench.messages.noMessages')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedMessages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                onMarkAsRead={onMarkAsRead}
                onArchive={onArchive}
                onReply={onReply}
                onConvertToTask={onConvertToTask}
                onSetReminder={onSetReminder}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
