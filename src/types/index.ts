// Core Types for PropertyMS

export type PropertyType = 'house' | 'apartment' | 'townhouse' | 'unit'
export type PropertyStatus = 'occupied' | 'vacant' | 'maintenance'
export type TenancyStatus = 'active' | 'expiring-soon' | 'expired' | 'terminated'
export type MaintenanceStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled'
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent'
export type PaymentStatus = 'paid' | 'overdue' | 'pending'

// Property
export interface Property {
  id: string
  address: string
  suburb: string
  city: string
  postcode: string
  type: PropertyType
  bedrooms: number
  bathrooms: number
  parkingSpaces: number
  floorArea: number // sqm
  landArea?: number // sqm
  yearBuilt?: number
  status: PropertyStatus
  currentRent?: number // weekly
  estimatedValue: number
  imageUrl: string
  images: string[]
  ownerId: string
  managerId: string
  features: string[]
  // Compliance
  hasInsulation: boolean
  hasHeating: boolean
  hasSmokeAlarms: boolean
  lastInspectionDate?: string
  nextInspectionDue?: string
  complianceScore: number // 0-100
}

// Owner
export interface Owner {
  id: string
  name: string
  email: string
  phone: string
  properties: string[] // property IDs
  totalInvestment: number
  totalAnnualReturn: number
  avatarUrl?: string
}

// Tenant
export interface Tenant {
  id: string
  name: string
  email: string
  phone: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  creditScore: number // 0-100
  paymentHistory: {
    onTimePayments: number
    latePayments: number
    totalPayments: number
  }
  moveInDate?: string
  avatarUrl?: string
}

// Tenancy (Lease)
export interface Tenancy {
  id: string
  propertyId: string
  tenantIds: string[]
  startDate: string
  endDate: string
  weeklyRent: number
  bondAmount: number
  paymentFrequency: 'weekly' | 'fortnightly' | 'monthly'
  status: TenancyStatus
  autoRenew: boolean
  renewalNotice: number // days
  documents: Document[]
}

// Rent Payment
export interface RentPayment {
  id: string
  tenancyId: string
  dueDate: string
  paidDate?: string
  amount: number
  status: PaymentStatus
  method?: 'bank-transfer' | 'credit-card' | 'cash'
  reference?: string
}

// Maintenance Request
export interface MaintenanceRequest {
  id: string
  propertyId: string
  tenancyId?: string
  title: string
  description: string
  category: string
  priority: MaintenancePriority
  status: MaintenanceStatus
  reportedDate: string
  scheduledDate?: string
  completedDate?: string
  estimatedCost?: number
  actualCost?: number
  contractorId?: string
  images: string[]
  notes: string[]
}

// Contractor
export interface Contractor {
  id: string
  name: string
  company?: string
  phone: string
  email: string
  specialties: string[]
  rating: number // 0-5
  completedJobs: number
  avatarUrl?: string
}

// Inspection
export interface Inspection {
  id: string
  propertyId: string
  tenancyId?: string
  type: 'routine' | 'entry' | 'exit' | 'compliance'
  scheduledDate: string
  completedDate?: string
  inspector: string
  status: 'scheduled' | 'completed' | 'cancelled'
  findings: InspectionFinding[]
  photos: string[]
  reportUrl?: string
}

export interface InspectionFinding {
  area: string
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  notes: string
  requiresAction: boolean
}

// Financial
export interface FinancialTransaction {
  id: string
  propertyId: string
  ownerId: string
  date: string
  type: 'income' | 'expense'
  category: string
  amount: number
  description: string
  gstAmount?: number
  receipt?: string
}

export interface MonthlyStatement {
  propertyId: string
  ownerId: string
  month: string // YYYY-MM
  totalIncome: number
  totalExpenses: number
  netIncome: number
  rentReceived: number
  maintenanceCosts: number
  managementFees: number
  insurance: number
  rates: number
  otherExpenses: number
}

// Document
export interface Document {
  id: string
  name: string
  type: string
  url: string
  uploadedDate: string
  size: number
}

// AI Insights
export interface AIInsight {
  id: string
  type: 'task' | 'warning' | 'opportunity' | 'recommendation'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  actionable: boolean
  action?: {
    label: string
    handler: () => void
  }
  createdAt: string
  relatedEntityId?: string
  relatedEntityType?: 'property' | 'tenancy' | 'maintenance'
}

// Compliance Item
export interface ComplianceItem {
  id: string
  propertyId: string
  requirement: string
  category: 'insulation' | 'heating' | 'ventilation' | 'drainage' | 'smoke-alarms'
  status: 'compliant' | 'non-compliant' | 'pending'
  lastChecked?: string
  nextCheckDue?: string
  notes: string
  evidence?: string[]
}

// Market Data
export interface MarketData {
  suburb: string
  city: string
  averageRent: {
    house: number
    apartment: number
    townhouse: number
  }
  rentalYield: number
  vacancy: Rate: number
  medianPrice: number
  priceGrowth: number // %
}

// Dashboard Stats
export interface DashboardStats {
  totalProperties: number
  occupiedProperties: number
  vacantProperties: number
  maintenanceProperties: number
  occupancyRate: number
  totalMonthlyRent: number
  overdueRent: number
  maintenanceRequests: {
    pending: number
    inProgress: number
    completed: number
  }
  upcomingInspections: number
  expiringLeases: number
}

// API Response wrapper
export interface APIResponse<T> {
  success: boolean
  data: T
  message?: string
  pagination?: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}
