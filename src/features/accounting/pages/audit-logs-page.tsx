import type { ColDef } from 'ag-grid-community'
import { useMemo, useState } from 'react'
import { Eye, Filter, Search } from 'lucide-react'

import { AgGridTable } from '@/components/data-table/ag-grid-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AuditLog } from '@/data/mock/audit'
import { mockAuditLogs } from '@/data/mock/audit'
import { useI18n } from '@/lib/i18n'

export function AuditLogsPage() {
  const { t } = useI18n()
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [entityFilter, setEntityFilter] = useState<string>('all')
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const filteredLogs = useMemo(() => {
    return mockAuditLogs.filter((log) => {
      const matchesSearch =
        searchTerm === '' ||
        log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesAction = actionFilter === 'all' || log.action === actionFilter
      const matchesEntity = entityFilter === 'all' || log.entityType === entityFilter

      return matchesSearch && matchesAction && matchesEntity
    })
  }, [searchTerm, actionFilter, entityFilter])

  const ActionBadgeRenderer = ({ value }: { value: string }) => {
    const colors: Record<string, string> = {
      create: 'bg-green-100 text-green-800',
      update: 'bg-blue-100 text-blue-800',
      delete: 'bg-red-100 text-red-800',
      view: 'bg-gray-100 text-gray-800',
      export: 'bg-purple-100 text-purple-800',
    }
    return (
      <Badge className={colors[value] || 'bg-gray-100 text-gray-800'}>
        {t(`accounting.audit.type.${value}`)}
      </Badge>
    )
  }

  const EntityTypeBadgeRenderer = ({ value }: { value: string }) => {
    const colors: Record<string, string> = {
      property: 'bg-indigo-100 text-indigo-800',
      tenancy: 'bg-cyan-100 text-cyan-800',
      tenant: 'bg-amber-100 text-amber-800',
      payment: 'bg-emerald-100 text-emerald-800',
      document: 'bg-rose-100 text-rose-800',
      user: 'bg-violet-100 text-violet-800',
    }
    return (
      <Badge className={colors[value] || 'bg-gray-100 text-gray-800'}>
        {t(`accounting.audit.entityType.${value}`)}
      </Badge>
    )
  }

  const columnDefs: ColDef<AuditLog>[] = useMemo(
    () => [
      {
        field: 'timestamp',
        headerName: t('accounting.audit.logs.columns.timestamp'),
        valueFormatter: ({ value }) => new Date(value).toLocaleString(),
        width: 180,
      },
      {
        field: 'userName',
        headerName: t('accounting.audit.logs.columns.user'),
        width: 150,
      },
      {
        field: 'action',
        headerName: t('accounting.audit.logs.columns.action'),
        cellRenderer: ActionBadgeRenderer,
        width: 120,
      },
      {
        field: 'entityType',
        headerName: t('accounting.audit.logs.columns.entityType'),
        cellRenderer: EntityTypeBadgeRenderer,
        width: 120,
      },
      {
        field: 'entityName',
        headerName: t('accounting.audit.logs.columns.entity'),
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'ipAddress',
        headerName: t('accounting.audit.logs.columns.ipAddress'),
        width: 140,
      },
      {
        headerName: t('common.actions'),
        width: 100,
        cellRenderer: ({ data }: { data: AuditLog }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedLog(data)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        ),
        sortable: false,
        filter: false,
      },
    ],
    [t]
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('accounting.audit.logs.title')}</h1>
        <p className="text-muted-foreground">{t('accounting.audit.logs.subtitle')}</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" />
            {t('accounting.audit.logs.filters.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('accounting.audit.logs.filters.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('accounting.audit.logs.filters.action')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="create">{t('accounting.audit.type.create')}</SelectItem>
                <SelectItem value="update">{t('accounting.audit.type.update')}</SelectItem>
                <SelectItem value="delete">{t('accounting.audit.type.delete')}</SelectItem>
                <SelectItem value="view">{t('accounting.audit.type.view')}</SelectItem>
                <SelectItem value="export">{t('accounting.audit.type.export')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('accounting.audit.logs.filters.entityType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="property">{t('accounting.audit.entityType.property')}</SelectItem>
                <SelectItem value="tenancy">{t('accounting.audit.entityType.tenancy')}</SelectItem>
                <SelectItem value="tenant">{t('accounting.audit.entityType.tenant')}</SelectItem>
                <SelectItem value="payment">{t('accounting.audit.entityType.payment')}</SelectItem>
                <SelectItem value="document">{t('accounting.audit.entityType.document')}</SelectItem>
                <SelectItem value="user">{t('accounting.audit.entityType.user')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <AgGridTable<AuditLog>
            rowData={filteredLogs}
            columnDefs={columnDefs}
            height="500px"
            pagination
            paginationPageSize={10}
          />
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('accounting.audit.logs.detail.title')}</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('accounting.audit.logs.columns.timestamp')}
                  </p>
                  <p>{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('accounting.audit.logs.columns.user')}
                  </p>
                  <p>{selectedLog.userName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('accounting.audit.logs.columns.action')}
                  </p>
                  <ActionBadgeRenderer value={selectedLog.action} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('accounting.audit.logs.columns.entityType')}
                  </p>
                  <EntityTypeBadgeRenderer value={selectedLog.entityType} />
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('accounting.audit.logs.columns.entity')}
                  </p>
                  <p>{selectedLog.entityName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('accounting.audit.logs.columns.ipAddress')}
                  </p>
                  <p>{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('accounting.audit.logs.detail.userAgent')}
                  </p>
                  <p className="text-sm">{selectedLog.userAgent}</p>
                </div>
              </div>

              {selectedLog.changes && selectedLog.changes.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    {t('accounting.audit.logs.detail.changes')}
                  </p>
                  <div className="rounded-lg border">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            {t('accounting.audit.logs.detail.field')}
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            {t('accounting.audit.logs.detail.oldValue')}
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            {t('accounting.audit.logs.detail.newValue')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedLog.changes.map((change, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2 text-sm">{change.field}</td>
                            <td className="px-4 py-2 text-sm text-red-600">
                              {change.oldValue}
                            </td>
                            <td className="px-4 py-2 text-sm text-green-600">
                              {change.newValue}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
