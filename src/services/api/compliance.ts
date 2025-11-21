import type { APIResponse, ComplianceItem } from '@/types'
import { mockComplianceData } from '@/data/mock/compliance'

const delay = () => new Promise((resolve) => setTimeout(resolve, 300))

export const complianceAPI = {
  /**
   * Get compliance items for a property
   */
  async getByPropertyId(propertyId: string): Promise<APIResponse<ComplianceItem[]>> {
    await delay()

    const items = mockComplianceData[propertyId] || []

    return {
      success: true,
      data: items,
    }
  },

  /**
   * Run compliance check for a property
   * Simulates running a new compliance check
   */
  async runCheck(propertyId: string): Promise<APIResponse<ComplianceItem[]>> {
    await delay()

    const items = mockComplianceData[propertyId] || []

    // Update lastChecked date to today
    const updatedItems = items.map((item) => ({
      ...item,
      lastChecked: new Date().toISOString().split('T')[0],
    }))

    return {
      success: true,
      data: updatedItems,
      message: 'Compliance check completed successfully',
    }
  },

  /**
   * Calculate compliance score for a property
   */
  calculateScore(items: ComplianceItem[]): number {
    if (items.length === 0) return 0

    const compliantCount = items.filter((item) => item.status === 'compliant').length
    return Math.round((compliantCount / items.length) * 100)
  },
}
