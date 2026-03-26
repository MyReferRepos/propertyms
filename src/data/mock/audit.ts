/**
 * Audit Mock Data
 * 审计模块Mock数据
 */

// ============ Types ============

export interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: 'create' | 'update' | 'delete' | 'view' | 'export'
  entityType: 'property' | 'tenancy' | 'tenant' | 'payment' | 'document' | 'user'
  entityId: string
  entityName: string
  changes?: { field: string; oldValue: string; newValue: string }[]
  ipAddress: string
  userAgent: string
}

export interface ComplianceItem {
  id: string
  name: string
  category: string
  status: 'passed' | 'warning' | 'failed'
  description: string
  lastChecked: string
}

export interface ComplianceReport {
  id: string
  type: 'monthly' | 'quarterly' | 'annual'
  period: string
  status: 'passed' | 'warning' | 'failed'
  score: number
  items: ComplianceItem[]
  generatedAt: string
  generatedBy: string
}

export interface ChangeRecord {
  id: string
  entityType: 'property' | 'tenancy' | 'tenant' | 'payment' | 'document' | 'user'
  entityId: string
  entityName: string
  changeType: 'field_update' | 'status_change' | 'ownership_transfer'
  field: string
  oldValue: string
  newValue: string
  changedBy: string
  changedAt: string
  reason?: string
}

export interface FinancialAuditRecord {
  id: string
  transactionId: string
  transactionDate: string
  amount: number
  type: 'income' | 'expense'
  category: string
  description: string
  propertyId: string
  propertyAddress: string
  status: 'verified' | 'pending' | 'flagged'
  verifiedBy?: string
  verifiedAt?: string
  notes?: string
}

// ============ Mock Data ============

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2024-12-14T10:30:00Z',
    userId: 'user-001',
    userName: 'John Smith',
    action: 'create',
    entityType: 'property',
    entityId: 'prop-089',
    entityName: 'Property #P-2024-089',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
  },
  {
    id: 'log-002',
    timestamp: '2024-12-14T09:15:00Z',
    userId: 'user-002',
    userName: 'Sarah Johnson',
    action: 'update',
    entityType: 'tenancy',
    entityId: 'ten-156',
    entityName: 'Tenancy #T-2024-156',
    changes: [
      { field: 'rent_amount', oldValue: '$2,400', newValue: '$2,500' },
      { field: 'end_date', oldValue: '2024-12-31', newValue: '2025-06-30' },
    ],
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari/17.0',
  },
  {
    id: 'log-003',
    timestamp: '2024-12-14T08:45:00Z',
    userId: 'user-003',
    userName: 'Mike Wilson',
    action: 'create',
    entityType: 'payment',
    entityId: 'pay-4521',
    entityName: 'Payment #PAY-2024-4521',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0) Edge/120.0',
  },
  {
    id: 'log-004',
    timestamp: '2024-12-13T16:20:00Z',
    userId: 'user-004',
    userName: 'Emma Brown',
    action: 'delete',
    entityType: 'document',
    entityId: 'doc-782',
    entityName: 'Document #DOC-2024-782',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS) Safari/17.0',
  },
  {
    id: 'log-005',
    timestamp: '2024-12-13T14:30:00Z',
    userId: 'user-001',
    userName: 'John Smith',
    action: 'view',
    entityType: 'tenant',
    entityId: 'tenant-045',
    entityName: 'Tenant: Michael Chen',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
  },
  {
    id: 'log-006',
    timestamp: '2024-12-13T11:45:00Z',
    userId: 'user-002',
    userName: 'Sarah Johnson',
    action: 'export',
    entityType: 'property',
    entityId: 'prop-all',
    entityName: 'All Properties Report',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari/17.0',
  },
  {
    id: 'log-007',
    timestamp: '2024-12-13T09:00:00Z',
    userId: 'user-005',
    userName: 'David Lee',
    action: 'update',
    entityType: 'user',
    entityId: 'user-006',
    entityName: 'User: Alex Turner',
    changes: [
      { field: 'role', oldValue: 'Viewer', newValue: 'Editor' },
    ],
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0) Firefox/121.0',
  },
  {
    id: 'log-008',
    timestamp: '2024-12-12T15:30:00Z',
    userId: 'user-003',
    userName: 'Mike Wilson',
    action: 'create',
    entityType: 'tenancy',
    entityId: 'ten-157',
    entityName: 'Tenancy #T-2024-157',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0) Edge/120.0',
  },
  {
    id: 'log-009',
    timestamp: '2024-12-12T13:15:00Z',
    userId: 'user-004',
    userName: 'Emma Brown',
    action: 'update',
    entityType: 'property',
    entityId: 'prop-045',
    entityName: 'Property #P-2024-045',
    changes: [
      { field: 'status', oldValue: 'Available', newValue: 'Under Maintenance' },
    ],
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS) Safari/17.0',
  },
  {
    id: 'log-010',
    timestamp: '2024-12-12T10:00:00Z',
    userId: 'user-001',
    userName: 'John Smith',
    action: 'delete',
    entityType: 'tenant',
    entityId: 'tenant-012',
    entityName: 'Tenant: Former Resident',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
  },
  {
    id: 'log-011',
    timestamp: '2024-12-11T16:45:00Z',
    userId: 'user-002',
    userName: 'Sarah Johnson',
    action: 'create',
    entityType: 'document',
    entityId: 'doc-783',
    entityName: 'Lease Agreement #LA-2024-783',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari/17.0',
  },
  {
    id: 'log-012',
    timestamp: '2024-12-11T14:20:00Z',
    userId: 'user-005',
    userName: 'David Lee',
    action: 'view',
    entityType: 'payment',
    entityId: 'pay-4520',
    entityName: 'Payment #PAY-2024-4520',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0) Firefox/121.0',
  },
]

