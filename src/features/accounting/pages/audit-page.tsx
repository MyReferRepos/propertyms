import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ClipboardList, FileText, Shield, History } from 'lucide-react'

export function AuditPage() {
  const { t } = useI18n()

  const auditLogs = [
    {
      id: 1,
      action: 'Property Created',
      user: 'John Smith',
      entity: 'Property #P-2024-089',
      timestamp: '2024-12-14 10:30:00',
      type: 'create',
    },
    {
      id: 2,
      action: 'Tenancy Updated',
      user: 'Sarah Johnson',
      entity: 'Tenancy #T-2024-156',
      timestamp: '2024-12-14 09:15:00',
      type: 'update',
    },
    {
      id: 3,
      action: 'Payment Recorded',
      user: 'Mike Wilson',
      entity: 'Payment #PAY-2024-4521',
      timestamp: '2024-12-14 08:45:00',
      type: 'create',
    },
    {
      id: 4,
      action: 'Document Deleted',
      user: 'Emma Brown',
      entity: 'Document #DOC-2024-782',
      timestamp: '2024-12-13 16:20:00',
      type: 'delete',
    },
  ]

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'create':
        return <Badge className="bg-green-100 text-green-800">Create</Badge>
      case 'update':
        return <Badge className="bg-blue-100 text-blue-800">Update</Badge>
      case 'delete':
        return <Badge className="bg-red-100 text-red-800">Delete</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('nav.accounting.audit')}</h1>
        <p className="text-muted-foreground">
          Audit logs and compliance reports
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,458</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Create Actions</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">4,521</div>
            <p className="text-xs text-muted-foreground">36.3% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Update Actions</CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">6,892</div>
            <p className="text-xs text-muted-foreground">55.3% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">98.5%</div>
            <p className="text-xs text-muted-foreground">Excellent</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="font-medium">{log.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {log.entity} by {log.user}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {getTypeBadge(log.type)}
                  <span className="text-sm text-muted-foreground">
                    {log.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
