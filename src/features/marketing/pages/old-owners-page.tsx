import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, Phone, Mail, MoreHorizontal, Building2 } from 'lucide-react'

export function OldOwnersPage() {
  const { t } = useI18n()

  const oldOwners = [
    {
      id: 1,
      name: 'David Thompson',
      phone: '+64 21 111 2222',
      email: 'd.thompson@email.com',
      previousProperties: 3,
      leftDate: '2024-06-15',
      reason: 'Sold properties',
      reengagementStatus: 'not_started',
    },
    {
      id: 2,
      name: 'Lisa Wang',
      phone: '+64 22 333 4444',
      email: 'lisa.w@email.com',
      previousProperties: 1,
      leftDate: '2024-08-20',
      reason: 'Moved overseas',
      reengagementStatus: 'in_progress',
    },
    {
      id: 3,
      name: 'Robert Miller',
      phone: '+64 27 555 6666',
      email: 'r.miller@email.com',
      previousProperties: 5,
      leftDate: '2024-03-10',
      reason: 'Competitor offer',
      reengagementStatus: 'won_back',
    },
    {
      id: 4,
      name: 'Jennifer Lee',
      phone: '+64 21 777 8888',
      email: 'j.lee@email.com',
      previousProperties: 2,
      leftDate: '2024-09-01',
      reason: 'Self management',
      reengagementStatus: 'not_interested',
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'not_started':
        return <Badge variant="outline">Not Started</Badge>
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case 'won_back':
        return <Badge className="bg-green-100 text-green-800">Won Back</Badge>
      case 'not_interested':
        return <Badge className="bg-gray-100 text-gray-800">Not Interested</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('nav.marketing.oldOwners')}</h1>
          <p className="text-muted-foreground">
            Re-engage with previous property owners
          </p>
        </div>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Start Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Old Owners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Won Back</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">45</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Win-back Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">14.7%</div>
          </CardContent>
        </Card>
      </div>

      {/* Old Owners List */}
      <Card>
        <CardHeader>
          <CardTitle>Old Owner List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {oldOwners.map((owner) => (
              <div
                key={owner.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="font-medium">{owner.name}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {owner.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {owner.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {owner.previousProperties} properties
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Left: {owner.leftDate} | Reason: {owner.reason}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(owner.reengagementStatus)}
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
