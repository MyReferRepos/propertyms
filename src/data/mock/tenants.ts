import type { Tenant } from '@/types'

export const mockTenants: Tenant[] = [
  {
    id: 'tenant-001',
    name: 'Emily Parker',
    email: 'emily.parker@email.com',
    phone: '+64 21 111 2222',
    emergencyContact: {
      name: 'John Parker',
      phone: '+64 21 111 3333',
      relationship: 'Father',
    },
    creditScore: 92,
    paymentHistory: {
      onTimePayments: 48,
      latePayments: 0,
      totalPayments: 48,
    },
    moveInDate: '2021-01-15',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
  },
  {
    id: 'tenant-002',
    name: 'Alex Kumar',
    email: 'alex.kumar@email.com',
    phone: '+64 21 222 3333',
    emergencyContact: {
      name: 'Priya Kumar',
      phone: '+64 21 222 4444',
      relationship: 'Mother',
    },
    creditScore: 88,
    paymentHistory: {
      onTimePayments: 35,
      latePayments: 1,
      totalPayments: 36,
    },
    moveInDate: '2022-03-01',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  {
    id: 'tenant-003',
    name: 'Sophie Taylor',
    email: 'sophie.taylor@email.com',
    phone: '+64 21 333 4444',
    emergencyContact: {
      name: 'Mark Taylor',
      phone: '+64 21 333 5555',
      relationship: 'Husband',
    },
    creditScore: 95,
    paymentHistory: {
      onTimePayments: 24,
      latePayments: 0,
      totalPayments: 24,
    },
    moveInDate: '2022-12-01',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
  },
  {
    id: 'tenant-004',
    name: 'Ryan Martinez',
    email: 'ryan.martinez@email.com',
    phone: '+64 21 444 5555',
    emergencyContact: {
      name: 'Carlos Martinez',
      phone: '+64 21 444 6666',
      relationship: 'Brother',
    },
    creditScore: 78,
    paymentHistory: {
      onTimePayments: 18,
      latePayments: 6,
      totalPayments: 24,
    },
    moveInDate: '2023-01-15',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan',
  },
  {
    id: 'tenant-005',
    name: 'Jessica Lee',
    email: 'jessica.lee@email.com',
    phone: '+64 21 555 6666',
    emergencyContact: {
      name: 'Amy Lee',
      phone: '+64 21 555 7777',
      relationship: 'Sister',
    },
    creditScore: 90,
    paymentHistory: {
      onTimePayments: 30,
      latePayments: 2,
      totalPayments: 32,
    },
    moveInDate: '2022-06-01',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
  },
  {
    id: 'tenant-006',
    name: 'Daniel O\'Connor',
    email: 'daniel.oconnor@email.com',
    phone: '+64 21 666 7777',
    emergencyContact: {
      name: 'Patrick O\'Connor',
      phone: '+64 21 666 8888',
      relationship: 'Father',
    },
    creditScore: 85,
    paymentHistory: {
      onTimePayments: 20,
      latePayments: 1,
      totalPayments: 21,
    },
    moveInDate: '2023-04-01',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel',
  },
  {
    id: 'tenant-007',
    name: 'Olivia Smith',
    email: 'olivia.smith@email.com',
    phone: '+64 21 777 8888',
    emergencyContact: {
      name: 'Emma Smith',
      phone: '+64 21 777 9999',
      relationship: 'Mother',
    },
    creditScore: 93,
    paymentHistory: {
      onTimePayments: 16,
      latePayments: 0,
      totalPayments: 16,
    },
    moveInDate: '2023-08-01',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
  },
  {
    id: 'tenant-008',
    name: 'Thomas Wang',
    email: 'thomas.wang@email.com',
    phone: '+64 21 888 9999',
    emergencyContact: {
      name: 'Lisa Wang',
      phone: '+64 21 888 0000',
      relationship: 'Wife',
    },
    creditScore: 96,
    paymentHistory: {
      onTimePayments: 60,
      latePayments: 0,
      totalPayments: 60,
    },
    moveInDate: '2019-10-01',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
  },
]

export const getTenantById = (id: string): Tenant | undefined => {
  return mockTenants.find((t) => t.id === id)
}