export const mockComplianceReports: ComplianceReport[] = [
  {
    id: 'report-001',
    type: 'monthly',
    period: 'December 2024',
    status: 'passed',
    score: 98.5,
    generatedAt: '2024-12-01T00:00:00Z',
    generatedBy: 'System',
    items: [
      {
        id: 'item-001',
        name: 'Healthy Homes Standards',
        category: 'Property Compliance',
        status: 'passed',
        description: 'All properties meet healthy homes requirements',
        lastChecked: '2024-12-01T00:00:00Z',
      },
      {
        id: 'item-002',
        name: 'Smoke Alarms',
        category: 'Safety',
        status: 'passed',
        description: 'All smoke alarms are functional and compliant',
        lastChecked: '2024-12-01T00:00:00Z',
      },
      {
        id: 'item-003',
        name: 'Building WOF',
        category: 'Building',
        status: 'passed',
        description: 'Building warrant of fitness up to date',
        lastChecked: '2024-12-01T00:00:00Z',
      },
      {
        id: 'item-004',
        name: 'Insurance Coverage',
        category: 'Financial',
        status: 'passed',
        description: 'All properties have adequate insurance',
        lastChecked: '2024-12-01T00:00:00Z',
      },
      {
        id: 'item-005',
        name: 'Tenancy Documentation',
        category: 'Legal',
        status: 'warning',
        description: '2 tenancies have documents pending renewal',
        lastChecked: '2024-12-01T00:00:00Z',
      },
    ],
  },
  {
    id: 'report-002',
    type: 'monthly',
    period: 'November 2024',
    status: 'passed',
    score: 96.2,
    generatedAt: '2024-11-01T00:00:00Z',
    generatedBy: 'System',
    items: [
      {
        id: 'item-006',
        name: 'Healthy Homes Standards',
        category: 'Property Compliance',
        status: 'passed',
        description: 'All properties meet healthy homes requirements',
        lastChecked: '2024-11-01T00:00:00Z',
      },
      {
        id: 'item-007',
        name: 'Smoke Alarms',
        category: 'Safety',
        status: 'warning',
        description: '1 property needs smoke alarm battery replacement',
        lastChecked: '2024-11-01T00:00:00Z',
      },
      {
        id: 'item-008',
        name: 'Building WOF',
        category: 'Building',
        status: 'passed',
        description: 'Building warrant of fitness up to date',
        lastChecked: '2024-11-01T00:00:00Z',
      },
    ],
  },
  {
    id: 'report-003',
    type: 'quarterly',
    period: 'Q4 2024',
    status: 'passed',
    score: 97.8,
    generatedAt: '2024-10-01T00:00:00Z',
    generatedBy: 'System',
    items: [
      {
        id: 'item-009',
        name: 'Financial Audit',
        category: 'Financial',
        status: 'passed',
        description: 'All financial records are accurate and complete',
        lastChecked: '2024-10-01T00:00:00Z',
      },
      {
        id: 'item-010',
        name: 'Property Inspections',
        category: 'Property Compliance',
        status: 'passed',
        description: 'All quarterly inspections completed',
        lastChecked: '2024-10-01T00:00:00Z',
      },
    ],
  },
  {
    id: 'report-004',
    type: 'annual',
    period: '2023',
    status: 'passed',
    score: 95.5,
    generatedAt: '2024-01-15T00:00:00Z',
    generatedBy: 'External Auditor',
    items: [
      {
        id: 'item-011',
        name: 'Annual Financial Audit',
        category: 'Financial',
        status: 'passed',
        description: 'Annual financial statements verified',
        lastChecked: '2024-01-15T00:00:00Z',
      },
      {
        id: 'item-012',
        name: 'Regulatory Compliance',
        category: 'Legal',
        status: 'passed',
        description: 'All regulatory requirements met',
        lastChecked: '2024-01-15T00:00:00Z',
      },
    ],
  },
]

