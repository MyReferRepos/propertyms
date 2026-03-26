import { useState } from 'react'
import {
  ArrowRight,
  Building2,
  Clock,
  FileText,
  Filter,
  User,
  Users,
  Wallet,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockChangeRecords } from '@/data/mock/audit'
import { useI18n } from '@/lib/i18n'

export function ChangeTrackingPage() {
  const { t } = useI18n()
  const [entityFilter, setEntityFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRecords = mockChangeRecords.filter((record) => {
    const matchesEntity = entityFilter === 'all' || record.entityType === entityFilter
    const matchesSearch =
      searchTerm === '' ||
      record.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.changedBy.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesEntity && matchesSearch
  })

  // Group records by date
  const groupedRecords = filteredRecords.reduce(
    (groups, record) => {
      const date = new Date(record.changedAt).toLocaleDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(record)
      return groups
    },
    {} as Record<string, typeof filteredRecords>
  )

  const getEntityIcon = (entityType: string) => {
    const icons: Record<string, React.ElementType> = {
      property: Building2,
      tenancy: FileText,
      tenant: Users,
      payment: Wallet,
      document: FileText,
      user: User,
    }
    const Icon = icons[entityType] || FileText
    return <Icon className="h-4 w-4" />
  }

  const getChangeTypeBadge = (changeType: string) => {
    const colors: Record<string, string> = {
      field_update: 'bg-blue-100 text-blue-800',
      status_change: 'bg-amber-100 text-amber-800',
      ownership_transfer: 'bg-purple-100 text-purple-800',
    }
    return (
      <Badge className={colors[changeType] || 'bg-gray-100 text-gray-800'}>
        {t(`accounting.audit.changes.changeType.${changeType}`)}
      </Badge>
    )
  }

  const getEntityTypeBadge = (entityType: string) => {
    const colors: Record<string, string> = {
      property: 'bg-indigo-100 text-indigo-800',
      tenancy: 'bg-cyan-100 text-cyan-800',
      tenant: 'bg-amber-100 text-amber-800',
      payment: 'bg-emerald-100 text-emerald-800',
      document: 'bg-rose-100 text-rose-800',
      user: 'bg-violet-100 text-violet-800',
    }
    return (
      <Badge className={colors[entityType] || 'bg-gray-100 text-gray-800'}>
        {t(`accounting.audit.entityType.${entityType}`)}
      </Badge>
    )
  }

  // Statistics
  const stats = {
    total: mockChangeRecords.length,
    fieldUpdates: mockChangeRecords.filter((r) => r.changeType === 'field_update').length,
    statusChanges: mockChangeRecords.filter((r) => r.changeType === 'status_change').length,
    ownershipTransfers: mockChangeRecords.filter(
      (r) => r.changeType === 'ownership_transfer'
    ).length,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('accounting.audit.changes.title')}</h1>
        <p className="text-muted-foreground">{t('accounting.audit.changes.subtitle')}</p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('accounting.audit.changes.stats.total')}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('accounting.audit.changes.stats.fieldUpdates')}
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.fieldUpdates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('accounting.audit.changes.stats.statusChanges')}
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.statusChanges}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('accounting.audit.changes.stats.ownershipTransfers')}
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.ownershipTransfers}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" />
            {t('accounting.audit.changes.filters.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Input
              placeholder={t('accounting.audit.changes.filters.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('accounting.audit.changes.filters.entityType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="property">
                  {t('accounting.audit.entityType.property')}
                </SelectItem>
                <SelectItem value="tenancy">
                  {t('accounting.audit.entityType.tenancy')}
                </SelectItem>
                <SelectItem value="tenant">{t('accounting.audit.entityType.tenant')}</SelectItem>
                <SelectItem value="payment">
                  {t('accounting.audit.entityType.payment')}
                </SelectItem>
                <SelectItem value="document">
                  {t('accounting.audit.entityType.document')}
                </SelectItem>
                <SelectItem value="user">{t('accounting.audit.entityType.user')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-6">
        {Object.entries(groupedRecords).map(([date, records]) => (
          <div key={date}>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Clock className="h-4 w-4" />
              {date}
            </h3>
            <div className="relative ml-2 space-y-4 border-l-2 border-muted pl-6">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="relative before:absolute before:-left-[25px] before:top-3 before:h-2 before:w-2 before:rounded-full before:bg-primary"
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getEntityIcon(record.entityType)}
                            <span className="font-semibold">{record.entityName}</span>
                            {getEntityTypeBadge(record.entityType)}
                            {getChangeTypeBadge(record.changeType)}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">{record.field}:</span>
                            <span className="rounded bg-red-50 px-2 py-0.5 text-red-700 line-through">
                              {record.oldValue}
                            </span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <span className="rounded bg-green-50 px-2 py-0.5 text-green-700">
                              {record.newValue}
                            </span>
                          </div>
                          {record.reason && (
                            <p className="text-sm text-muted-foreground">
                              {t('accounting.audit.changes.reason')}: {record.reason}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{record.changedBy}</p>
                          <p>{new Date(record.changedAt).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
