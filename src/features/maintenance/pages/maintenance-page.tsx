import { useState } from 'react'
import { Wrench, AlertCircle, CheckCircle2, Clock, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { MaintenanceRequest } from '@/types'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

// Mock data for maintenance requests
const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'maint-001',
    propertyId: 'prop-001',
    tenancyId: 'tenancy-001',
    title: 'Leaking Kitchen Tap',
    description: 'Kitchen tap has been dripping continuously for 3 days',
    category: 'plumbing',
    priority: 'high',
    status: 'in-progress',
    reportedDate: '2024-11-18',
    scheduledDate: '2024-11-22',
    estimatedCost: 150,
    contractorId: 'contractor-001',
    images: [],
    notes: ['Assigned to Mike\'s Plumbing Services'],
  },
  {
    id: 'maint-002',
    propertyId: 'prop-002',
    title: 'Broken Window Lock',
    description: 'Master bedroom window lock is broken and won\'t close properly',
    category: 'general',
    priority: 'medium',
    status: 'pending',
    reportedDate: '2024-11-20',
    estimatedCost: 80,
    images: [],
    notes: [],
  },
  {
    id: 'maint-003',
    propertyId: 'prop-003',
    tenancyId: 'tenancy-003',
    title: 'Heating System Not Working',
    description: 'Heat pump not producing warm air, tenants are cold',
    category: 'hvac',
    priority: 'urgent',
    status: 'pending',
    reportedDate: '2024-11-21',
    estimatedCost: 350,
    images: [],
    notes: [],
  },
  {
    id: 'maint-004',
    propertyId: 'prop-001',
    title: 'Annual Gutter Cleaning',
    description: 'Scheduled annual gutter maintenance',
    category: 'general',
    priority: 'low',
    status: 'completed',
    reportedDate: '2024-11-10',
    completedDate: '2024-11-15',
    actualCost: 120,
    contractorId: 'contractor-002',
    images: [],
    notes: ['Completed by Property Care Ltd'],
  },
]

export function MaintenancePage() {
  const { t } = useI18n()
  const [requests] = useState<MaintenanceRequest[]>(mockMaintenanceRequests)
  const [filter, setFilter] = useState<'all' | MaintenanceRequest['status']>('all')

  const filteredRequests = requests.filter((r) =>
    filter === 'all' ? true : r.status === filter
  )

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    inProgress: requests.filter((r) => r.status === 'in-progress').length,
    completed: requests.filter((r) => r.status === 'completed').length,
  }

  const priorityColors = {
    urgent: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-blue-100 text-blue-700 border-blue-200',
  }

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-700',
  }

  const statusIcons = {
    pending: AlertCircle,
    'in-progress': Clock,
    completed: CheckCircle2,
    cancelled: Clock,
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('maintenance.title')}</h1>
          <p className="text-muted-foreground">{t('maintenance.subtitle')}</p>
        </div>
        <Button>
          <Wrench className="mr-2 h-4 w-4" />
          {t('maintenance.newRequest')}
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
          <div className="text-sm text-muted-foreground">{t('maintenance.filters.all')}</div>
        </button>

        <button
          className={cn(
            'rounded-lg border p-4 text-left transition-colors hover:bg-accent',
            filter === 'pending' && 'border-primary bg-accent'
          )}
          onClick={() => setFilter('pending')}
        >
          <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          <div className="text-sm text-muted-foreground">{t('maintenance.filters.pending')}</div>
        </button>

        <button
          className={cn(
            'rounded-lg border p-4 text-left transition-colors hover:bg-accent',
            filter === 'in-progress' && 'border-primary bg-accent'
          )}
          onClick={() => setFilter('in-progress')}
        >
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-sm text-muted-foreground">{t('maintenance.filters.inProgress')}</div>
        </button>

        <button
          className={cn(
            'rounded-lg border p-4 text-left transition-colors hover:bg-accent',
            filter === 'completed' && 'border-primary bg-accent'
          )}
          onClick={() => setFilter('completed')}
        >
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-muted-foreground">{t('maintenance.filters.completed')}</div>
        </button>
      </div>

      {/* Requests List */}
      <div className="grid gap-4">
        {filteredRequests.map((request) => {
          const StatusIcon = statusIcons[request.status]

          return (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <Badge className={cn(priorityColors[request.priority])}>
                        {request.priority.toUpperCase()}
                      </Badge>
                      <Badge className={cn(statusColors[request.status])}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {request.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <CardDescription>
                      Property: {request.propertyId} • Reported: {formatDate(request.reportedDate)}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('maintenance.viewDetails')}
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm mb-4">{request.description}</p>

                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t('maintenance.details.category')}</p>
                    <p className="font-medium capitalize">{request.category}</p>
                  </div>

                  {request.scheduledDate && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('maintenance.details.scheduledDate')}</p>
                      <p className="font-medium">{formatDate(request.scheduledDate)}</p>
                    </div>
                  )}

                  {request.contractorId && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('maintenance.details.contractorId')}</p>
                      <p className="font-medium">{request.contractorId}</p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {request.status === 'completed' ? t('maintenance.details.actualCost') : t('maintenance.details.estimatedCost')}
                    </p>
                    <p className="font-medium flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(request.actualCost || request.estimatedCost || 0)}
                    </p>
                  </div>
                </div>

                {request.completedDate && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-green-600">
                      <CheckCircle2 className="inline h-4 w-4 mr-1" />
                      {t('maintenance.details.completedOn', { date: formatDate(request.completedDate) })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}

        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Wrench className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">{t('maintenance.noRequests')}</h3>
              <p className="text-sm text-muted-foreground">
                {filter === 'all'
                  ? t('maintenance.noRequests')
                  : t('maintenance.noRequestsFilter', { filter: filter.replace('-', ' ') })}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
