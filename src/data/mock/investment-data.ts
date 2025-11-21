/**
 * Mock Investment Data - Property Owner Dashboard
 *
 * This data represents investment metrics for property owners to track
 * their portfolio performance, ROI, rental yield, and cash flow.
 */

export interface PropertyInvestmentMetrics {
  propertyId: string
  purchasePrice: number
  purchaseDate: string
  currentValue: number
  totalInvested: number // Purchase + improvements
  totalRentalIncome: number
  totalExpenses: number
  netCashFlow: number
  capitalGain: number
  roi: number // Return on Investment %
  rentalYield: number // Annual rental yield %
  monthlyRentalIncome: number
  monthlyExpenses: number
  monthlyNetIncome: number
  valueGrowthHistory: Array<{
    date: string
    value: number
  }>
  incomeHistory: Array<{
    month: string
    income: number
    expenses: number
    net: number
  }>
}

export const mockInvestmentMetrics: Record<string, PropertyInvestmentMetrics> = {
  'prop-001': {
    propertyId: 'prop-001',
    purchasePrice: 650000,
    purchaseDate: '2022-03-15',
    currentValue: 750000,
    totalInvested: 670000, // Purchase + 20k improvements
    totalRentalIncome: 84240, // 2+ years of rent
    totalExpenses: 28500,
    netCashFlow: 55740,
    capitalGain: 80000,
    roi: 20.2, // (capitalGain + netCashFlow) / totalInvested * 100
    rentalYield: 4.2, // annualRent / currentValue * 100
    monthlyRentalIncome: 2800, // 650/week * 4.33
    monthlyExpenses: 950,
    monthlyNetIncome: 1850,
    valueGrowthHistory: [
      { date: '2022-03', value: 650000 },
      { date: '2022-06', value: 665000 },
      { date: '2022-09', value: 680000 },
      { date: '2022-12', value: 695000 },
      { date: '2023-03', value: 710000 },
      { date: '2023-06', value: 720000 },
      { date: '2023-09', value: 730000 },
      { date: '2023-12', value: 740000 },
      { date: '2024-03', value: 745000 },
      { date: '2024-06', value: 748000 },
      { date: '2024-09', value: 750000 },
    ],
    incomeHistory: [
      { month: '2024-06', income: 2800, expenses: 920, net: 1880 },
      { month: '2024-07', income: 2800, expenses: 950, net: 1850 },
      { month: '2024-08', income: 2800, expenses: 980, net: 1820 },
      { month: '2024-09', income: 2800, expenses: 920, net: 1880 },
      { month: '2024-10', income: 2800, expenses: 1200, net: 1600 }, // Higher expenses due to maintenance
      { month: '2024-11', income: 2800, expenses: 940, net: 1860 },
    ],
  },

  'prop-002': {
    propertyId: 'prop-002',
    purchasePrice: 420000,
    purchaseDate: '2021-08-20',
    currentValue: 510000,
    totalInvested: 445000, // Purchase + 25k renovations
    totalRentalIncome: 118800, // 3+ years
    totalExpenses: 42000,
    netCashFlow: 76800,
    capitalGain: 65000,
    roi: 31.9,
    rentalYield: 5.1,
    monthlyRentalIncome: 2380, // 550/week * 4.33
    monthlyExpenses: 850,
    monthlyNetIncome: 1530,
    valueGrowthHistory: [
      { date: '2021-08', value: 420000 },
      { date: '2021-12', value: 435000 },
      { date: '2022-03', value: 450000 },
      { date: '2022-06', value: 465000 },
      { date: '2022-09', value: 475000 },
      { date: '2022-12', value: 485000 },
      { date: '2023-03', value: 490000 },
      { date: '2023-06', value: 495000 },
      { date: '2023-09', value: 500000 },
      { date: '2023-12', value: 505000 },
      { date: '2024-06', value: 508000 },
      { date: '2024-09', value: 510000 },
    ],
    incomeHistory: [
      { month: '2024-06', income: 2380, expenses: 820, net: 1560 },
      { month: '2024-07', income: 2380, expenses: 850, net: 1530 },
      { month: '2024-08', income: 2380, expenses: 880, net: 1500 },
      { month: '2024-09', income: 2380, expenses: 820, net: 1560 },
      { month: '2024-10', income: 2380, expenses: 900, net: 1480 },
      { month: '2024-11', income: 2380, expenses: 840, net: 1540 },
    ],
  },

  'prop-003': {
    propertyId: 'prop-003',
    purchasePrice: 890000,
    purchaseDate: '2023-01-10',
    currentValue: 925000,
    totalInvested: 900000, // Purchase + 10k
    totalRentalIncome: 58320, // ~2 years
    totalExpenses: 21000,
    netCashFlow: 37320,
    capitalGain: 35000,
    roi: 8.0,
    rentalYield: 3.9,
    monthlyRentalIncome: 3030, // 700/week * 4.33
    monthlyExpenses: 1100,
    monthlyNetIncome: 1930,
    valueGrowthHistory: [
      { date: '2023-01', value: 890000 },
      { date: '2023-03', value: 895000 },
      { date: '2023-06', value: 900000 },
      { date: '2023-09', value: 905000 },
      { date: '2023-12', value: 910000 },
      { date: '2024-03', value: 915000 },
      { date: '2024-06', value: 920000 },
      { date: '2024-09', value: 925000 },
    ],
    incomeHistory: [
      { month: '2024-06', income: 3030, expenses: 1050, net: 1980 },
      { month: '2024-07', income: 3030, expenses: 1100, net: 1930 },
      { month: '2024-08', income: 3030, expenses: 1150, net: 1880 },
      { month: '2024-09', income: 3030, expenses: 1070, net: 1960 },
      { month: '2024-10', income: 3030, expenses: 1200, net: 1830 },
      { month: '2024-11', income: 3030, expenses: 1090, net: 1940 },
    ],
  },
}

