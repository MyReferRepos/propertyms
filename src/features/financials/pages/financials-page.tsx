import { useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

interface Transaction {
  id: string
  date: string
  type: 'income' | 'expense'
  category: string
  amount: number
  description: string
  propertyId: string
  status: 'completed' | 'pending' | 'failed'
}

const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    date: '2024-11-20',
    type: 'income',
    category: 'Rent Payment',
    amount: 2800,
    description: 'Weekly rent - Property prop-001',
    propertyId: 'prop-001',
    status: 'completed',
  },
  {
    id: 'txn-002',
    date: '2024-11-19',
    type: 'expense',
    category: 'Maintenance',
    amount: 150,
    description: 'Plumbing repair - Kitchen tap',
    propertyId: 'prop-001',
    status: 'completed',
  },
  {
    id: 'txn-003',
    date: '2024-11-18',
    type: 'income',
    category: 'Rent Payment',
    amount: 2380,
    description: 'Weekly rent - Property prop-002',
    propertyId: 'prop-002',
    status: 'completed',
  },
  {
    id: 'txn-004',
    date: '2024-11-17',
    type: 'expense',
    category: 'Insurance',
    amount: 450,
    description: 'Monthly property insurance',
    propertyId: 'prop-001',
    status: 'completed',
  },
  {
    id: 'txn-005',
    date: '2024-11-15',
    type: 'expense',
    category: 'Maintenance',
    amount: 120,
    description: 'Gutter cleaning service',
    propertyId: 'prop-001',
    status: 'completed',
  },
]

export function FinancialsPage() {
  const { t } = useI18n()
  const [transactions] = useState<Transaction[]>(mockTransactions)
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

  const filteredTransactions = transactions.filter((t) =>
    filter === 'all' ? true : t.type === filter
  )

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const netIncome = totalIncome - totalExpenses

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
          <h1 className="text-3xl font-bold tracking-tight">{t('financials.title')}</h1>
          <p className="text-muted-foreground">{t('financials.subtitle')}</p>
        </div>
        <Button>
          <DollarSign className="mr-2 h-4 w-4" />
          {t('financials.addTransaction')}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('financials.summary.totalIncome')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('financials.transactionCount', { count: transactions.filter((t) => t.type === 'income').length })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('financials.summary.totalExpenses')}</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('financials.transactionCount', { count: transactions.filter((t) => t.type === 'expense').length })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('financials.summary.netIncome')}</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={cn('text-2xl font-bold', netIncome >= 0 ? 'text-green-600' : 'text-red-600')}>
              {formatCurrency(netIncome)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{t('financials.periods.thisPeriod')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          {t('financials.filters.all')}
        </Button>
        <Button
          variant={filter === 'income' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('income')}
        >
          {t('financials.filters.income')}
        </Button>
        <Button
          variant={filter === 'expense' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('expense')}
        >
          {t('financials.filters.expense')}
        </Button>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('financials.transactions.title')}</CardTitle>
          <CardDescription>{t('financials.transactions.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full',
                      transaction.type === 'income'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    )}
                  >
                    {transaction.type === 'income' ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{transaction.category}</p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.propertyId}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{transaction.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={cn(
                      'text-lg font-bold',
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(transaction.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
