// Centralized API exports

export * from './client'
export * from './properties'
export * from './tenancies'
export * from './dashboard'
export * from './compliance'
export * from './investment'

// Export all APIs in a single object for convenience
import { propertiesAPI } from './properties'
import { tenanciesAPI, rentPaymentsAPI } from './tenancies'
import { dashboardAPI } from './dashboard'
import { complianceAPI } from './compliance'
import { investmentAPI } from './investment'

export const api = {
  properties: propertiesAPI,
  tenancies: tenanciesAPI,
  rentPayments: rentPaymentsAPI,
  dashboard: dashboardAPI,
  compliance: complianceAPI,
  investment: investmentAPI,
}
