import { formatDistanceToNow } from 'date-fns'
import {
  Archive,
  Bell,
  Building2,
  CheckCheck,
  ListTodo,
  MoreHorizontal,
  Reply,
  Truck,
  User,
  Users,
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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

import type { Message } from '../../types/workbench'
import { EntityLink } from '../shared'

interface MessageItemProps {
  message: Message
  onMarkAsRead?: (id: string) => void
  onArchive?: (id: string) => void
  onReply?: (id: string) => void
  onConvertToTask?: (id: string) => void
  onSetReminder?: (id: string) => void
}

const senderIcons = {
  tenant: Users,
  owner: User,
  supplier: Truck,
  system: Bell,
  team: Building2,
}

const senderColors = {
  tenant: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  owner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  supplier: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  system: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  team: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

export function MessageItem({
  message,
  onMarkAsRead,
  onArchive,
  onReply,
  onConvertToTask,
  onSetReminder,
}: MessageItemProps) {
  const { t } = useI18n()

  const isUnread = message.status === 'unread'
  const isArchived = message.status === 'archived'
  const SenderIcon = senderIcons[message.type]

  return (
    <Card className={cn('p-4 transition-all hover:shadow-md', isArchived && 'opacity-60', isUnread && 'border-l-4 border-l-blue-500')}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar className="h-10 w-10">
          <AvatarFallback className={senderColors[message.type]}>
            <SenderIcon className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              {/* Sender & Time */}
              <div className="flex items-center gap-2">
                <span className={cn('font-medium', isUnread && 'font-semibold')}>{message.sender.name}</span>
                <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs">
                  {t(`workbench.messages.type.${message.type}`)}
                </span>
                <span className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(message.receivedAt), { addSuffix: true })}
                </span>
              </div>

              {/* Subject */}
              <h4 className={cn('mt-1', isUnread && 'font-medium')}>{message.subject}</h4>

              {/* Preview */}
              <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{message.preview}</p>
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {message.type !== 'system' && (
                  <DropdownMenuItem onClick={() => onReply?.(message.id)}>
                    <Reply className="mr-2 h-4 w-4" />
                    {t('workbench.messages.reply')}
                  </DropdownMenuItem>
                )}
                {isUnread && (
                  <DropdownMenuItem onClick={() => onMarkAsRead?.(message.id)}>
                    <CheckCheck className="mr-2 h-4 w-4" />
                    {t('workbench.messages.markAsRead')}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onConvertToTask?.(message.id)}>
                  <ListTodo className="mr-2 h-4 w-4" />
                  {t('workbench.messages.convertToTask')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSetReminder?.(message.id)}>
                  <Bell className="mr-2 h-4 w-4" />
                  {t('workbench.messages.setReminder')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onArchive?.(message.id)}>
                  <Archive className="mr-2 h-4 w-4" />
                  {t('workbench.messages.archive')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Badges */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {message.requiresAction && (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                {t('workbench.messages.requiresAction')}
              </span>
            )}
            {isUnread && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {t('workbench.messages.unread')}
              </span>
            )}
          </div>

          {/* Related Entity */}
          {message.relatedEntity && (
            <div className="mt-2">
              <EntityLink entity={message.relatedEntity} />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
