import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, Home, PiggyBank, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { investmentAPI } from '@/services/api'
import type { PortfolioSummary, PropertyInvestmentMetrics } from '@/data/mock/investment-data'
import { cn } from '@/lib/utils'

export function InvestorDashboardPage() {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null)
  const [properties, setProperties] = useState<PropertyInvestmentMetrics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [summaryRes, propertiesRes] = await Promise.all([
        investmentAPI.getPortfolioSummary(),
        investmentAPI.getAllPropertyMetrics(),
      ])

      if (summaryRes.success) {
        setSummary(summaryRes.data)
      }

      if (propertiesRes.success) {
        setProperties(propertiesRes.data)
      }
    } catch (error) {
      console.error('Failed to load investment data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading investment data...</p>
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Home className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No investment data available</h3>
          <p className="text-sm text-muted-foreground">Start adding properties to track your investments</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Investment Dashboard</h1>
        <p className="text-muted-foreground">Track your property portfolio performance and ROI</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Portfolio Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalCurrentValue)}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>{formatCurrency(summary.totalCapitalGain)} capital gain</span>
            </div>
          </CardContent>
        </Card>

        {/* Average ROI */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(summary.averageROI)}</div>
            <p className="text-xs text-muted-foreground">Return on investment</p>
          </CardContent>
        </Card>

        {/* Monthly Net Income */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Net Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.monthlyNetIncome)}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{formatCurrency(summary.monthlyRentalIncome)} income</span>
              <span>-</span>
              <span>{formatCurrency(summary.monthlyExpenses)} expenses</span>
            </div>
          </CardContent>
        </Card>

        {/* Rental Yield */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rental Yield</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(summary.averageRentalYield)}</div>
            <p className="text-xs text-muted-foreground">Average across portfolio</p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Total Returns */}
        <Card>
          <CardHeader>
            <CardTitle>Total Returns</CardTitle>
            <CardDescription>Breakdown of your investment performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Invested</span>
              <span className="font-semibold">{formatCurrency(summary.totalInvested)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Value</span>
              <span className="font-semibold">{formatCurrency(summary.totalCurrentValue)}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Capital Gain</span>
              <span className="font-semibold text-green-600">
                +{formatCurrency(summary.totalCapitalGain)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Net Cash Flow</span>
              <span className="font-semibold text-green-600">
                +{formatCurrency(summary.totalNetCashFlow)}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Gain</span>
              <span className="text-lg font-bold text-green-600">
                +{formatCurrency(summary.totalCapitalGain + summary.totalNetCashFlow)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow */}
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Summary</CardTitle>
            <CardDescription>Monthly income and expenses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly Rental Income</span>
              <span className="font-semibold text-green-600">
                +{formatCurrency(summary.monthlyRentalIncome)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly Expenses</span>
              <span className="font-semibold text-red-600">
                -{formatCurrency(summary.monthlyExpenses)}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="font-medium">Monthly Net Income</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(summary.monthlyNetIncome)}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Annualized</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Annual Net Income</span>
                <span className="font-semibold">
                  {formatCurrency(summary.monthlyNetIncome * 12)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Properties */}
      <Card>
        <CardHeader>
          <CardTitle>Property Performance</CardTitle>
          <CardDescription>Individual property investment metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {properties.map((property) => {
              const roi = property.roi
              const isPositiveROI = roi > 0

              return (
                <div
                  key={property.propertyId}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Home className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Property ID: {property.propertyId}</p>
                        <p className="text-sm text-muted-foreground">
                          Purchased: {new Date(property.purchaseDate).toLocaleDateString('en-NZ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Current Value</p>
                      <p className="font-semibold">{formatCurrency(property.currentValue)}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">ROI</p>
                      <Badge
                        variant={isPositiveROI ? 'default' : 'secondary'}
                        className={cn(isPositiveROI && 'bg-green-600')}
                      >
                        {isPositiveROI ? '+' : ''}
                        {formatPercentage(property.roi)}
                      </Badge>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Rental Yield</p>
                      <p className="font-semibold">{formatPercentage(property.rentalYield)}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Monthly Net</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(property.monthlyNetIncome)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
