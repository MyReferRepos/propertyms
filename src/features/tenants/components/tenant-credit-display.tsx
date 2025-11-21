import { Shield, CheckCircle2, AlertTriangle, XCircle, TrendingUp, Briefcase, Home } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { TenantCreditScore } from '@/data/mock/tenant-credit'
import { getCreditScoreColor, getCreditScoreBadgeColor } from '@/data/mock/tenant-credit'
import { cn } from '@/lib/utils'

interface TenantCreditDisplayProps {
  creditData: TenantCreditScore
}

export function TenantCreditDisplay({ creditData }: TenantCreditDisplayProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const scoreColor = getCreditScoreColor(creditData.creditScore)
  const badgeColor = getCreditScoreBadgeColor(creditData.rating)

  return (
    <div className="space-y-6">
      {/* Credit Score Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Tenant Credit Report
              </CardTitle>
              <CardDescription>
                {creditData.tenantName} • Last updated:{' '}
                {new Date(creditData.lastUpdated).toLocaleDateString('en-NZ')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Credit Score Display */}
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative flex h-40 w-40 items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-muted"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - (creditData.creditScore - 300) / 550)}`}
                    className={cn('transition-all duration-500', scoreColor)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={cn('text-3xl font-bold', scoreColor)}>
                    {creditData.creditScore}
                  </span>
                  <span className="text-xs text-muted-foreground">/ 850</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Badge variant="default" className={cn('text-sm', badgeColor)}>
                  {creditData.rating.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">On-Time Payments</p>
                    <p className="text-2xl font-bold">
                      {creditData.paymentHistory.onTimePercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Home className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rental History</p>
                    <p className="text-2xl font-bold">{creditData.rentalHistory.yearsRenting}y</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rent-to-Income</p>
                    <p className="text-2xl font-bold">
                      {creditData.financialMetrics.rentToIncomeRatio.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment History</CardTitle>
            <CardDescription>
              Based on {creditData.paymentHistory.totalPayments} payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">On-Time Payments</span>
                <span className="font-semibold text-green-600">
                  {creditData.paymentHistory.onTimePayments}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Late Payments</span>
                <span className="font-semibold text-amber-600">
                  {creditData.paymentHistory.latePayments}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Missed Payments</span>
                <span className="font-semibold text-red-600">
                  {creditData.paymentHistory.missedPayments}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Metrics</CardTitle>
            <CardDescription>Income and employment information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly Income</span>
              <span className="font-semibold">
                {formatCurrency(creditData.financialMetrics.monthlyIncome)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Employment Status</span>
              <Badge variant="outline" className="capitalize">
                <Briefcase className="mr-1 h-3 w-3" />
                {creditData.financialMetrics.employmentStatus}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Employment Duration</span>
              <span className="text-sm font-medium">
                {creditData.financialMetrics.employmentDuration}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Rental History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rental History</CardTitle>
            <CardDescription>Previous tenancies and records</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Years Renting</span>
              <span className="font-semibold">{creditData.rentalHistory.yearsRenting}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Previous Properties</span>
              <span className="font-semibold">{creditData.rentalHistory.previousProperties}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Evictions</span>
              <span className={cn('font-semibold', creditData.rentalHistory.evictions > 0 ? 'text-red-600' : 'text-green-600')}>
                {creditData.rentalHistory.evictions}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Breaches</span>
              <span className={cn('font-semibold', creditData.rentalHistory.breaches > 0 ? 'text-amber-600' : 'text-green-600')}>
                {creditData.rentalHistory.breaches}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* References */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">References</CardTitle>
            <CardDescription>Verified references on file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Landlord References</span>
              <span className="font-semibold">{creditData.references.landlordReferences}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Employment References</span>
              <span className="font-semibold">{creditData.references.employmentReferences}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Red Flags and Positives */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Red Flags */}
        {creditData.redFlags.length > 0 && (
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-red-900">
                <AlertTriangle className="h-5 w-5" />
                Red Flags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {creditData.redFlags.map((flag, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-red-800">
                    <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Positives */}
        {creditData.positives.length > 0 && (
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-green-900">
                <CheckCircle2 className="h-5 w-5" />
                Positive Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {creditData.positives.map((positive, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{positive}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
