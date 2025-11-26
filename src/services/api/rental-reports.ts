import type { RentalMarketData, RentalPriceReport, PropertyType, APIResponse } from '@/types'

// Simulate API delay
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock rental market data
const mockMarketData: Record<string, RentalMarketData[]> = {
  Auckland: [
    {
      suburb: 'Remuera',
      city: 'Auckland',
      propertyType: 'house',
      averageRent: 850,
      medianRent: 800,
      minRent: 600,
      maxRent: 1200,
      totalListings: 45,
      rentTrend: 'increasing',
      rentChangePercent: 5.2,
      demandLevel: 'high',
      averageDaysToLease: 12,
    },
    {
      suburb: 'Remuera',
      city: 'Auckland',
      propertyType: 'apartment',
      averageRent: 550,
      medianRent: 520,
      minRent: 400,
      maxRent: 750,
      totalListings: 68,
      rentTrend: 'stable',
      rentChangePercent: 1.5,
      demandLevel: 'medium',
      averageDaysToLease: 15,
    },
    {
      suburb: 'Ponsonby',
      city: 'Auckland',
      propertyType: 'townhouse',
      averageRent: 720,
      medianRent: 700,
      minRent: 550,
      maxRent: 900,
      totalListings: 32,
      rentTrend: 'increasing',
      rentChangePercent: 3.8,
      demandLevel: 'high',
      averageDaysToLease: 10,
    },
  ],
  Wellington: [
    {
      suburb: 'Mount Victoria',
      city: 'Wellington',
      propertyType: 'house',
      averageRent: 750,
      medianRent: 720,
      minRent: 550,
      maxRent: 1000,
      totalListings: 28,
      rentTrend: 'stable',
      rentChangePercent: 0.8,
      demandLevel: 'medium',
      averageDaysToLease: 18,
    },
    {
      suburb: 'Mount Victoria',
      city: 'Wellington',
      propertyType: 'apartment',
      averageRent: 480,
      medianRent: 460,
      minRent: 350,
      maxRent: 650,
      totalListings: 52,
      rentTrend: 'decreasing',
      rentChangePercent: -2.1,
      demandLevel: 'low',
      averageDaysToLease: 25,
    },
  ],
}

// Generate landlord-specific recommendations
function generateLandlordRecommendations(
  marketData: RentalMarketData,
  currentRent?: number,
): string[] {
  const recommendations: string[] = []

  if (currentRent) {
    if (currentRent < marketData.averageRent * 0.9) {
      recommendations.push(
        `Your current rent is below market average. Consider increasing to $${Math.round(marketData.averageRent * 0.95)} per week to align with market rates.`,
      )
    } else if (currentRent > marketData.averageRent * 1.1) {
      recommendations.push(
        `Your rent is above market average. This may result in longer vacancy periods. Consider adjusting to $${Math.round(marketData.averageRent)} per week for competitive positioning.`,
      )
    } else {
      recommendations.push(
        'Your rent is well-positioned within the current market range.',
      )
    }
  }

  if (marketData.rentTrend === 'increasing') {
    recommendations.push(
      `Market rent is trending upward (+${marketData.rentChangePercent}%). Consider scheduling a rent review for your next lease renewal.`,
    )
  } else if (marketData.rentTrend === 'decreasing') {
    recommendations.push(
      `Market rent is trending downward (${marketData.rentChangePercent}%). Focus on tenant retention to minimize vacancy costs.`,
    )
  }

  if (marketData.demandLevel === 'high') {
    recommendations.push(
      `High demand in ${marketData.suburb} with average leasing time of ${marketData.averageDaysToLease} days. Consider premium positioning.`,
    )
  } else if (marketData.demandLevel === 'low') {
    recommendations.push(
      `Lower demand in the area. Ensure your property is well-maintained and competitively priced to attract quality tenants.`,
    )
  }

  recommendations.push(
    `Based on ${marketData.totalListings} active listings in ${marketData.suburb}, ensure your property stands out with professional photos and detailed descriptions.`,
  )

  return recommendations
}

// Generate tenant-specific recommendations
function generateTenantRecommendations(marketData: RentalMarketData): string[] {
  const recommendations: string[] = []

  recommendations.push(
    `Average rent in ${marketData.suburb} is $${marketData.averageRent} per week for ${marketData.propertyType}s.`,
  )

  if (marketData.rentTrend === 'increasing') {
    recommendations.push(
      `Rent prices are rising (+${marketData.rentChangePercent}%). Consider securing a longer-term lease to lock in current rates.`,
    )
  } else if (marketData.rentTrend === 'decreasing') {
    recommendations.push(
      `Rent prices are declining (${marketData.rentChangePercent}%). This is a good time to negotiate or explore options for better value.`,
    )
  }

  if (marketData.demandLevel === 'high') {
    recommendations.push(
      `High demand area - properties lease within ${marketData.averageDaysToLease} days on average. Be prepared to apply quickly with complete documentation.`,
    )
  } else if (marketData.demandLevel === 'low') {
    recommendations.push(
      `Moderate competition for rentals. Take time to compare options and negotiate terms that work for you.`,
    )
  }

  const budgetRanges = [
    { max: marketData.medianRent * 0.9, desc: 'lower end' },
    {
      max: marketData.medianRent * 1.1,
      desc: 'median range',
    },
    { max: marketData.maxRent, desc: 'premium range' },
  ]

  recommendations.push(
    `Budget guide: Under $${Math.round(budgetRanges[0].max)} (${budgetRanges[0].desc}), ` +
      `$${Math.round(budgetRanges[0].max)}-$${Math.round(budgetRanges[1].max)} (${budgetRanges[1].desc}), ` +
      `$${Math.round(budgetRanges[1].max)}+ (${budgetRanges[2].desc})`,
  )

  return recommendations
}

