import type { AIInsight, DashboardStats, ComplianceItem } from '@/types'

export const mockAIInsights: AIInsight[] = [
  {
    id: 'insight-001',
    type: 'warning',
    title: 'Lease Expiring Soon',
    description: '15 Queen Street lease expires in 45 days. Contact tenant now to discuss renewal.',
    priority: 'high',
    actionable: true,
    action: {
      label: 'Send Renewal Email',
      handler: () => console.log('Sending renewal email...'),
    },
    createdAt: '2024-11-20T09:00:00Z',
    relatedEntityId: 'tenancy-001',
    relatedEntityType: 'tenancy',
  },
  {
    id: 'insight-002',
    type: 'warning',
    title: 'Overdue Rent Payment',
    description: '23 The Terrace has 1 overdue payment ($520). Tenant usually pays on time.',
    priority: 'high',
    actionable: true,
    action: {
      label: 'Send Payment Reminder',
      handler: () => console.log('Sending payment reminder...'),
    },
    createdAt: '2024-11-19T14:30:00Z',
    relatedEntityId: 'prop-005',
    relatedEntityType: 'property',
  },
  {
    id: 'insight-003',
    type: 'task',
    title: 'Inspection Due',
    description: '156 Dominion Road requires 90-day routine inspection within 10 days.',
    priority: 'medium',
    actionable: true,
    action: {
      label: 'Schedule Inspection',
      handler: () => console.log('Scheduling inspection...'),
    },
    createdAt: '2024-11-18T10:00:00Z',
    relatedEntityId: 'prop-004',
    relatedEntityType: 'property',
  },
  {
    id: 'insight-004',
    type: 'opportunity',
    title: 'Rent Below Market',
    description: '42 Karori Road rent ($720/week) is 8% below market average ($780/week). Consider increase at renewal.',
    priority: 'low',
    actionable: false,
    createdAt: '2024-11-17T11:00:00Z',
    relatedEntityId: 'prop-002',
    relatedEntityType: 'property',
  },
  {
    id: 'insight-005',
    type: 'recommendation',
    title: 'Heat Pump Installation ROI',
    description: 'Installing a heat pump at 88 Riccarton Ave could increase rent by $50/week. Est. ROI: 18 months.',
    priority: 'medium',
    actionable: true,
    action: {
      label: 'Get Quotes',
      handler: () => console.log('Getting contractor quotes...'),
    },
    createdAt: '2024-11-16T13:00:00Z',
    relatedEntityId: 'prop-003',
    relatedEntityType: 'property',
  },
  {
    id: 'insight-006',
    type: 'warning',
    title: 'High Maintenance Costs',
    description: '156 Dominion Road has spent $4,200 on maintenance in 6 months - 40% above average.',
    priority: 'medium',
    actionable: false,
    createdAt: '2024-11-15T09:30:00Z',
    relatedEntityId: 'prop-004',
    relatedEntityType: 'property',
  },
  {
    id: 'insight-007',
    type: 'task',
    title: 'Compliance Check Needed',
    description: '42 Karori Road smoke alarm certificates expire in 30 days. Schedule inspection.',
    priority: 'high',
    actionable: true,
    action: {
      label: 'Schedule Compliance Check',
      handler: () => console.log('Scheduling compliance check...'),
    },
    createdAt: '2024-11-14T10:00:00Z',
    relatedEntityId: 'prop-002',
    relatedEntityType: 'property',
  },
]

export const mockComplianceItems: ComplianceItem[] = [
  {
    id: 'comp-001',
    propertyId: 'prop-001',
    requirement: 'Ceiling Insulation',
    category: 'insulation',
    status: 'compliant',
    lastChecked: '2024-09-15',
    nextCheckDue: '2025-09-15',
    notes: 'R2.9 ceiling insulation installed',
    evidence: ['https://example.com/cert-ceiling-001.pdf'],
  },
  {
    id: 'comp-002',
    propertyId: 'prop-001',
    requirement: 'Underfloor Insulation',
    category: 'insulation',
    status: 'compliant',
    lastChecked: '2024-09-15',
    nextCheckDue: '2025-09-15',
    notes: 'R1.5 underfloor insulation installed',
    evidence: ['https://example.com/cert-underfloor-001.pdf'],
  },
  {
    id: 'comp-003',
    propertyId: 'prop-001',
    requirement: 'Fixed Heating',
    category: 'heating',
    status: 'compliant',
    lastChecked: '2024-09-15',
    nextCheckDue: '2025-09-15',
    notes: 'Heat pump installed in living area',
    evidence: [],
  },
  {
    id: 'comp-004',
    propertyId: 'prop-001',
    requirement: 'Ventilation',
    category: 'ventilation',
    status: 'compliant',
    lastChecked: '2024-09-15',
    nextCheckDue: '2025-09-15',
    notes: 'Opening windows in all habitable rooms',
    evidence: [],
  },
  {
    id: 'comp-005',
    propertyId: 'prop-001',
    requirement: 'Drainage',
    category: 'drainage',
    status: 'compliant',
    lastChecked: '2024-09-15',
    nextCheckDue: '2025-09-15',
    notes: 'Stormwater drainage functioning',
    evidence: [],
  },
  {
    id: 'comp-006',
    propertyId: 'prop-001',
    requirement: 'Smoke Alarms',
    category: 'smoke-alarms',
    status: 'compliant',
    lastChecked: '2024-09-15',
    nextCheckDue: '2025-09-15',
    notes: 'Long-life photoelectric alarms installed',
    evidence: [],
  },
  {
    id: 'comp-007',
    propertyId: 'prop-002',
    requirement: 'Smoke Alarms',
    category: 'smoke-alarms',
    status: 'pending',
    nextCheckDue: '2024-12-20',
    notes: 'Certificates need renewal',
    evidence: [],
  },
]

export const mockDashboardStats: DashboardStats = {
  totalProperties: 8,
  occupiedProperties: 6,
  vacantProperties: 1,
  maintenanceProperties: 1,
  occupancyRate: 87.5,
  totalMonthlyRent: 24960, // Sum of all weekly rents * 4.33
  overdueRent: 520,
  maintenanceRequests: {
    pending: 2,
    inProgress: 2,
    completed: 3,
  },
  upcomingInspections: 2,
  expiringLeases: 2,
}

export const getAIInsightsByPriority = (priority: AIInsight['priority']): AIInsight[] => {
  return mockAIInsights.filter((i) => i.priority === priority)
}

export const getActionableInsights = (): AIInsight[] => {
  return mockAIInsights.filter((i) => i.actionable)
}

export const getComplianceByProperty = (propertyId: string): ComplianceItem[] => {
  return mockComplianceItems.filter((c) => c.propertyId === propertyId)
}

export const getNonCompliantItems = (): ComplianceItem[] => {
  return mockComplianceItems.filter((c) => c.status === 'non-compliant' || c.status === 'pending')
}
