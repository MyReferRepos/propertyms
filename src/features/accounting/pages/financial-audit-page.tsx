import type { ColDef } from 'ag-grid-community'
import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Filter,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'

import { AgGridTable } from '@/components/data-table/ag-grid-table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FinancialAuditRecord } from '@/data/mock/audit'
import {
  financialAuditStatistics,
  mockFinancialAuditRecords,
} from '@/data/mock/audit'
import { useI18n } from '@/lib/i18n'

export function FinancialAuditPage() {
  const { t } = useI18n()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filteredRecords = useMemo(() => {
    return mockFinancialAuditRecords.filter((record) => {
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter
      const matchesType = typeFilter === 'all' || record.type === typeFilter
      return matchesStatus && matchesType
    })
  }, [statusFilter, typeFilter])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD',
    }).format(amount)
  }

  const StatusBadgeRenderer = ({ value }: { value: string }) => {
    const configs: Record<string, { color: string; icon: React.ReactNode }> = {
      verified: {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle2 className="mr-1 h-3 w-3" />,
      },
      pending: {
        color: 'bg-amber-100 text-amber-800',
        icon: <Clock className="mr-1 h-3 w-3" />,
      },
      flagged: {
        color: 'bg-red-100 text-red-800',
        icon: <AlertTriangle className="mr-1 h-3 w-3" />,
      },
    }
    const config = configs[value] || { color: 'bg-gray-100 text-gray-800', icon: null }
    return (
      <Badge className={`flex items-center ${config.color}`}>
        {config.icon}
        {t(`accounting.audit.financial.status.${value}`)}
      </Badge>
    )
  }

  const TypeBadgeRenderer = ({ value }: { value: string }) => {
    const colors: Record<string, string> = {
      income: 'bg-green-100 text-green-800',
      expense: 'bg-red-100 text-red-800',
    }
    return (
      <Badge className={colors[value] || 'bg-gray-100 text-gray-800'}>
        {t(`accounting.audit.financial.type.${value}`)}
      </Badge>
    )
  }

  const AmountRenderer = ({ data }: { data: FinancialAuditRecord }) => {
    const isIncome = data.type === 'income'
    return (
      <span className={isIncome ? 'text-green-600' : 'text-red-600'}>
        {isIncome ? '+' : '-'}
        {formatCurrency(data.amount)}
      </span>
    )
  }

  const columnDefs: ColDef<FinancialAuditRecord>[] = useMemo(
    () => [
      {
        field: 'transactionDate',
        headerName: t('accounting.audit.financial.columns.date'),
        valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
        width: 120,
      },
      {
        field: 'transactionId',
        headerName: t('accounting.audit.financial.columns.transactionId'),
        width: 140,
      },
      {
        field: 'type',
        headerName: t('accounting.audit.financial.columns.type'),
        cellRenderer: TypeBadgeRenderer,
        width: 100,
      },
      {
        field: 'category',
        headerName: t('accounting.audit.financial.columns.category'),
        width: 130,
      },
      {
        field: 'amount',
        headerName: t('accounting.audit.financial.columns.amount'),
        cellRenderer: AmountRenderer,
        width: 130,
      },
      {
        field: 'propertyAddress',
        headerName: t('accounting.audit.financial.columns.property'),
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'status',
        headerName: t('accounting.audit.financial.columns.status'),
        cellRenderer: StatusBadgeRenderer,
        width: 130,
      },
      {
        field: 'verifiedBy',
        headerName: t('accounting.audit.financial.columns.verifiedBy'),
        valueFormatter: ({ value }) => value || '-',
        width: 130,
      },
    ],
    [t]
  )

  const stats = financialAuditStatistics

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('accounting.audit.financial.title')}</h1>
        <p className="text-muted-foreground">{t('accounting.audit.financial.subtitle')}</p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('accounting.audit.financial.stats.totalIncome')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.verifiedCount} {t('accounting.audit.financial.stats.verified')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('accounting.audit.financial.stats.totalExpense')}
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.totalExpense)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingCount} {t('accounting.audit.financial.stats.pending')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('accounting.audit.financial.stats.netAmount')}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.netAmount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('accounting.audit.financial.stats.flagged')}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.flaggedCount}</div>
            <p className="text-xs text-muted-foreground">
              {t('accounting.audit.financial.stats.requiresAttention')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" />
            {t('accounting.audit.financial.filters.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('accounting.audit.financial.filters.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="verified">
                  {t('accounting.audit.financial.status.verified')}
                </SelectItem>
                <SelectItem value="pending">
                  {t('accounting.audit.financial.status.pending')}
                </SelectItem>
                <SelectItem value="flagged">
                  {t('accounting.audit.financial.status.flagged')}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('accounting.audit.financial.filters.type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="income">
                  {t('accounting.audit.financial.type.income')}
                </SelectItem>
                <SelectItem value="expense">
                  {t('accounting.audit.financial.type.expense')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <AgGridTable<FinancialAuditRecord>
            rowData={filteredRecords}
            columnDefs={columnDefs}
            height="500px"
            pagination
            paginationPageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}