// Generate comparable properties
function generateComparableProperties(
  propertyType: PropertyType,
  bedrooms: number,
  bathrooms: number,
  marketData: RentalMarketData,
) {
  const baseRent = marketData.medianRent

  return [
    {
      address: `${Math.floor(Math.random() * 200) + 1} ${marketData.suburb} Road`,
      type: propertyType,
      bedrooms,
      bathrooms,
      weeklyRent: Math.round(baseRent * (0.95 + Math.random() * 0.1)),
      distance: Math.round(Math.random() * 20) / 10 + 0.1,
    },
    {
      address: `${Math.floor(Math.random() * 200) + 1} ${marketData.suburb} Street`,
      type: propertyType,
      bedrooms,
      bathrooms,
      weeklyRent: Math.round(baseRent * (0.95 + Math.random() * 0.1)),
      distance: Math.round(Math.random() * 20) / 10 + 0.2,
    },
    {
      address: `${Math.floor(Math.random() * 200) + 1} ${marketData.suburb} Avenue`,
      type: propertyType,
      bedrooms: bedrooms,
      bathrooms,
      weeklyRent: Math.round(baseRent * (0.95 + Math.random() * 0.1)),
      distance: Math.round(Math.random() * 20) / 10 + 0.3,
    },
  ]
}

export const rentalReportsAPI = {
  /**
   * Get rental market data for a specific area
   */
  async getMarketData(
    city: string,
    suburb: string,
    propertyType: PropertyType,
  ): Promise<APIResponse<RentalMarketData>> {
    await delay()

    const cityData = mockMarketData[city] || []
    const data = cityData.find(
      (d) => d.suburb.toLowerCase() === suburb.toLowerCase() && d.propertyType === propertyType,
    )

    if (!data) {
      // Return default data if specific suburb not found
      return {
        success: true,
        data: {
          suburb,
          city,
          propertyType,
          averageRent: 600,
          medianRent: 580,
          minRent: 450,
          maxRent: 800,
          totalListings: 25,
          rentTrend: 'stable',
          rentChangePercent: 0,
          demandLevel: 'medium',
          averageDaysToLease: 20,
        },
      }
    }

    return {
      success: true,
      data,
    }
  },

  /**
   * Generate a rental price report for landlords
   */
  async generateLandlordReport(params: {
    propertyId?: string
    address: string
    suburb: string
    city: string
    propertyType: PropertyType
    bedrooms: number
    bathrooms: number
    currentRent?: number
  }): Promise<APIResponse<RentalPriceReport>> {
    await delay(500)

    const marketDataResponse = await this.getMarketData(
      params.city,
      params.suburb,
      params.propertyType,
    )

    if (!marketDataResponse.success) {
      throw new Error('Failed to fetch market data')
    }

    const marketData = marketDataResponse.data

    const report: RentalPriceReport = {
      id: `rep-landlord-${Date.now()}`,
      generatedDate: new Date().toISOString(),
      reportType: 'landlord',
      property: {
        address: params.address,
        type: params.propertyType,
        bedrooms: params.bedrooms,
        bathrooms: params.bathrooms,
      },
      area: {
        suburb: params.suburb,
        city: params.city,
      },
      marketData,
      recommendations: generateLandlordRecommendations(marketData, params.currentRent),
      comparableProperties: generateComparableProperties(
        params.propertyType,
        params.bedrooms,
        params.bathrooms,
        marketData,
      ),
    }

    return {
      success: true,
      data: report,
      message: 'Landlord report generated successfully',
    }
  },

  /**
   * Generate a rental price report for tenants
   */
  async generateTenantReport(params: {
    suburb: string
    city: string
    propertyType: PropertyType
    bedrooms: number
    bathrooms: number
  }): Promise<APIResponse<RentalPriceReport>> {
    await delay(500)

    const marketDataResponse = await this.getMarketData(
      params.city,
      params.suburb,
      params.propertyType,
    )

    if (!marketDataResponse.success) {
      throw new Error('Failed to fetch market data')
    }

    const marketData = marketDataResponse.data

    const report: RentalPriceReport = {
      id: `rep-tenant-${Date.now()}`,
      generatedDate: new Date().toISOString(),
      reportType: 'tenant',
      area: {
        suburb: params.suburb,
        city: params.city,
      },
      marketData,
      recommendations: generateTenantRecommendations(marketData),
      comparableProperties: generateComparableProperties(
        params.propertyType,
        params.bedrooms,
        params.bathrooms,
        marketData,
      ),
    }

    return {
      success: true,
      data: report,
      message: 'Tenant report generated successfully',
    }
  },
}
