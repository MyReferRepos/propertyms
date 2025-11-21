/**
 * Mock Tenant Credit Scoring Data
 *
 * Credit scores and rental history for tenants to help property managers
 * make informed decisions about tenant applications.
 */

export interface TenantCreditScore {
  tenantId: string
  tenantName: string
  email: string
  creditScore: number // 300-850 scale (like NZ Centrix or Equifax)
  rating: 'excellent' | 'good' | 'fair' | 'poor'
  paymentHistory: {
    totalPayments: number
    onTimePayments: number
    latePayments: number
    missedPayments: number
    onTimePercentage: number
  }
  rentalHistory: {
    yearsRenting: number
    previousProperties: number
    evictions: number
    breaches: number
  }
  financialMetrics: {
    monthlyIncome: number
    rentToIncomeRatio: number // Percentage
    employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'student'
    employmentDuration: string // e.g., "2 years 3 months"
  }
  references: {
    landlordReferences: number
    employmentReferences: number
  }
  redFlags: string[]
  positives: string[]
  lastUpdated: string
}

export const mockTenantCreditData: Record<string, TenantCreditScore> = {
  'tenant-001': {
    tenantId: 'tenant-001',
    tenantName: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    creditScore: 780,
    rating: 'excellent',
    paymentHistory: {
      totalPayments: 48,
      onTimePayments: 48,
      latePayments: 0,
      missedPayments: 0,
      onTimePercentage: 100,
    },
    rentalHistory: {
      yearsRenting: 4,
      previousProperties: 2,
      evictions: 0,
      breaches: 0,
    },
    financialMetrics: {
      monthlyIncome: 6500,
      rentToIncomeRatio: 25, // 1625/6500 = 25%
      employmentStatus: 'employed',
      employmentDuration: '3 years 2 months',
    },
    references: {
      landlordReferences: 2,
      employmentReferences: 1,
    },
    redFlags: [],
    positives: [
      'Perfect payment history',
      'Stable employment',
      'Excellent landlord references',
      'Low rent-to-income ratio',
    ],
    lastUpdated: '2024-11-15',
  },

  'tenant-002': {
    tenantId: 'tenant-002',
    tenantName: 'Michael Chen',
    email: 'michael.chen@example.com',
    creditScore: 720,
    rating: 'good',
    paymentHistory: {
      totalPayments: 36,
      onTimePayments: 34,
      latePayments: 2,
      missedPayments: 0,
      onTimePercentage: 94.4,
    },
    rentalHistory: {
      yearsRenting: 3,
      previousProperties: 1,
      evictions: 0,
      breaches: 0,
    },
    financialMetrics: {
      monthlyIncome: 5200,
      rentToIncomeRatio: 28.8, // 1500/5200 = 28.8%
      employmentStatus: 'employed',
      employmentDuration: '2 years 6 months',
    },
    references: {
      landlordReferences: 1,
      employmentReferences: 1,
    },
    redFlags: ['2 late payments in past 12 months'],
    positives: [
      'Good overall payment record',
      'Stable employment',
      'No missed payments',
    ],
    lastUpdated: '2024-11-14',
  },

  'tenant-003': {
    tenantId: 'tenant-003',
    tenantName: 'Emma Williams',
    email: 'emma.williams@example.com',
    creditScore: 650,
    rating: 'fair',
    paymentHistory: {
      totalPayments: 24,
      onTimePayments: 20,
      latePayments: 3,
      missedPayments: 1,
      onTimePercentage: 83.3,
    },
    rentalHistory: {
      yearsRenting: 2,
      previousProperties: 1,
      evictions: 0,
      breaches: 1,
    },
    financialMetrics: {
      monthlyIncome: 4200,
      rentToIncomeRatio: 35.7, // 1500/4200 = 35.7%
      employmentStatus: 'employed',
      employmentDuration: '1 year 3 months',
    },
    references: {
      landlordReferences: 1,
      employmentReferences: 1,
    },
    redFlags: [
      '1 missed payment',
      '3 late payments',
      '1 tenancy breach (noise complaint)',
      'High rent-to-income ratio (>30%)',
    ],
    positives: ['Currently employed', 'Improvement in recent payment pattern'],
    lastUpdated: '2024-11-13',
  },

  'tenant-004': {
    tenantId: 'tenant-004',
    tenantName: 'James Brown',
    email: 'james.brown@example.com',
    creditScore: 810,
    rating: 'excellent',
    paymentHistory: {
      totalPayments: 72,
      onTimePayments: 72,
      latePayments: 0,
      missedPayments: 0,
      onTimePercentage: 100,
    },
    rentalHistory: {
      yearsRenting: 6,
      previousProperties: 3,
      evictions: 0,
      breaches: 0,
    },
    financialMetrics: {
      monthlyIncome: 8500,
      rentToIncomeRatio: 21.2, // 1800/8500 = 21.2%
      employmentStatus: 'self-employed',
      employmentDuration: '5 years',
    },
    references: {
      landlordReferences: 3,
      employmentReferences: 2,
    },
    redFlags: [],
    positives: [
      'Excellent long-term payment history',
      'Multiple positive landlord references',
      'Very low rent-to-income ratio',
      'Long-term stable income',
    ],
    lastUpdated: '2024-11-16',
  },
}

export const getCreditScoreColor = (score: number): string => {
  if (score >= 750) return 'text-green-600'
  if (score >= 700) return 'text-blue-600'
  if (score >= 650) return 'text-amber-600'
  return 'text-red-600'
}

export const getCreditScoreBadgeColor = (rating: TenantCreditScore['rating']): string => {
  switch (rating) {
    case 'excellent':
      return 'bg-green-600'
    case 'good':
      return 'bg-blue-600'
    case 'fair':
      return 'bg-amber-600'
    case 'poor':
      return 'bg-red-600'
  }
}
