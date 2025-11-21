import type { Tenancy, RentPayment } from '@/types'

export const mockTenancies: Tenancy[] = [
  {
    id: 'tenancy-001',
    propertyId: 'prop-001',
    tenantIds: ['tenant-001'],
    startDate: '2021-01-15',
    endDate: '2025-01-14',
    weeklyRent: 650,
    bondAmount: 2600,
    paymentFrequency: 'weekly',
    status: 'expiring-soon',
    autoRenew: false,
    renewalNotice: 90,
    documents: [],
  },
  {
    id: 'tenancy-002',
    propertyId: 'prop-002',
    tenantIds: ['tenant-002'],
    startDate: '2022-03-01',
    endDate: '2026-02-28',
    weeklyRent: 720,
    bondAmount: 2880,
    paymentFrequency: 'weekly',
    status: 'active',
    autoRenew: true,
    renewalNotice: 60,
    documents: [],
  },
  {
    id: 'tenancy-003',
    propertyId: 'prop-004',
    tenantIds: ['tenant-003'],
    startDate: '2022-12-01',
    endDate: '2024-11-30',
    weeklyRent: 850,
    bondAmount: 3400,
    paymentFrequency: 'weekly',
    status: 'expired',
    autoRenew: false,
    renewalNotice: 90,
    documents: [],
  },
  {
    id: 'tenancy-004',
    propertyId: 'prop-005',
    tenantIds: ['tenant-004'],
    startDate: '2023-01-15',
    endDate: '2025-01-14',
    weeklyRent: 520,
    bondAmount: 2080,
    paymentFrequency: 'weekly',
    status: 'expiring-soon',
    autoRenew: false,
    renewalNotice: 60,
    documents: [],
  },
  {
    id: 'tenancy-005',
    propertyId: 'prop-006',
    tenantIds: ['tenant-005'],
    startDate: '2022-06-01',
    endDate: '2026-05-31',
    weeklyRent: 780,
    bondAmount: 3120,
    paymentFrequency: 'weekly',
    status: 'active',
    autoRenew: true,
    renewalNotice: 90,
    documents: [],
  },
  {
    id: 'tenancy-006',
    propertyId: 'prop-007',
    tenantIds: ['tenant-006'],
    startDate: '2023-04-01',
    endDate: '2025-03-31',
    weeklyRent: 480,
    bondAmount: 1920,
    paymentFrequency: 'weekly',
    status: 'active',
    autoRenew: false,
    renewalNotice: 60,
    documents: [],
  },
  {
    id: 'tenancy-007',
    propertyId: 'prop-007',
    tenantIds: ['tenant-007'],
    startDate: '2023-08-01',
    endDate: '2025-07-31',
    weeklyRent: 480,
    bondAmount: 1920,
    paymentFrequency: 'weekly',
    status: 'active',
    autoRenew: false,
    renewalNotice: 60,
    documents: [],
  },
  {
    id: 'tenancy-008',
    propertyId: 'prop-008',
    tenantIds: ['tenant-008'],
    startDate: '2019-10-01',
    endDate: '2025-09-30',
    weeklyRent: 1200,
    bondAmount: 4800,
    paymentFrequency: 'weekly',
    status: 'active',
    autoRenew: true,
    renewalNotice: 90,
    documents: [],
  },
]

// Generate rent payments for the past 6 months
export const mockRentPayments: RentPayment[] = []

const generateRentPayments = () => {
  const payments: RentPayment[] = []
  const now = new Date()

  mockTenancies.forEach((tenancy) => {
    if (tenancy.status === 'terminated' || tenancy.status === 'expired') return

    // Generate payments for the last 6 months (26 weeks)
    for (let i = 0; i < 26; i++) {
      const dueDate = new Date(now)
      dueDate.setDate(dueDate.getDate() - (i * 7))

      const paymentId = `payment-${tenancy.id}-${i}`
      const isOverdue = i === 0 && tenancy.tenantIds.includes('tenant-004')
      const isLate = Math.random() > 0.9 // 10% chance of late payment

      let paidDate: string | undefined
      let status: RentPayment['status']

      if (isOverdue) {
        status = 'overdue'
        paidDate = undefined
      } else if (isLate) {
        const lateDays = Math.floor(Math.random() * 5) + 1
        paidDate = new Date(dueDate.getTime() + lateDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        status = 'paid'
      } else {
        paidDate = dueDate.toISOString().split('T')[0]
        status = 'paid'
      }

      payments.push({
        id: paymentId,
        tenancyId: tenancy.id,
        dueDate: dueDate.toISOString().split('T')[0],
        paidDate,
        amount: tenancy.weeklyRent,
        status,
        method: status === 'paid' ? 'bank-transfer' : undefined,
        reference: status === 'paid' ? `RENT-${tenancy.id}-${i}` : undefined,
      })
    }
  })

  return payments
}

mockRentPayments.push(...generateRentPayments())

export const getTenancyById = (id: string): Tenancy | undefined => {
  return mockTenancies.find((t) => t.id === id)
}

export const getTenanciesByProperty = (propertyId: string): Tenancy[] => {
  return mockTenancies.filter((t) => t.propertyId === propertyId)
}

export const getRentPaymentsByTenancy = (tenancyId: string): RentPayment[] => {
  return mockRentPayments.filter((p) => p.tenancyId === tenancyId)
}

export const getOverduePayments = (): RentPayment[] => {
  return mockRentPayments.filter((p) => p.status === 'overdue')
}
