import type { MaintenanceRequest, Contractor } from '@/types'

export const mockContractors: Contractor[] = [
  {
    id: 'contractor-001',
    name: 'John Smith',
    company: 'Smith Plumbing Ltd',
    phone: '+64 21 100 1001',
    email: 'john@smithplumbing.co.nz',
    specialties: ['Plumbing', 'Heating'],
    rating: 4.8,
    completedJobs: 145,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnSmith',
  },
  {
    id: 'contractor-002',
    name: 'Sarah Johnson',
    company: 'Elite Electricians',
    phone: '+64 21 200 2002',
    email: 'sarah@eliteelectricians.co.nz',
    specialties: ['Electrical', 'Lighting'],
    rating: 4.9,
    completedJobs: 230,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJohnson',
  },
  {
    id: 'contractor-003',
    name: 'Mike Brown',
    company: 'Brown Builders',
    phone: '+64 21 300 3003',
    email: 'mike@brownbuilders.co.nz',
    specialties: ['Carpentry', 'General Repairs', 'Painting'],
    rating: 4.7,
    completedJobs: 189,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MikeBrown',
  },
  {
    id: 'contractor-004',
    name: 'Lisa Chen',
    company: 'Clean & Fresh',
    phone: '+64 21 400 4004',
    email: 'lisa@cleanfresh.co.nz',
    specialties: ['Cleaning', 'Carpet Cleaning'],
    rating: 4.6,
    completedJobs: 320,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LisaChen',
  },
]

export const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'maint-001',
    propertyId: 'prop-001',
    tenancyId: 'tenancy-001',
    title: 'Leaking Kitchen Tap',
    description: 'The kitchen tap has been dripping continuously for the past 3 days',
    category: 'Plumbing',
    priority: 'medium',
    status: 'completed',
    reportedDate: '2024-10-15',
    scheduledDate: '2024-10-17',
    completedDate: '2024-10-17',
    estimatedCost: 150,
    actualCost: 145,
    contractorId: 'contractor-001',
    images: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400'],
    notes: ['Fixed tap washer', 'All working well now'],
  },
  {
    id: 'maint-002',
    propertyId: 'prop-002',
    tenancyId: 'tenancy-002',
    title: 'Broken Fence Panel',
    description: 'Back fence panel damaged during recent storm',
    category: 'Exterior',
    priority: 'high',
    status: 'in-progress',
    reportedDate: '2024-11-10',
    scheduledDate: '2024-11-18',
    estimatedCost: 450,
    contractorId: 'contractor-003',
    images: ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400'],
    notes: ['Materials ordered', 'Work scheduled for Monday'],
  },
  {
    id: 'maint-003',
    propertyId: 'prop-004',
    title: 'Heat Pump Not Working',
    description: 'Heat pump making loud noise and not heating properly',
    category: 'HVAC',
    priority: 'urgent',
    status: 'pending',
    reportedDate: '2024-11-20',
    estimatedCost: 300,
    images: [],
    notes: [],
  },
  {
    id: 'maint-004',
    propertyId: 'prop-001',
    tenancyId: 'tenancy-001',
    title: 'Blocked Bathroom Drain',
    description: 'Bathroom sink draining very slowly',
    category: 'Plumbing',
    priority: 'medium',
    status: 'completed',
    reportedDate: '2024-09-05',
    scheduledDate: '2024-09-07',
    completedDate: '2024-09-07',
    estimatedCost: 120,
    actualCost: 95,
    contractorId: 'contractor-001',
    images: [],
    notes: ['Cleared blockage', 'Advised tenant to use drain cleaner monthly'],
  },
  {
    id: 'maint-005',
    propertyId: 'prop-006',
    tenancyId: 'tenancy-005',
    title: 'Light Fixture Replacement',
    description: 'Dining room light fixture not working',
    category: 'Electrical',
    priority: 'low',
    status: 'completed',
    reportedDate: '2024-10-20',
    scheduledDate: '2024-10-23',
    completedDate: '2024-10-23',
    estimatedCost: 200,
    actualCost: 180,
    contractorId: 'contractor-002',
    images: [],
    notes: ['Replaced fixture', 'Tested all circuits'],
  },
  {
    id: 'maint-006',
    propertyId: 'prop-008',
    tenancyId: 'tenancy-008',
    title: 'Pool Pump Maintenance',
    description: 'Annual pool pump service and filter clean',
    category: 'Pool',
    priority: 'low',
    status: 'pending',
    reportedDate: '2024-11-15',
    scheduledDate: '2024-11-25',
    estimatedCost: 350,
    images: [],
    notes: ['Annual service due'],
  },
  {
    id: 'maint-007',
    propertyId: 'prop-002',
    tenancyId: 'tenancy-002',
    title: 'Gutter Cleaning',
    description: 'Gutters blocked with leaves causing overflow',
    category: 'Exterior',
    priority: 'medium',
    status: 'in-progress',
    reportedDate: '2024-11-12',
    scheduledDate: '2024-11-20',
    estimatedCost: 180,
    contractorId: 'contractor-003',
    images: ['https://images.unsplash.com/photo-1581578017093-cd30e5c82f73?w=400'],
    notes: ['Scheduled for next week'],
  },
]

export const getMaintenanceRequestById = (id: string): MaintenanceRequest | undefined => {
  return mockMaintenanceRequests.find((m) => m.id === id)
}

export const getMaintenanceByProperty = (propertyId: string): MaintenanceRequest[] => {
  return mockMaintenanceRequests.filter((m) => m.propertyId === propertyId)
}

export const getMaintenanceByStatus = (status: MaintenanceRequest['status']): MaintenanceRequest[] => {
  return mockMaintenanceRequests.filter((m) => m.status === status)
}

export const getPendingMaintenance = (): MaintenanceRequest[] => {
  return mockMaintenanceRequests.filter((m) => m.status === 'pending')
}

export const getContractorById = (id: string): Contractor | undefined => {
  return mockContractors.find((c) => c.id === id)
}
