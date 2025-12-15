import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Flame, TrendingUp, UserCircle, Calendar } from 'lucide-react'

export function MarketingPage() {
  const { t } = useI18n()

  const stats = [
    {
      title: 'Total Leads',
      value: '248',
      change: '+18',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Hot Leads',
      value: '32',
      change: '+5',
      icon: Flame,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Conversion Rate',
      value: '24.5%',
      change: '+2.3%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Old Owners',
      value: '156',
      change: '+8',
      icon: UserCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'This Month',
      value: '42',
      change: '+12',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('nav.marketing')}</h1>
        <p className="text-muted-foreground">
          Marketing leads and old owner management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-full p-2 ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600">{stat.change} this month</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Links */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Potential Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Manage and track potential property owners from marketing campaigns.
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              Old Owners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Re-engage with previous property owners and track win-back campaigns.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
