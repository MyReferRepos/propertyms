// Mock data for Workbench feature
import type { Message, Reminder, Task } from '@/features/workbench/types/workbench'

// Helper to create dates relative to today
const today = new Date()
const daysFromNow = (days: number): string => {
  const date = new Date(today)
  date.setDate(date.getDate() + days)
  return date.toISOString()
}
const daysAgo = (days: number): string => daysFromNow(-days)

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: 'task-001',
    itemType: 'task',
    title: 'Review tenant application - John Smith',
    description: 'Review and approve/reject the rental application for Unit 5A',
    priority: 'high',
    status: 'pending',
    category: 'leasing',
    dueAt: daysFromNow(0), // Due today
    relatedEntity: {
      type: 'property',
      id: 'prop-001',
      name: 'Unit 5A, 123 Queen St',
    },
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
    createdBy: 'user-001',
  },
  {
    id: 'task-002',
    itemType: 'task',
    title: 'Schedule property inspection',
    description: 'Arrange routine inspection for 45 Victoria Ave',
    priority: 'medium',
    status: 'in_progress',
    category: 'inspection',
    dueAt: daysFromNow(3),
    relatedEntity: {
      type: 'property',
      id: 'prop-002',
      name: '45 Victoria Ave',
    },
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
    createdBy: 'user-001',
  },
  {
    id: 'task-003',
    itemType: 'task',
    title: 'Follow up on overdue rent - Unit 3B',
    description: 'Contact tenant regarding $850 overdue rent payment',
    priority: 'urgent',
    status: 'pending',
    category: 'financial',
    dueAt: daysAgo(2), // Overdue
    relatedEntity: {
      type: 'tenancy',
      id: 'ten-003',
      name: 'Unit 3B - Sarah Wilson',
    },
    createdAt: daysAgo(7),
    updatedAt: daysAgo(2),
    createdBy: 'system',
  },
  {
    id: 'task-004',
    itemType: 'task',
    title: 'Arrange plumber for water heater repair',
    description: 'Hot water system not working at 78 Park Road',
    priority: 'high',
    status: 'pending',
    category: 'maintenance',
    dueAt: daysFromNow(1),
    relatedEntity: {
      type: 'maintenance',
      id: 'maint-001',
      name: 'Water heater - 78 Park Road',
    },
    subtasks: [
      { id: 'sub-001', title: 'Get quotes from 3 plumbers', completed: true },
      { id: 'sub-002', title: 'Schedule appointment', completed: false },
      { id: 'sub-003', title: 'Notify tenant of visit time', completed: false },
    ],
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
    createdBy: 'user-001',
  },
  {
    id: 'task-005',
    itemType: 'task',
    title: 'Prepare lease renewal documents',
    description: 'Lease expiring in 30 days, prepare renewal paperwork',
    priority: 'medium',
    status: 'pending',
    category: 'leasing',
    dueAt: daysFromNow(7),
    relatedEntity: {
      type: 'tenancy',
      id: 'ten-005',
      name: 'Unit 2A - Mike Chen',
    },
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    createdBy: 'user-001',
  },
  {
    id: 'task-006',
    itemType: 'task',
    title: 'Update Healthy Homes compliance',
    description: 'Heating assessment required for compliance certificate',
    priority: 'high',
    status: 'pending',
    category: 'compliance',
    dueAt: daysFromNow(14),
    relatedEntity: {
      type: 'compliance',
      id: 'comp-001',
      name: '22 Beach Road - Heating',
    },
    createdAt: daysAgo(10),
    updatedAt: daysAgo(3),
    createdBy: 'system',
  },
]

