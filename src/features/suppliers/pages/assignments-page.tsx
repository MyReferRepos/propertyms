import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ClipboardList, Building2, Truck, Calendar, Clock, User } from 'lucide-react'

const mockAssignments = [
  {
    id: '1',
    supplier: 'ABC Plumbing',
    property: '123 Queen Street, Auckland CBD',
    workOrder: 'WO-2024-001',
    description: 'Hot water cylinder replacement',
    assignedDate: '2024-12-12',
    scheduledDate: '2024-12-16',
    status: 'Scheduled',
    technician: 'Mike Brown',
  },
  {
    id: '2',
    supplier: 'Spark Electrical',
    property: '45 Ponsonby Road, Ponsonby',
    workOrder: 'WO-2024-002',
    description: 'Rewiring kitchen and bathroom',
    assignedDate: '2024-12-10',
    scheduledDate: '2024-12-14',
    status: 'In Progress',
    technician: 'James Wilson',
  },
  {
    id: '3',
    supplier: 'Clean Team NZ',
    property: '78 Newmarket Ave, Newmarket',
    workOrder: 'WO-2024-003',
    description: 'End of tenancy deep clean',
    assignedDate: '2024-12-08',
    scheduledDate: '2024-12-12',
    status: 'Completed',
    technician: 'Sarah Lee',
  },
  {
    id: '4',
    supplier: 'Green Gardens',
    property: '200 Broadway, Newmarket',
    workOrder: 'WO-2024-004',
    description: 'Lawn maintenance and hedging',
    assignedDate: '2024-12-11',
    scheduledDate: '2024-12-15',
    status: 'Scheduled',
    technician: 'Tom Green',
  },
]

export function AssignmentsPage() {
  const { t } = useI18n()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = {
    total: mockAssignments.length,
    scheduled: mockAssignments.filter((a) => a.status === 'Scheduled').length,
    inProgress: mockAssignments.filter((a) => a.status === 'In Progress').length,
    completed: mockAssignments.filter((a) => a.status === 'Completed').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('suppliers.assignments.title')}</h1>
          <p className="text-muted-foreground">
            {t('suppliers.assignments.subtitle')}
          </p>
        </div>
        <Button variant="outline">
          {t('suppliers.assignments.exportReport')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{t('suppliers.assignments.stats.totalAssignments')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
            <p className="text-xs text-muted-foreground">{t('suppliers.assignments.stats.scheduled')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">{t('suppliers.assignments.stats.inProgress')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">{t('suppliers.assignments.stats.completed')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            {t('suppliers.assignments.workAssignments')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/30 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-muted-foreground">
                      {assignment.workOrder}
                    </span>
                    <Badge className={getStatusColor(assignment.status)}>
                      {t(`suppliers.assignments.status.${assignment.status === 'In Progress' ? 'inProgress' : assignment.status.toLowerCase()}`)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{assignment.supplier}</span>
                  </div>
                  <div className="text-sm">{assignment.description}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    {assignment.property}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {assignment.technician}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {t('suppliers.assignments.scheduledDate')}: {assignment.scheduledDate}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    {t('suppliers.assignments.viewDetails')}
                  </Button>
                  {assignment.status === 'In Progress' && (
                    <Button size="sm">
                      <Clock className="mr-1 h-4 w-4" />
                      {t('suppliers.assignments.markComplete')}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
