import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Phone, Mail, MoreHorizontal } from 'lucide-react'

export function LeadsPage() {
  const { t } = useI18n()

  const leads = [
    {
      id: 1,
      name: 'James Wilson',
      phone: '+64 21 123 4567',
      email: 'james.wilson@email.com',
      source: 'Website',
      interestLevel: 'hot',
      status: 'contacted',
      lastContact: '2024-12-13',
    },
    {
      id: 2,
      name: 'Sarah Chen',
      phone: '+64 22 234 5678',
      email: 'sarah.chen@email.com',
      source: 'Referral',
      interestLevel: 'warm',
      status: 'new',
      lastContact: null,
    },
    {
      id: 3,
      name: 'Michael Brown',
      phone: '+64 27 345 6789',
      email: 'm.brown@email.com',
      source: 'TradeMe',
      interestLevel: 'hot',
      status: 'contacted',
      lastContact: '2024-12-12',
    },
    {
      id: 4,
      name: 'Emily Davis',
      phone: '+64 21 456 7890',
      email: 'emily.d@email.com',
      source: 'Social Media',
      interestLevel: 'cold',
      status: 'contacted',
      lastContact: '2024-12-01',
    },
  ]

  const getInterestBadge = (level: string) => {
    switch (level) {
      case 'hot':
        return <Badge className="bg-red-100 text-red-800">{t('marketing.leads.interestLevel.hot')}</Badge>
      case 'warm':
        return <Badge className="bg-orange-100 text-orange-800">{t('marketing.leads.interestLevel.warm')}</Badge>
      case 'cold':
        return <Badge className="bg-blue-100 text-blue-800">{t('marketing.leads.interestLevel.cold')}</Badge>
      default:
        return <Badge>{level}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-green-100 text-green-800">{t('marketing.leads.status.new')}</Badge>
      case 'contacted':
        return <Badge className="bg-blue-100 text-blue-800">{t('marketing.leads.status.contacted')}</Badge>
      case 'converted':
        return <Badge className="bg-purple-100 text-purple-800">{t('marketing.leads.status.converted')}</Badge>
      case 'lost':
        return <Badge className="bg-gray-100 text-gray-800">{t('marketing.leads.status.lost')}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('marketing.leads.title')}</h1>
          <p className="text-muted-foreground">
            {t('marketing.leads.subtitle')}
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t('marketing.leads.addLead')}
        </Button>
      </div>

      {/* Leads List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('marketing.leads.leadList')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="font-medium">{lead.name}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {lead.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {lead.email}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('marketing.leads.source')}: {lead.source}
                    {lead.lastContact && ` | ${t('marketing.leads.lastContact')}: ${lead.lastContact}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {getInterestBadge(lead.interestLevel)}
                  {getStatusBadge(lead.status)}
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
