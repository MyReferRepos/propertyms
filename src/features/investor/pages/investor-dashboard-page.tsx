import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, Home, PiggyBank, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { investmentAPI } from '@/services/api'
import type { PortfolioSummary, PropertyInvestmentMetrics } from '@/data/mock/investment-data'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

export function InvestorDashboardPage() {
  const { t } = useI18n()
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
          <p className="mt-4 text-sm text-muted-foreground">{t('investor.loading')}</p>
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Home className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">{t('investor.noData.title')}</h3>
          <p className="text-sm text-muted-foreground">{t('investor.noData.message')}</p>
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
        <h1 className="text-3xl font-bold tracking-tight">{t('investor.title')}</h1>
        <p className="text-muted-foreground">{t('investor.subtitle')}</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Portfolio Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('investor.metrics.portfolioValue')}</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalCurrentValue)}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>{formatCurrency(summary.totalCapitalGain)} {t('investor.metrics.capitalGain')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Average ROI */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('investor.metrics.averageROI')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(summary.averageROI)}</div>
            <p className="text-xs text-muted-foreground">{t('investor.metrics.returnOnInvestment')}</p>
          </CardContent>
        </Card>

        {/* Monthly Net Income */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('investor.metrics.monthlyNetIncome')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.monthlyNetIncome)}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{formatCurrency(summary.monthlyRentalIncome)} {t('investor.metrics.income')}</span>
              <span>-</span>
              <span>{formatCurrency(summary.monthlyExpenses)} {t('investor.metrics.expenses')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Rental Yield */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('investor.metrics.rentalYield')}</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(summary.averageRentalYield)}</div>
            <p className="text-xs text-muted-foreground">{t('investor.metrics.averageAcrossPortfolio')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Total Returns */}
        <Card>
          <CardHeader>
            <CardTitle>{t('investor.returns.title')}</CardTitle>
            <CardDescription>{t('investor.returns.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('investor.returns.totalInvested')}</span>
              <span className="font-semibold">{formatCurrency(summary.totalInvested)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('investor.returns.currentValue')}</span>
              <span className="font-semibold">{formatCurrency(summary.totalCurrentValue)}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('investor.returns.capitalGain')}</span>
              <span className="font-semibold text-green-600">
                +{formatCurrency(summary.totalCapitalGain)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('investor.returns.netCashFlow')}</span>
              <span className="font-semibold text-green-600">
                +{formatCurrency(summary.totalNetCashFlow)}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="font-medium">{t('investor.returns.totalGain')}</span>
              <span className="text-lg font-bold text-green-600">
                +{formatCurrency(summary.totalCapitalGain + summary.totalNetCashFlow)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow */}
        <Card>
          <CardHeader>
            <CardTitle>{t('investor.cashFlow.title')}</CardTitle>
            <CardDescription>{t('investor.cashFlow.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('investor.cashFlow.monthlyRentalIncome')}</span>
              <span className="font-semibold text-green-600">
                +{formatCurrency(summary.monthlyRentalIncome)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('investor.cashFlow.monthlyExpenses')}</span>
              <span className="font-semibold text-red-600">
                -{formatCurrency(summary.monthlyExpenses)}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="font-medium">{t('investor.cashFlow.monthlyNetIncome')}</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(summary.monthlyNetIncome)}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">{t('investor.cashFlow.annualized')}</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('investor.cashFlow.annualNetIncome')}</span>
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
          <CardTitle>{t('investor.properties.title')}</CardTitle>
          <CardDescription>{t('investor.properties.subtitle')}</CardDescription>
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
                        <p className="font-medium">{t('investor.properties.propertyId')}: {property.propertyId}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('investor.properties.purchased')}: {new Date(property.purchaseDate).toLocaleDateString('en-NZ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{t('investor.properties.currentValue')}</p>
                      <p className="font-semibold">{formatCurrency(property.currentValue)}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{t('investor.properties.roi')}</p>
                      <Badge
                        variant={isPositiveROI ? 'default' : 'secondary'}
                        className={cn(isPositiveROI && 'bg-green-600')}
                      >
                        {isPositiveROI ? '+' : ''}
                        {formatPercentage(property.roi)}
                      </Badge>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{t('investor.properties.rentalYield')}</p>
                      <p className="font-semibold">{formatPercentage(property.rentalYield)}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{t('investor.properties.monthlyNet')}</p>
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