export const mockChangeRecords: ChangeRecord[] = [
  {
    id: 'change-001',
    entityType: 'property',
    entityId: 'prop-045',
    entityName: '123 Queen Street, Auckland CBD',
    changeType: 'status_change',
    field: 'status',
    oldValue: 'Available',
    newValue: 'Under Maintenance',
    changedBy: 'Emma Brown',
    changedAt: '2024-12-12T13:15:00Z',
    reason: 'Scheduled maintenance for heating system',
  },
  {
    id: 'change-002',
    entityType: 'tenancy',
    entityId: 'ten-156',
    entityName: 'Tenancy for 45 Victoria Ave',
    changeType: 'field_update',
    field: 'rent_amount',
    oldValue: '$2,400/month',
    newValue: '$2,500/month',
    changedBy: 'Sarah Johnson',
    changedAt: '2024-12-14T09:15:00Z',
    reason: 'Annual rent review',
  },
  {
    id: 'change-003',
    entityType: 'tenancy',
    entityId: 'ten-156',
    entityName: 'Tenancy for 45 Victoria Ave',
    changeType: 'field_update',
    field: 'end_date',
    oldValue: '2024-12-31',
    newValue: '2025-06-30',
    changedBy: 'Sarah Johnson',
    changedAt: '2024-12-14T09:15:00Z',
    reason: 'Lease extension',
  },
  {
    id: 'change-004',
    entityType: 'tenant',
    entityId: 'tenant-023',
    entityName: 'Michael Chen',
    changeType: 'field_update',
    field: 'email',
    oldValue: 'michael.old@email.com',
    newValue: 'michael.chen@newemail.com',
    changedBy: 'John Smith',
    changedAt: '2024-12-10T11:30:00Z',
  },
  {
    id: 'change-005',
    entityType: 'property',
    entityId: 'prop-089',
    entityName: '78 Symonds Street, Grafton',
    changeType: 'ownership_transfer',
    field: 'owner_id',
    oldValue: 'Owner: ABC Holdings Ltd',
    newValue: 'Owner: XYZ Investments Ltd',
    changedBy: 'David Lee',
    changedAt: '2024-12-08T14:00:00Z',
    reason: 'Property sale completed',
  },
  {
    id: 'change-006',
    entityType: 'user',
    entityId: 'user-006',
    entityName: 'Alex Turner',
    changeType: 'field_update',
    field: 'role',
    oldValue: 'Viewer',
    newValue: 'Editor',
    changedBy: 'David Lee',
    changedAt: '2024-12-13T09:00:00Z',
    reason: 'Role upgrade approved by manager',
  },
  {
    id: 'change-007',
    entityType: 'payment',
    entityId: 'pay-4519',
    entityName: 'Payment for 123 Queen Street',
    changeType: 'status_change',
    field: 'status',
    oldValue: 'Pending',
    newValue: 'Completed',
    changedBy: 'Mike Wilson',
    changedAt: '2024-12-11T16:00:00Z',
  },
  {
    id: 'change-008',
    entityType: 'document',
    entityId: 'doc-780',
    entityName: 'Lease Agreement - Unit 5B',
    changeType: 'field_update',
    field: 'version',
    oldValue: 'v1.0',
    newValue: 'v2.0',
    changedBy: 'Sarah Johnson',
    changedAt: '2024-12-09T10:45:00Z',
    reason: 'Updated terms and conditions',
  },
]

