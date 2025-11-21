import type { DashboardStats, AIInsight, APIResponse } from '@/types'
import { mockDashboardStats, mockAIInsights, getActionableInsights } from '@/data/mock'

const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const dashboardAPI = {
  async getStats(): Promise<APIResponse<DashboardStats>> {
    await delay()

    return {
      success: true,
      data: mockDashboardStats,
    }
  },

  async getAIInsights(): Promise<APIResponse<AIInsight[]>> {
    await delay()

    return {
      success: true,
      data: mockAIInsights,
    }
  },

  async getActionableInsights(): Promise<APIResponse<AIInsight[]>> {
    await delay()

    const insights = getActionableInsights()

    return {
      success: true,
      data: insights,
    }
  },

  async dismissInsight(id: string): Promise<APIResponse<void>> {
    await delay()

    const index = mockAIInsights.findIndex((i) => i.id === id)

    if (index !== -1) {
      mockAIInsights.splice(index, 1)
    }

    return {
      success: true,
      data: undefined,
      message: 'Insight dismissed',
    }
  },
}
