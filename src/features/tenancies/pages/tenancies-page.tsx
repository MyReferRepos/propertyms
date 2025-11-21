import { useState, useEffect } from 'react'
import { FileText, Calendar, DollarSign, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { tenanciesAPI } from '@/services/api'
import type { Tenancy } from '@/types'
import { cn } from '@/lib/utils'

export function TenanciesPage() {
  const [tenancies, setTenancies] = useState<Tenancy[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | Tenancy['status']>('all')

  useEffect(() => {
    loadTenancies()
  }, [])

  const loadTenancies = async () => {
    try {
      setLoading(true)
      const response = await tenanciesAPI.getAll()
      if (response.success) {
        setTenancies(response.data)
      }
    } catch (error) {
      console.error('Failed to load tenancies:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTenancies = tenancies.filter((t) =>
    filter === 'all' ? true : t.status === filter
  )

  const stats = {
    total: tenancies.length,
    active: tenancies.filter((t) => t.status === 'active').length,
    expiringSoon: tenancies.filter((t) => t.status === 'expiring-soon').length,
    expired: tenancies.filter((t) => t.status === 'expired').length,
  }

  const statusColors = {
    active: 'bg-green-100 text-green-700 border-green-200',
    'expiring-soon': 'bg-amber-100 text-amber-700 border-amber-200',
    expired: 'bg-red-100 text-red-700 border-red-200',
    ended: 'bg-gray-100 text-gray-700 border-gray-200',
    terminated: 'bg-gray-100 text-gray-700 border-gray-200',
  }

  const statusIcons = {
    active: CheckCircle2,
    'expiring-soon': AlertCircle,
    expired: Clock,
    ended: Clock,
    terminated: Clock,
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NZ', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getDaysUntilExpiry = (endDate: string) => {
    const days = Math.floor(
      (new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
    return days
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading tenancies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenancies</h1>
          <p className="text-muted-foreground">Manage rental agreements and lease terms</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          New Tenancy
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <button
          className={cn(
            'rounded-lg border p-4 text-left transition-colors hover:bg-accent',
            filter === 'all' && 'border-primary bg-accent'
          )}
          onClick={() => setFilter('all')}
        >
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Tenancies</div>
        </button>

        <button
          className={cn(
            'rounded-lg border p-4 text-left transition-colors hover:bg-accent',
            filter === 'active' && 'border-primary bg-accent'
          )}
          onClick={() => setFilter('active')}
        >
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-muted-foreground">Active</div>
        </button>

        <button
          className={cn(
            'rounded-lg border p-4 text-left transition-colors hover:bg-accent',
            filter === 'expiring-soon' && 'border-primary bg-accent'
          )}
          onClick={() => setFilter('expiring-soon')}
        >
          <div className="text-2xl font-bold text-amber-600">{stats.expiringSoon}</div>
          <div className="text-sm text-muted-foreground">Expiring Soon</div>
        </button>

        <button
          className={cn(
            'rounded-lg border p-4 text-left transition-colors hover:bg-accent',
            filter === 'expired' && 'border-primary bg-accent'
          )}
          onClick={() => setFilter('expired')}
        >
          <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
          <div className="text-sm text-muted-foreground">Expired</div>
        </button>
      </div>

      {/* Tenancies List */}
      <div className="grid gap-4">
        {filteredTenancies.map((tenancy) => {
          const StatusIcon = statusIcons[tenancy.status]
          const daysUntilExpiry = getDaysUntilExpiry(tenancy.endDate)

          return (
            <Card key={tenancy.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">Property: {tenancy.propertyId}</CardTitle>
                      <Badge className={cn(statusColors[tenancy.status])}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {tenancy.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <CardDescription>Tenancy ID: {tenancy.id}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid gap-6 md:grid-cols-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Start Date</span>
                    </div>
                    <p className="font-semibold">{formatDate(tenancy.startDate)}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>End Date</span>
                    </div>
                    <p className="font-semibold">{formatDate(tenancy.endDate)}</p>
                    {tenancy.status === 'expiring-soon' && daysUntilExpiry > 0 && (
                      <p className="text-xs text-amber-600">{daysUntilExpiry} days left</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>Weekly Rent</span>
                    </div>
                    <p className="font-semibold">{formatCurrency(tenancy.weeklyRent)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(tenancy.weeklyRent * 52)} p.a.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>Bond Amount</span>
                    </div>
                    <p className="font-semibold">{formatCurrency(tenancy.bondAmount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {tenancy.bondAmount / tenancy.weeklyRent} weeks
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 border-t pt-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Payment Frequency: </span>
                    <span className="font-medium capitalize">{tenancy.paymentFrequency}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Auto Renew: </span>
                    <span className="font-medium">{tenancy.autoRenew ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Notice Period: </span>
                    <span className="font-medium">{tenancy.renewalNotice} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredTenancies.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No tenancies found</h3>
              <p className="text-sm text-muted-foreground">
                {filter === 'all'
                  ? 'Create your first tenancy to get started'
                  : `No ${filter.replace('-', ' ')} tenancies`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
