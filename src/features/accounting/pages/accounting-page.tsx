import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calendar,
  Building,
} from 'lucide-react'

export function AccountingPage() {
  const { t } = useI18n()

  const stats = [
    {
      title: 'Total Income',
      titleZh: '总收入',
      value: '$128,450',
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Expense',
      titleZh: '总支出',
      value: '$45,230',
      change: '+5.2%',
      trend: 'up',
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Net Profit',
      titleZh: '净利润',
      value: '$83,220',
      change: '+18.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Outstanding',
      titleZh: '待收款',
      value: '$12,800',
      change: '-8.1%',
      trend: 'down',
      icon: CreditCard,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'This Month',
      titleZh: '本月收入',
      value: '$24,500',
      change: '+22.4%',
      trend: 'up',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Bank Balance',
      titleZh: '银行余额',
      value: '$156,780',
      change: '+15.2%',
      trend: 'up',
      icon: Building,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('accounting.title')}</h1>
        <p className="text-muted-foreground">
          {t('accounting.subtitle')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t(`accounting.stats.${stat.title.toLowerCase().replace(' ', '')}`)}
                </CardTitle>
                <div className={`rounded-full p-2 ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p
                  className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {stat.change} {t('accounting.stats.fromLastMonth')}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Placeholder sections */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('accounting.recentTransactions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('accounting.transactionListPlaceholder')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('accounting.pendingInvoices')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('accounting.invoiceListPlaceholder')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