export const mockFinancialAuditRecords: FinancialAuditRecord[] = [
  {
    id: 'fa-001',
    transactionId: 'txn-2024-001',
    transactionDate: '2024-12-14T00:00:00Z',
    amount: 2800,
    type: 'income',
    category: 'Rent Payment',
    description: 'Monthly rent - 123 Queen Street',
    propertyId: 'prop-001',
    propertyAddress: '123 Queen Street, Auckland CBD',
    status: 'verified',
    verifiedBy: 'Mike Wilson',
    verifiedAt: '2024-12-14T10:00:00Z',
  },
  {
    id: 'fa-002',
    transactionId: 'txn-2024-002',
    transactionDate: '2024-12-13T00:00:00Z',
    amount: 450,
    type: 'expense',
    category: 'Maintenance',
    description: 'Plumbing repair - 45 Victoria Ave',
    propertyId: 'prop-002',
    propertyAddress: '45 Victoria Ave, Remuera',
    status: 'verified',
    verifiedBy: 'Sarah Johnson',
    verifiedAt: '2024-12-13T15:30:00Z',
  },
  {
    id: 'fa-003',
    transactionId: 'txn-2024-003',
    transactionDate: '2024-12-12T00:00:00Z',
    amount: 3200,
    type: 'income',
    category: 'Rent Payment',
    description: 'Monthly rent - 78 Symonds Street',
    propertyId: 'prop-003',
    propertyAddress: '78 Symonds Street, Grafton',
    status: 'pending',
  },
  {
    id: 'fa-004',
    transactionId: 'txn-2024-004',
    transactionDate: '2024-12-11T00:00:00Z',
    amount: 1200,
    type: 'expense',
    category: 'Insurance',
    description: 'Annual insurance premium - Multi-property',
    propertyId: 'prop-all',
    propertyAddress: 'All Properties',
    status: 'verified',
    verifiedBy: 'David Lee',
    verifiedAt: '2024-12-11T14:00:00Z',
  },
  {
    id: 'fa-005',
    transactionId: 'txn-2024-005',
    transactionDate: '2024-12-10T00:00:00Z',
    amount: 2500,
    type: 'income',
    category: 'Rent Payment',
    description: 'Monthly rent - 12 Ponsonby Road',
    propertyId: 'prop-004',
    propertyAddress: '12 Ponsonby Road, Ponsonby',
    status: 'flagged',
    notes: 'Payment amount differs from lease agreement. Needs verification.',
  },
  {
    id: 'fa-006',
    transactionId: 'txn-2024-006',
    transactionDate: '2024-12-09T00:00:00Z',
    amount: 180,
    type: 'expense',
    category: 'Utilities',
    description: 'Water bill - 123 Queen Street',
    propertyId: 'prop-001',
    propertyAddress: '123 Queen Street, Auckland CBD',
    status: 'pending',
  },
  {
    id: 'fa-007',
    transactionId: 'txn-2024-007',
    transactionDate: '2024-12-08T00:00:00Z',
    amount: 2800,
    type: 'income',
    category: 'Rent Payment',
    description: 'Monthly rent - 56 Parnell Rise',
    propertyId: 'prop-005',
    propertyAddress: '56 Parnell Rise, Parnell',
    status: 'verified',
    verifiedBy: 'Mike Wilson',
    verifiedAt: '2024-12-08T11:00:00Z',
  },
  {
    id: 'fa-008',
    transactionId: 'txn-2024-008',
    transactionDate: '2024-12-07T00:00:00Z',
    amount: 850,
    type: 'expense',
    category: 'Maintenance',
    description: 'Electrical work - 45 Victoria Ave',
    propertyId: 'prop-002',
    propertyAddress: '45 Victoria Ave, Remuera',
    status: 'flagged',
    notes: 'Invoice missing. Awaiting documentation from contractor.',
  },
  {
    id: 'fa-009',
    transactionId: 'txn-2024-009',
    transactionDate: '2024-12-06T00:00:00Z',
    amount: 3500,
    type: 'income',
    category: 'Bond',
    description: 'Bond received - New tenant 78 Symonds Street',
    propertyId: 'prop-003',
    propertyAddress: '78 Symonds Street, Grafton',
    status: 'verified',
    verifiedBy: 'Sarah Johnson',
    verifiedAt: '2024-12-06T16:00:00Z',
  },
  {
    id: 'fa-010',
    transactionId: 'txn-2024-010',
    transactionDate: '2024-12-05T00:00:00Z',
    amount: 320,
    type: 'expense',
    category: 'Cleaning',
    description: 'End of tenancy cleaning - 12 Ponsonby Road',
    propertyId: 'prop-004',
    propertyAddress: '12 Ponsonby Road, Ponsonby',
    status: 'pending',
  },
]

// ============ Statistics ============

export const auditStatistics = {
  totalLogs: 12458,
  createActions: 4521,
  updateActions: 6892,
  deleteActions: 1045,
  complianceScore: 98.5,
  lastAuditDate: '2024-12-14T10:30:00Z',
}

export const financialAuditStatistics = {
  totalTransactions: 156,
  verifiedCount: 128,
  pendingCount: 18,
  flaggedCount: 10,
  totalIncome: 245600,
  totalExpense: 42350,
  netAmount: 203250,
}