// Portfolio-level summary
export interface PortfolioSummary {
  totalProperties: number
  totalInvested: number
  totalCurrentValue: number
  totalCapitalGain: number
  totalRentalIncome: number
  totalExpenses: number
  totalNetCashFlow: number
  averageROI: number
  averageRentalYield: number
  monthlyRentalIncome: number
  monthlyExpenses: number
  monthlyNetIncome: number
}

export const calculatePortfolioSummary = (
  metrics: PropertyInvestmentMetrics[],
): PortfolioSummary => {
  const total = metrics.reduce(
    (acc, m) => ({
      totalInvested: acc.totalInvested + m.totalInvested,
      totalCurrentValue: acc.totalCurrentValue + m.currentValue,
      totalCapitalGain: acc.totalCapitalGain + m.capitalGain,
      totalRentalIncome: acc.totalRentalIncome + m.totalRentalIncome,
      totalExpenses: acc.totalExpenses + m.totalExpenses,
      totalNetCashFlow: acc.totalNetCashFlow + m.netCashFlow,
      monthlyRentalIncome: acc.monthlyRentalIncome + m.monthlyRentalIncome,
      monthlyExpenses: acc.monthlyExpenses + m.monthlyExpenses,
      monthlyNetIncome: acc.monthlyNetIncome + m.monthlyNetIncome,
    }),
    {
      totalInvested: 0,
      totalCurrentValue: 0,
      totalCapitalGain: 0,
      totalRentalIncome: 0,
      totalExpenses: 0,
      totalNetCashFlow: 0,
      monthlyRentalIncome: 0,
      monthlyExpenses: 0,
      monthlyNetIncome: 0,
    },
  )

  const averageROI =
    metrics.reduce((sum, m) => sum + m.roi, 0) / (metrics.length || 1)
  const averageRentalYield =
    metrics.reduce((sum, m) => sum + m.rentalYield, 0) / (metrics.length || 1)

  return {
    totalProperties: metrics.length,
    ...total,
    averageROI,
    averageRentalYield,
  }
}
