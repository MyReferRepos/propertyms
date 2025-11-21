import type { Owner } from '@/types'

export const mockOwners: Owner[] = [
  {
    id: 'owner-001',
    name: 'James Anderson',
    email: 'james.anderson@email.com',
    phone: '+64 21 123 4567',
    properties: ['prop-001', 'prop-004'],
    totalInvestment: 2100000,
    totalAnnualReturn: 156000,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
  },
  {
    id: 'owner-002',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '+64 21 234 5678',
    properties: ['prop-002', 'prop-006'],
    totalInvestment: 1830000,
    totalAnnualReturn: 140000,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: 'owner-003',
    name: 'Michael Thompson',
    email: 'michael.thompson@email.com',
    phone: '+64 21 345 6789',
    properties: ['prop-003', 'prop-007'],
    totalInvestment: 1160000,
    totalAnnualReturn: 92000,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
  },
  {
    id: 'owner-004',
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    phone: '+64 21 456 7890',
    properties: ['prop-005'],
    totalInvestment: 520000,
    totalAnnualReturn: 41000,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
  },
  {
    id: 'owner-005',
    name: 'David Brown',
    email: 'david.brown@email.com',
    phone: '+64 21 567 8901',
    properties: ['prop-008'],
    totalInvestment: 2100000,
    totalAnnualReturn: 125000,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
  },
]

export const getOwnerById = (id: string): Owner | undefined => {
  return mockOwners.find((o) => o.id === id)
}
