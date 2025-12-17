import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, User, MapPin, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'

const mockApplications = [
  {
    id: '1',
    applicant: 'John Smith',
    property: '123 Queen Street, Auckland CBD',
    submittedDate: '2024-12-10',
    status: 'Under Review',
    creditCheck: 'Passed',
    references: 2,
  },
  {
    id: '2',
    applicant: 'Sarah Johnson',
    property: '45 Ponsonby Road, Ponsonby',
    submittedDate: '2024-12-12',
    status: 'Approved',
    creditCheck: 'Passed',
    references: 3,
  },
  {
    id: '3',
    applicant: 'Mike Chen',
    property: '78 Newmarket Ave, Newmarket',
    submittedDate: '2024-12-11',
    status: 'Pending Documents',
    creditCheck: 'Pending',
    references: 1,
  },
  {
    id: '4',
    applicant: 'Emma Wilson',
    property: '200 Broadway, Newmarket',
    submittedDate: '2024-12-13',
    status: 'Under Review',
    creditCheck: 'Passed',
    references: 2,
  },
  {
    id: '5',
    applicant: 'David Brown',
    property: '123 Queen Street, Auckland CBD',
    submittedDate: '2024-12-09',
    status: 'Rejected',
    creditCheck: 'Failed',
    references: 1,
  },
]

export function ApplicationsPage() {
  const { t } = useI18n()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800'
      case 'Under Review':
        return 'bg-blue-100 text-blue-800'
      case 'Pending Documents':
        return 'bg-yellow-100 text-yellow-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCreditIcon = (status: string) => {
    switch (status) {
      case 'Passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'Failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  const stats = {
    total: mockApplications.length,
    underReview: mockApplications.filter((a) => a.status === 'Under Review').length,
    approved: mockApplications.filter((a) => a.status === 'Approved').length,
    pending: mockApplications.filter((a) => a.status === 'Pending Documents').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('leasingProcess.applications.title')}</h1>
          <p className="text-muted-foreground">
            {t('leasingProcess.applications.subtitle')}
          </p>
        </div>
        <Button variant="outline">
          {t('leasingProcess.applications.exportApplications')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{t('leasingProcess.applications.stats.totalApplications')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.underReview}</div>
            <p className="text-xs text-muted-foreground">{t('leasingProcess.applications.stats.underReview')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">{t('leasingProcess.applications.stats.approved')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">{t('leasingProcess.applications.stats.pendingDocuments')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('leasingProcess.applications.applicationsTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockApplications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/30 transition-colors cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold">{application.applicant}</span>
                    <Badge className={getStatusColor(application.status)}>
                      {t(`leasingProcess.applications.status.${application.status === 'Under Review' ? 'underReview' : application.status === 'Pending Documents' ? 'pendingDocuments' : application.status.toLowerCase()}`)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {application.property}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {t('leasingProcess.applications.submitted')}: {application.submittedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      {getCreditIcon(application.creditCheck)}
                      {t('leasingProcess.applications.credit')}: {t(`leasingProcess.applications.creditCheck.${application.creditCheck.toLowerCase()}`)}
                    </span>
                    <span>
                      {t('leasingProcess.applications.references')}: {application.references}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    {t('leasingProcess.applications.viewDetails')}
                  </Button>
                  {application.status === 'Under Review' && (
                    <>
                      <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                        {t('leasingProcess.applications.approve')}
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        {t('leasingProcess.applications.reject')}
                      </Button>
                    </>
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
