import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, User, MapPin, Calendar, Download, Send, CheckCircle } from 'lucide-react'

const mockAgreements = [
  {
    id: '1',
    tenant: 'Sarah Johnson',
    property: '45 Ponsonby Road, Ponsonby',
    startDate: '2024-12-20',
    endDate: '2025-12-19',
    rent: 850,
    status: 'Signed',
    signedDate: '2024-12-14',
  },
  {
    id: '2',
    tenant: 'John Smith',
    property: '123 Queen Street, Auckland CBD',
    startDate: '2024-12-22',
    endDate: '2025-12-21',
    rent: 650,
    status: 'Awaiting Signature',
    signedDate: null,
  },
  {
    id: '3',
    tenant: 'Mike Chen',
    property: '78 Newmarket Ave, Newmarket',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    rent: 480,
    status: 'Draft',
    signedDate: null,
  },
  {
    id: '4',
    tenant: 'Emma Wilson',
    property: '200 Broadway, Newmarket',
    startDate: '2025-01-05',
    endDate: '2026-01-04',
    rent: 720,
    status: 'Awaiting Signature',
    signedDate: null,
  },
]

export function AgreementsPage() {
  const { t } = useI18n()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Signed':
        return 'bg-green-100 text-green-800'
      case 'Awaiting Signature':
        return 'bg-yellow-100 text-yellow-800'
      case 'Draft':
        return 'bg-gray-100 text-gray-800'
      case 'Expired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = {
    total: mockAgreements.length,
    signed: mockAgreements.filter((a) => a.status === 'Signed').length,
    awaiting: mockAgreements.filter((a) => a.status === 'Awaiting Signature').length,
    draft: mockAgreements.filter((a) => a.status === 'Draft').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('leasingProcess.agreements.title')}</h1>
          <p className="text-muted-foreground">
            {t('leasingProcess.agreements.subtitle')}
          </p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          {t('leasingProcess.agreements.createAgreement')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{t('leasingProcess.agreements.stats.totalAgreements')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.signed}</div>
            <p className="text-xs text-muted-foreground">{t('leasingProcess.agreements.stats.signed')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.awaiting}</div>
            <p className="text-xs text-muted-foreground">{t('leasingProcess.agreements.stats.awaitingSignature')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
            <p className="text-xs text-muted-foreground">{t('leasingProcess.agreements.stats.drafts')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Agreements List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('leasingProcess.agreements.tenancyAgreements')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAgreements.map((agreement) => (
              <div
                key={agreement.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/30 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold">{agreement.tenant}</span>
                    <Badge className={getStatusColor(agreement.status)}>
                      {t(`leasingProcess.agreements.status.${agreement.status === 'Awaiting Signature' ? 'awaitingSignature' : agreement.status.toLowerCase()}`)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {agreement.property}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {agreement.startDate} - {agreement.endDate}
                    </span>
                    <span className="font-medium text-foreground">
                      ${agreement.rent}/week
                    </span>
                    {agreement.signedDate && (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        {t('leasingProcess.agreements.signedDate')}: {agreement.signedDate}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-1 h-4 w-4" />
                    {t('leasingProcess.agreements.download')}
                  </Button>
                  {agreement.status === 'Awaiting Signature' && (
                    <Button variant="outline" size="sm">
                      <Send className="mr-1 h-4 w-4" />
                      {t('leasingProcess.agreements.resend')}
                    </Button>
                  )}
                  {agreement.status === 'Draft' && (
                    <Button size="sm">
                      <Send className="mr-1 h-4 w-4" />
                      {t('leasingProcess.agreements.sendForSignature')}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
