import type { Tenancy, RentPayment, APIResponse } from '@/types'
import {
  mockTenancies,
  mockRentPayments,
  getTenancyById,
  getTenanciesByProperty,
  getRentPaymentsByTenancy,
  getOverduePayments,
} from '@/data/mock'

const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const tenanciesAPI = {
  async getAll(): Promise<APIResponse<Tenancy[]>> {
    await delay()

    return {
      success: true,
      data: mockTenancies,
    }
  },

  async getById(id: string): Promise<APIResponse<Tenancy | null>> {
    await delay()

    const tenancy = getTenancyById(id)

    return {
      success: true,
      data: tenancy || null,
    }
  },

  async getByProperty(propertyId: string): Promise<APIResponse<Tenancy[]>> {
    await delay()

    const tenancies = getTenanciesByProperty(propertyId)

    return {
      success: true,
      data: tenancies,
    }
  },

  async getExpiringSoon(days: number = 90): Promise<APIResponse<Tenancy[]>> {
    await delay()

    const now = new Date()
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

    const expiring = mockTenancies.filter((t) => {
      if (t.status !== 'active' && t.status !== 'expiring-soon') return false
      const endDate = new Date(t.endDate)
      return endDate <= futureDate && endDate > now
    })

    return {
      success: true,
      data: expiring,
    }
  },

  async create(tenancy: Omit<Tenancy, 'id'>): Promise<APIResponse<Tenancy>> {
    await delay()

    const newTenancy: Tenancy = {
      ...tenancy,
      id: `tenancy-${Date.now()}`,
    }

    mockTenancies.push(newTenancy)

    return {
      success: true,
      data: newTenancy,
      message: 'Tenancy created successfully',
    }
  },

  async update(id: string, updates: Partial<Tenancy>): Promise<APIResponse<Tenancy>> {
    await delay()

    const index = mockTenancies.findIndex((t) => t.id === id)

    if (index === -1) {
      throw new Error('Tenancy not found')
    }

    mockTenancies[index] = {
      ...mockTenancies[index],
      ...updates,
    }

    return {
      success: true,
      data: mockTenancies[index],
      message: 'Tenancy updated successfully',
    }
  },
}

export const rentPaymentsAPI = {
  async getAll(): Promise<APIResponse<RentPayment[]>> {
    await delay()

    return {
      success: true,
      data: mockRentPayments,
    }
  },

  async getByTenancy(tenancyId: string): Promise<APIResponse<RentPayment[]>> {
    await delay()

    const payments = getRentPaymentsByTenancy(tenancyId)

    return {
      success: true,
      data: payments,
    }
  },

  async getOverdue(): Promise<APIResponse<RentPayment[]>> {
    await delay()

    const overdue = getOverduePayments()

    return {
      success: true,
      data: overdue,
    }
  },

  async recordPayment(paymentId: string, paidDate: string): Promise<APIResponse<RentPayment>> {
    await delay()

    const payment = mockRentPayments.find((p) => p.id === paymentId)

    if (!payment) {
      throw new Error('Payment not found')
    }

    payment.paidDate = paidDate
    payment.status = 'paid'
    payment.method = 'bank-transfer'

    return {
      success: true,
      data: payment,
      message: 'Payment recorded successfully',
    }
  },
}
