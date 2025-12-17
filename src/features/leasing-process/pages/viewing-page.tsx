import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Plus, Calendar, Clock, User, MapPin } from 'lucide-react'

const mockViewings = [
  {
    id: '1',
    property: '123 Queen Street, Auckland CBD',
    tenant: 'John Smith',
    date: '2024-12-15',
    time: '10:00 AM',
    status: 'Scheduled',
  },
  {
    id: '2',
    property: '45 Ponsonby Road, Ponsonby',
    tenant: 'Sarah Johnson',
    date: '2024-12-15',
    time: '2:00 PM',
    status: 'Confirmed',
  },
  {
    id: '3',
    property: '78 Newmarket Ave, Newmarket',
    tenant: 'Mike Chen',
    date: '2024-12-14',
    time: '11:00 AM',
    status: 'Completed',
  },
  {
    id: '4',
    property: '200 Broadway, Newmarket',
    tenant: 'Emma Wilson',
    date: '2024-12-16',
    time: '3:30 PM',
    status: 'Scheduled',
  },
  {
    id: '5',
    property: '123 Queen Street, Auckland CBD',
    tenant: 'David Brown',
    date: '2024-12-14',
    time: '4:00 PM',
    status: 'No Show',
  },
]

export function ViewingPage() {
  const { t } = useI18n()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'Confirmed':
        return 'bg-green-100 text-green-800'
      case 'Completed':
        return 'bg-gray-100 text-gray-800'
      case 'No Show':
        return 'bg-red-100 text-red-800'
      case 'Cancelled':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const todayViewings = mockViewings.filter((v) => v.date === '2024-12-15')
  const upcomingViewings = mockViewings.filter(
    (v) => v.date > '2024-12-15' && v.status !== 'Completed' && v.status !== 'No Show'
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('leasingProcess.viewing.title')}</h1>
          <p className="text-muted-foreground">
            {t('leasingProcess.viewing.subtitle')}
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t('leasingProcess.viewing.scheduleViewing')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{todayViewings.length}</div>
            <p className="text-xs text-muted-foreground">{t('leasingProcess.viewing.stats.todayViewings')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{upcomingViewings.length}</div>
            <p className="text-xs text-muted-foreground">{t('leasingProcess.viewing.stats.upcoming')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">{t('leasingProcess.viewing.stats.showRate')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">{t('leasingProcess.viewing.stats.thisMonth')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('leasingProcess.viewing.todaySchedule')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayViewings.length > 0 ? (
            <div className="space-y-4">
              {todayViewings.map((viewing) => (
                <div
                  key={viewing.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{viewing.property}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {viewing.tenant}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {viewing.time}
                      </span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(viewing.status)}>
                    {t(`leasingProcess.viewing.status.${viewing.status === 'No Show' ? 'noShow' : viewing.status.toLowerCase()}`)}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Eye className="h-12 w-12 mb-2" />
              <p>{t('leasingProcess.viewing.noViewingsToday')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Viewings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('leasingProcess.viewing.allViewings')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockViewings.map((viewing) => (
              <div
                key={viewing.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/30 transition-colors cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{viewing.property}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {viewing.tenant}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {viewing.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {viewing.time}
                    </span>
                  </div>
                </div>
                <Badge className={getStatusColor(viewing.status)}>
                  {t(`leasingProcess.viewing.status.${viewing.status === 'No Show' ? 'noShow' : viewing.status.toLowerCase()}`)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
