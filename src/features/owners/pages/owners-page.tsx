import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Phone, Mail, Building2, MoreHorizontal } from 'lucide-react'

export function OwnersPage() {
  const { t } = useI18n()

  const owners = [
    {
      id: 1,
      name: 'John Anderson',
      phone: '+64 21 123 4567',
      email: 'john.anderson@email.com',
      properties: 5,
      status: 'active',
      monthlyIncome: '$12,500',
    },
    {
      id: 2,
      name: 'Mary Johnson',
      phone: '+64 22 234 5678',
      email: 'mary.j@email.com',
      properties: 3,
      status: 'active',
      monthlyIncome: '$7,800',
    },
    {
      id: 3,
      name: 'Peter Smith',
      phone: '+64 27 345 6789',
      email: 'p.smith@email.com',
      properties: 8,
      status: 'active',
      monthlyIncome: '$21,200',
    },
    {
      id: 4,
      name: 'Susan Williams',
      phone: '+64 21 456 7890',
      email: 's.williams@email.com',
      properties: 2,
      status: 'inactive',
      monthlyIncome: '$0',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('owners.title')}</h1>
          <p className="text-muted-foreground">
            {t('owners.subtitle')}
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t('owners.addOwner')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('owners.stats.totalOwners')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('owners.stats.activeOwners')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">235</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('owners.stats.totalProperties')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">412</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('owners.stats.monthlyRevenue')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">$156,800</div>
          </CardContent>
        </Card>
      </div>

      {/* Owners List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('owners.ownerList')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {owners.map((owner) => (
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
                      {owner.properties} {t('owners.properties')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{owner.monthlyIncome}/{t('owners.perMonth')}</span>
                  <Badge
                    className={
                      owner.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {t(`owners.status.${owner.status}`)}
                  </Badge>
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
