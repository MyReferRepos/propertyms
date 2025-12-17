import { useState } from 'react'
import { ClipboardCheck, Calendar, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

interface Inspection {
  id: string
  propertyId: string
  type: 'routine' | 'move-in' | 'move-out' | 'final' | 'special'
  status: 'scheduled' | 'completed' | 'cancelled'
  scheduledDate: string
  completedDate?: string
  inspector: string
  findings: string[]
  rating: 'excellent' | 'good' | 'fair' | 'poor'
}

const mockInspections: Inspection[] = [
  {
    id: 'insp-001',
    propertyId: 'prop-001',
    type: 'routine',
    status: 'scheduled',
    scheduledDate: '2024-11-25',
    inspector: 'John Smith',
    findings: [],
    rating: 'good',
  },
  {
    id: 'insp-002',
    propertyId: 'prop-002',
    type: 'routine',
    status: 'completed',
    scheduledDate: '2024-11-15',
    completedDate: '2024-11-15',
    inspector: 'Sarah Johnson',
    findings: [
      'Minor wear on carpet in living room',
      'Kitchen tap dripping slightly',
      'Garden well maintained',
    ],
    rating: 'good',
  },
  {
    id: 'insp-003',
    propertyId: 'prop-003',
    type: 'move-out',
    status: 'completed',
    scheduledDate: '2024-11-10',
    completedDate: '2024-11-10',
    inspector: 'Mike Chen',
    findings: ['Property in excellent condition', 'All fixtures intact', 'Deep cleaned'],
    rating: 'excellent',
  },
]

export function InspectionsPage() {
  const { t } = useI18n()
  const [inspections] = useState<Inspection[]>(mockInspections)
  const [filter, setFilter] = useState<'all' | Inspection['status']>('all')

  const filteredInspections = inspections.filter((i) =>
    filter === 'all' ? true : i.status === filter
  )

  const stats = {
    total: inspections.length,
    scheduled: inspections.filter((i) => i.status === 'scheduled').length,
    completed: inspections.filter((i) => i.status === 'completed').length,
  }

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-700',
  }

  const statusIcons = {
    scheduled: Clock,
    completed: CheckCircle2,
    cancelled: AlertCircle,
  }

  const ratingColors = {
    excellent: 'bg-green-100 text-green-700',
    good: 'bg-blue-100 text-blue-700',
    fair: 'bg-amber-100 text-amber-700',
    poor: 'bg-red-100 text-red-700',
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
          <h1 className="text-3xl font-bold tracking-tight">{t('inspections.title')}</h1>
          <p className="text-muted-foreground">{t('inspections.subtitle')}</p>
        </div>
        <Button>
          <ClipboardCheck className="mr-2 h-4 w-4" />
          {t('inspections.scheduleInspection')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <button
          className={cn(
            'rounded-lg border p-4 text-left transition-colors hover:bg-accent',
            filter === 'all' && 'border-primary bg-accent'
          )}
          onClick={() => setFilter('all')}
        >
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">{t('inspections.filters.all')}</div>
        </button>

        <button
          className={cn(
            'rounded-lg border p-4 text-left transition-colors hover:bg-accent',
            filter === 'scheduled' && 'border-primary bg-accent'
          )}
          onClick={() => setFilter('scheduled')}
        >
          <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
          <div className="text-sm text-muted-foreground">{t('inspections.filters.scheduled')}</div>
        </button>

        <button
          className={cn(
            'rounded-lg border p-4 text-left transition-colors hover:bg-accent',
            filter === 'completed' && 'border-primary bg-accent'
          )}
          onClick={() => setFilter('completed')}
        >
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-muted-foreground">{t('inspections.filters.completed')}</div>
        </button>
      </div>

      {/* Inspections List */}
      <div className="grid gap-4">
        {filteredInspections.map((inspection) => {
          const StatusIcon = statusIcons[inspection.status]

          return (
            <Card key={inspection.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{t(`inspections.typeLabels.${inspection.type}`)}</CardTitle>
                      <Badge className={cn(statusColors[inspection.status])}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {t(`inspections.status.${inspection.status}`)}
                      </Badge>
                      {inspection.status === 'completed' && (
                        <Badge className={cn(ratingColors[inspection.rating])}>
                          {t(`inspections.rating.${inspection.rating}`)}
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{t('inspections.details.property')}: {inspection.propertyId}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('inspections.viewReport')}
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{t('inspections.details.scheduledDate')}</span>
                    </div>
                    <p className="font-semibold">{formatDate(inspection.scheduledDate)}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t('inspections.details.inspector')}</p>
                    <p className="font-semibold">{inspection.inspector}</p>
                  </div>

                  {inspection.completedDate && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('inspections.details.completedDate')}</p>
                      <p className="font-semibold">{formatDate(inspection.completedDate)}</p>
                    </div>
                  )}
                </div>

                {inspection.findings.length > 0 && (
                  <div className="space-y-2 border-t pt-4">
                    <p className="text-sm font-medium">{t('inspections.details.findings')}:</p>
                    <ul className="space-y-1">
                      {inspection.findings.map((finding, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
