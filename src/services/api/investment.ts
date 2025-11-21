import type { APIResponse } from '@/types'
import {
  mockInvestmentMetrics,
  calculatePortfolioSummary,
  type PropertyInvestmentMetrics,
  type PortfolioSummary,
} from '@/data/mock/investment-data'

const delay = () => new Promise((resolve) => setTimeout(resolve, 300))

export const investmentAPI = {
  /**
   * Get investment metrics for a specific property
   */
  async getPropertyMetrics(propertyId: string): Promise<APIResponse<PropertyInvestmentMetrics>> {
    await delay()

    const metrics = mockInvestmentMetrics[propertyId]

    if (!metrics) {
      return {
        success: false,
        message: 'Investment metrics not found for this property',
        data: null as any,
      }
    }

    return {
      success: true,
      data: metrics,
    }
  },

  /**
   * Get portfolio summary across all properties
   */
  async getPortfolioSummary(): Promise<APIResponse<PortfolioSummary>> {
    await delay()

    const allMetrics = Object.values(mockInvestmentMetrics)
    const summary = calculatePortfolioSummary(allMetrics)

    return {
      success: true,
      data: summary,
    }
  },

  /**
   * Get investment metrics for all properties
   */
  async getAllPropertyMetrics(): Promise<APIResponse<PropertyInvestmentMetrics[]>> {
    await delay()

    const allMetrics = Object.values(mockInvestmentMetrics)

    return {
      success: true,
      data: allMetrics,
    }
  },
}
