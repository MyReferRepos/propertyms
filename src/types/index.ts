// Core Types for PropertyMS

export type PropertyType = 'house' | 'apartment' | 'townhouse' | 'unit'
export type DwellingType = 'house-townhouse' | 'apartment' | 'boarding-house-room' | 'room' | 'bedsit-flat'
export type AreaLocation = 'north' | 'south' | 'east' | 'west' | 'central'
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
  country: string
  area?: AreaLocation
  type: PropertyType
  dwellingType?: DwellingType

  // Room Information
  bedrooms: number
  bathrooms: number
  separateToilets?: number
  livingAreas?: number
  studyRooms?: number
  familyLounges?: number
  laundryRooms?: number
  sheds?: number

  // Parking & Space
  parkingSpaces: number
  parkingDescription?: string // e.g., "Single freestanding garage with automatic door"
  specialInfo?: string // e.g., "Garage converted to storage room"
  floorArea: number // sqm
  landArea?: number // sqm
  hasFloorPlan?: boolean
  floorPlanUrl?: string

  yearBuilt?: number
  status: PropertyStatus
  currentRent?: number // weekly
  estimatedValue: number
  imageUrl: string
  images: string[]
  ownerId: string
  managerId: string
  features: string[]

  // Amenities
  amenities?: {
    swimmingPool?: boolean
    spa?: boolean
    clothesline?: boolean
    offStreetParking?: boolean
    lawn?: boolean
    garden?: {
      hasGarden: boolean
      fencingType?: string // e.g., "Fully fenced", "Partially fenced", "Not fenced"
    }
  }

  // Utilities
  utilities?: {
    gas?: {
      available: boolean
      type?: string // e.g., "Nature gas from main pipe", "LPG Bottle"
      icpNumber?: string
    }
    electricity?: {
      icpNumber?: string
      location?: string
    }
    water?: {
      meterNumber?: string
      location?: string
    }
    septicTank?: boolean
    waterFilterSystem?: boolean
    internet?: {
      type?: string // e.g., "Fibre", "Wifi", "DDSL"
    }
    hrvSystem?: boolean
    fireplace?: boolean
  }

  // Chattels (Personal Property/Furnishings)
  chattels?: {
    mainList: Array<{
      item: string
      quantity: number
    }>
    additionalList?: Array<{
      item: string
      quantity: number
      note?: string // e.g., "Not affect tenants enjoy when staying at the place"
    }>
  }

  // Insurance
  insurance?: {
    hasInsurance: boolean
    insurer?: string
    policyNumber?: string
    excessFee?: number
    expiryDate?: string
    isMonthlyAutoRenewal?: boolean
  }

  // Compliance
  hasInsulation: boolean
  hasHeating: boolean
  hasSmokeAlarms: boolean
  smokeAlarmCompliance?: 'yes' | 'no' | 'not-checked'
  lastInspectionDate?: string
  nextInspectionDue?: string
  complianceScore: number // 0-100

  // Healthy Homes Compliance
  healthyHomesCompliance?: {
    isCompliant: boolean
    complianceDate?: string
    certificateUrl?: string
    certificateUpdatedDate?: string
    needsComplianceBy?: string
    reportUrl?: string
    reportUpdatedDate?: string
  }

  // Keys Information
  keys?: {
    mainEntranceDoor?: number
    backDoor?: number
    slidingDoor?: number
    garageRemote?: number
    keysPhotoUrl?: string
  }

  // Hazards & Risks
  hazards?: {
    hasHazards: boolean
    details?: Array<{
      type: string // e.g., "Dogs", "Asbestos", "Meth", "Dangerous Building Notice"
      description: string
      isPhysicalDanger?: boolean
    }>
  }

  // AI Features
  rentalAppraisal?: {
    lastGeneratedDate?: string
    reportUrl?: string
    suggestedRent?: number
  }
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
  category: 'insulation' | 'heating' | 'ventilation' | 'moisture' | 'draught'
  status: 'compliant' | 'non-compliant' | 'pending'
  lastChecked?: string
  nextCheckDue?: string
  details: string
  remediation: string | null
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
  vacancyRate: number
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

// Rental Market Analysis
export interface RentalMarketData {
  suburb: string
  city: string
  propertyType: PropertyType
  averageRent: number // weekly
  medianRent: number // weekly
  minRent: number // weekly
  maxRent: number // weekly
  totalListings: number
  rentTrend: 'increasing' | 'stable' | 'decreasing'
  rentChangePercent: number // percentage change from previous period
  demandLevel: 'low' | 'medium' | 'high'
  averageDaysToLease: number
}

export interface RentalPriceReport {
  id: string
  generatedDate: string
  reportType: 'landlord' | 'tenant'
  property?: {
    address: string
    type: PropertyType
    bedrooms: number
    bathrooms: number
  }
  area: {
    suburb: string
    city: string
  }
  marketData: RentalMarketData
  recommendations: string[]
  comparableProperties: {
    address: string
    type: PropertyType
    bedrooms: number
    bathrooms: number
    weeklyRent: number
    distance: number // km
  }[]
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
