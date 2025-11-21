import { useEffect, useState } from 'react'
import { Building2, Home, DollarSign, Wrench, TrendingUp, TrendingDown } from 'lucide-react'
import { StatsCard } from '../components/stats-card'
import { AIInsightCard } from '../components/ai-insight-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardAPI } from '@/services/api'
import type { DashboardStats, AIInsight } from '@/types'

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [statsRes, insightsRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getAIInsights(),
      ])

      if (statsRes.success) setStats(statsRes.data)
      if (insightsRes.success) setInsights(insightsRes.data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDismissInsight = async (id: string) => {
    try {
      await dashboardAPI.dismissInsight(id)
      setInsights(insights.filter((i) => i.id !== id))
    } catch (error) {
      console.error('Failed to dismiss insight:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const occupancyTrend = stats.occupancyRate > 85 ? 'up' : 'down'

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your properties.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Properties"
          value={stats.totalProperties}
          change={{ value: 12.5, label: 'from last month' }}
          icon={Building2}
          iconClassName="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate.toFixed(1)}%`}
          change={{ value: occupancyTrend === 'up' ? 2.3 : -1.5, label: 'from last month' }}
          icon={occupancyTrend === 'up' ? TrendingUp : TrendingDown}
          iconClassName={occupancyTrend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
        />
        <StatsCard
          title="Monthly Rent"
          value={`$${stats.totalMonthlyRent.toLocaleString()}`}
          change={{ value: 5.2, label: 'from last month' }}
          icon={DollarSign}
          iconClassName="bg-emerald-100 text-emerald-600"
        />
        <StatsCard
          title="Maintenance Requests"
          value={stats.maintenanceRequests.pending + stats.maintenanceRequests.inProgress}
          icon={Wrench}
          iconClassName="bg-amber-100 text-amber-600"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Home className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupiedProperties}</div>
            <p className="text-xs text-muted-foreground">
              {stats.vacantProperties} vacant, {stats.maintenanceProperties} in maintenance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Rent</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.overdueRent}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Leases</CardTitle>
            <Building2 className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringLeases}</div>
            <p className="text-xs text-muted-foreground">In next 90 days</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">AI Insights</h2>
            <p className="text-sm text-muted-foreground">Smart recommendations to help you manage better</p>
          </div>
        </div>

        <div className="grid gap-4">
          {insights.slice(0, 5).map((insight) => (
            <AIInsightCard
              key={insight.id}
              insight={insight}
              onAction={insight.action?.handler}
              onDismiss={() => handleDismissInsight(insight.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