// Mock Reminders
export const mockReminders: Reminder[] = [
  {
    id: 'rem-001',
    itemType: 'reminder',
    title: 'Lease expiring - Unit 2A',
    description: 'Lease for Mike Chen expires in 30 days. Consider renewal or re-listing.',
    priority: 'high',
    status: 'active',
    source: 'system',
    dueAt: daysFromNow(0), // Today
    relatedEntity: {
      type: 'tenancy',
      id: 'ten-005',
      name: 'Unit 2A - Mike Chen',
    },
    createdAt: daysAgo(60),
    updatedAt: daysAgo(0),
    createdBy: 'system',
  },
  {
    id: 'rem-002',
    itemType: 'reminder',
    title: 'Monthly rent collection day',
    description: 'Check all properties for rent payments',
    priority: 'medium',
    status: 'active',
    source: 'system',
    recurrence: {
      type: 'monthly',
      dayOfMonth: 1,
    },
    dueAt: daysFromNow(3),
    createdAt: daysAgo(365),
    updatedAt: daysAgo(30),
    createdBy: 'system',
  },
  {
    id: 'rem-003',
    itemType: 'reminder',
    title: 'Quarterly compliance check',
    description: 'Review Healthy Homes compliance status for all properties',
    priority: 'medium',
    status: 'active',
    source: 'system',
    recurrence: {
      type: 'monthly',
      interval: 3,
      dayOfMonth: 1,
    },
    dueAt: daysFromNow(15),
    relatedEntity: {
      type: 'compliance',
      id: 'all',
      name: 'All Properties',
    },
    createdAt: daysAgo(90),
    updatedAt: daysAgo(1),
    createdBy: 'system',
  },
  {
    id: 'rem-004',
    itemType: 'reminder',
    title: 'Insurance renewal - 45 Victoria Ave',
    description: 'Property insurance expires in 30 days',
    priority: 'high',
    status: 'active',
    source: 'system',
    dueAt: daysFromNow(5),
    relatedEntity: {
      type: 'property',
      id: 'prop-002',
      name: '45 Victoria Ave',
    },
    createdAt: daysAgo(335),
    updatedAt: daysAgo(0),
    createdBy: 'system',
  },
  {
    id: 'rem-005',
    itemType: 'reminder',
    title: 'Annual property inspection due',
    description: 'Schedule annual inspection for compliance',
    priority: 'medium',
    status: 'active',
    source: 'system',
    recurrence: {
      type: 'yearly',
    },
    dueAt: daysFromNow(21),
    relatedEntity: {
      type: 'property',
      id: 'prop-003',
      name: '78 Park Road',
    },
    createdAt: daysAgo(365),
    updatedAt: daysAgo(0),
    createdBy: 'system',
  },
  {
    id: 'rem-006',
    itemType: 'reminder',
    title: 'Follow up with contractor',
    description: 'Check on repair status for Unit 3B bathroom',
    priority: 'low',
    status: 'snoozed',
    source: 'manual',
    snoozedUntil: daysFromNow(2),
    relatedEntity: {
      type: 'maintenance',
      id: 'maint-002',
      name: 'Bathroom repair - Unit 3B',
    },
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
    createdBy: 'user-001',
  },
]

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: 'msg-001',
    type: 'tenant',
    subject: 'Maintenance Request - Hot Water Issue',
    content:
      "Hi, the hot water heater in our unit stopped working this morning. We have no hot water at all. Could someone please look at this urgently? We've tried resetting it but it's not helping. Thank you.",
    preview: 'Hi, the hot water heater in our unit stopped working this morning...',
    sender: {
      id: 'tenant-001',
      name: 'Sarah Chen',
      type: 'tenant',
    },
    status: 'unread',
    requiresAction: true,
    relatedEntity: {
      type: 'property',
      id: 'prop-003',
      name: '78 Park Road - Unit 2',
    },
    receivedAt: daysAgo(0),
  },
  {
    id: 'msg-002',
    type: 'owner',
    subject: 'Monthly Report Request',
    content:
      "Hello, could you please send me the monthly financial report for my properties? I need it for my accountant before end of week. Also, any updates on the vacancy at Victoria Ave? Thanks.",
    preview: 'Hello, could you please send me the monthly financial report...',
    sender: {
      id: 'owner-001',
      name: 'James Wilson',
      type: 'owner',
    },
    status: 'unread',
    requiresAction: true,
    relatedEntity: {
      type: 'owner',
      id: 'owner-001',
      name: 'James Wilson Properties',
    },
    receivedAt: daysAgo(1),
  },
  {
    id: 'msg-003',
    type: 'system',
    subject: 'Payment Received - Unit 5A',
    content:
      'Rent payment of $650.00 has been received for Unit 5A, 123 Queen Street. Payment reference: PAY-2024-1234. Tenant: John Smith.',
    preview: 'Rent payment of $650.00 has been received for Unit 5A...',
    sender: {
      id: 'system',
      name: 'PropertyMS System',
      type: 'system',
    },
    status: 'read',
    requiresAction: false,
    relatedEntity: {
      type: 'tenancy',
      id: 'ten-001',
      name: 'Unit 5A - John Smith',
    },
    receivedAt: daysAgo(1),
    readAt: daysAgo(0),
  },
  {
    id: 'msg-004',
    type: 'supplier',
    subject: 'Quote for Plumbing Work - 78 Park Road',
    content:
      "Hi, as requested, please find our quote for the hot water heater repair/replacement at 78 Park Road. Option 1: Repair - $450. Option 2: New unit installation - $1,850. Let me know how you'd like to proceed. Available this week.",
    preview: 'Hi, as requested, please find our quote for the hot water heater...',
    sender: {
      id: 'supplier-001',
      name: 'Auckland Plumbing Co.',
      type: 'supplier',
    },
    status: 'unread',
    requiresAction: true,
    relatedEntity: {
      type: 'maintenance',
      id: 'maint-001',
      name: 'Water heater - 78 Park Road',
    },
    receivedAt: daysAgo(0),
  },
  {
    id: 'msg-005',
    type: 'tenant',
    subject: 'Lease Renewal Interest',
    content:
      "Hi there, our lease is coming up for renewal next month. We'd like to stay for another year if possible. Could you let us know the new rental terms? We've been happy here and hope to continue.",
    preview: "Hi there, our lease is coming up for renewal next month...",
    sender: {
      id: 'tenant-002',
      name: 'Mike Chen',
      type: 'tenant',
    },
    status: 'read',
    requiresAction: true,
    relatedEntity: {
      type: 'tenancy',
      id: 'ten-005',
      name: 'Unit 2A - Mike Chen',
    },
    receivedAt: daysAgo(2),
    readAt: daysAgo(1),
  },
  {
    id: 'msg-006',
    type: 'system',
    subject: 'Compliance Alert - Smoke Alarm Check Due',
    content:
      'Annual smoke alarm compliance check is due for 45 Victoria Ave within the next 30 days. Please schedule an inspection to maintain compliance.',
    preview: 'Annual smoke alarm compliance check is due for 45 Victoria Ave...',
    sender: {
      id: 'system',
      name: 'PropertyMS System',
      type: 'system',
    },
    status: 'read',
    requiresAction: false,
    relatedEntity: {
      type: 'compliance',
      id: 'comp-002',
      name: '45 Victoria Ave - Smoke Alarms',
    },
    receivedAt: daysAgo(3),
    readAt: daysAgo(2),
  },
  {
    id: 'msg-007',
    type: 'team',
    subject: 'Property Viewing Scheduled - Tomorrow 2pm',
    content:
      "Just a heads up - I've scheduled a viewing for the vacant unit at Victoria Ave tomorrow at 2pm. The prospective tenant seems very interested. Could you make sure the property is presentable?",
    preview: "Just a heads up - I've scheduled a viewing for the vacant unit...",
    sender: {
      id: 'user-002',
      name: 'Emma Thompson',
      type: 'team',
    },
    status: 'unread',
    requiresAction: false,
    relatedEntity: {
      type: 'property',
      id: 'prop-002',
      name: '45 Victoria Ave',
    },
    receivedAt: daysAgo(0),
  },
]

// Export all mock data
export const mockWorkbenchData = {
  tasks: mockTasks,
  reminders: mockReminders,
  messages: mockMessages,
}
