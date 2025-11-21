import { useState } from 'react'
import { Users, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TenantCreditDisplay } from '../components/tenant-credit-display'
import { mockTenantCreditData, getCreditScoreColor, getCreditScoreBadgeColor } from '@/data/mock/tenant-credit'
import type { TenantCreditScore } from '@/data/mock/tenant-credit'
import { cn } from '@/lib/utils'

export function TenantsPage() {
  const [selectedTenant, setSelectedTenant] = useState<TenantCreditScore | null>(null)

  const tenants = Object.values(mockTenantCreditData)

  if (selectedTenant) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => setSelectedTenant(null)}>
          ← Back to Tenants List
        </Button>

        {/* Tenant Credit Display */}
        <TenantCreditDisplay creditData={selectedTenant} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tenant Credit Scoring</h1>
        <p className="text-muted-foreground">
          View tenant credit scores and payment history
        </p>
      </div>

      {/* Tenants List */}
      <Card>
        <CardHeader>
          <CardTitle>All Tenants</CardTitle>
          <CardDescription>
            Click on a tenant to view their detailed credit report
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {tenants.map((tenant) => {
              const scoreColor = getCreditScoreColor(tenant.creditScore)
              const badgeColor = getCreditScoreBadgeColor(tenant.rating)

              return (
                <div
                  key={tenant.tenantId}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent cursor-pointer"
                  onClick={() => setSelectedTenant(tenant)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold">{tenant.tenantName}</h4>
                      <p className="text-sm text-muted-foreground">{tenant.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Credit Score</p>
                      <p className={cn('text-2xl font-bold', scoreColor)}>
                        {tenant.creditScore}
                      </p>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <Badge variant="default" className={cn('mt-1', badgeColor)}>
                        {tenant.rating.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">On-Time</p>
                      <p className="font-semibold">
                        {tenant.paymentHistory.onTimePercentage.toFixed(1)}%
                      </p>
                    </div>

                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Excellent Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tenants.filter((t) => t.rating === 'excellent').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(tenants.reduce((sum, t) => sum + t.creditScore, 0) / tenants.length)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. On-Time %</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                tenants.reduce((sum, t) => sum + t.paymentHistory.onTimePercentage, 0) /
                tenants.length
              ).toFixed(1)}
              %
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
