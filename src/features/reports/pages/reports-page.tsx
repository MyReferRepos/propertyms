import { BarChart3, Download, FileText, TrendingUp, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from '@tanstack/react-router'
import { useI18n } from '@/lib/i18n'

interface Report {
  id: string
  name: string
  description: string
  category: 'financial' | 'operational' | 'compliance' | 'performance'
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'on-demand'
  lastGenerated?: string
}

const availableReports: Report[] = [
  {
    id: 'rep-rental-price',
    name: 'Rental Price Analysis',
    description: 'Market analysis and pricing recommendations for landlords and tenants',
    category: 'performance',
    frequency: 'on-demand',
  },
  {
    id: 'rep-001',
    name: 'Rental Income Summary',
    description: 'Comprehensive overview of rental income across all properties',
    category: 'financial',
    frequency: 'monthly',
    lastGenerated: '2024-11-01',
  },
  {
    id: 'rep-002',
    name: 'Expense Report',
    description: 'Detailed breakdown of property-related expenses and maintenance costs',
    category: 'financial',
    frequency: 'monthly',
    lastGenerated: '2024-11-01',
  },
  {
    id: 'rep-003',
    name: 'Occupancy Rate Report',
    description: 'Analysis of property occupancy rates and vacancy trends',
    category: 'operational',
    frequency: 'monthly',
    lastGenerated: '2024-11-01',
  },
  {
    id: 'rep-004',
    name: 'Maintenance Summary',
    description: 'Summary of maintenance requests, costs, and completion rates',
    category: 'operational',
    frequency: 'monthly',
    lastGenerated: '2024-11-01',
  },
  {
    id: 'rep-005',
    name: 'Compliance Status Report',
    description: 'Overview of Healthy Homes compliance across all properties',
    category: 'compliance',
    frequency: 'quarterly',
    lastGenerated: '2024-10-01',
  },
  {
    id: 'rep-006',
    name: 'Portfolio Performance',
    description: 'ROI, rental yield, and investment performance analysis',
    category: 'performance',
    frequency: 'quarterly',
    lastGenerated: '2024-10-01',
  },
  {
    id: 'rep-007',
    name: 'Tenant Payment History',
    description: 'Detailed record of tenant payments and arrears',
    category: 'financial',
    frequency: 'on-demand',
  },
  {
    id: 'rep-008',
    name: 'Property Valuation Report',
    description: 'Current market valuations and capital gains analysis',
    category: 'performance',
    frequency: 'annual',
    lastGenerated: '2024-01-01',
  },
]

const categoryColors = {
  financial: 'bg-green-100 text-green-700',
  operational: 'bg-blue-100 text-blue-700',
  compliance: 'bg-purple-100 text-purple-700',
  performance: 'bg-orange-100 text-orange-700',
}

const frequencyLabels = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annual: 'Annual',
  'on-demand': 'On Demand',
}

export function ReportsPage() {
  const { t } = useI18n()
  const navigate = useNavigate()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NZ', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const handleGenerateReport = (reportId: string) => {
    if (reportId === 'rep-rental-price') {
      navigate({ to: '/reports/rental-price' })
    } else {
      // Handle other report types
      console.log('Generate report:', reportId)
    }
  }

  const groupedReports = {
    financial: availableReports.filter((r) => r.category === 'financial'),
    operational: availableReports.filter((r) => r.category === 'operational'),
    compliance: availableReports.filter((r) => r.category === 'compliance'),
    performance: availableReports.filter((r) => r.category === 'performance'),
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">{t('reports.title')}</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          {t('reports.subtitle')}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-2xl font-bold">{availableReports.length}</p>
              <p className="text-sm text-muted-foreground">{t('reports.stats.available')}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <p className="text-2xl font-bold text-green-600">4</p>
              <p className="text-sm text-muted-foreground">{t('reports.stats.financial')}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-600">2</p>
              <p className="text-sm text-muted-foreground">{t('reports.stats.operational')}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Download className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-purple-600">12</p>
              <p className="text-sm text-muted-foreground">{t('reports.stats.downloads')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Reports */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-green-600"></span>
          {t('reports.financialReports')}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {groupedReports.financial.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                  <Badge className={categoryColors[report.category]}>
                    {report.category.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <p className="text-muted-foreground">{t('reports.frequency')}: {frequencyLabels[report.frequency]}</p>
                    {report.lastGenerated && (
                      <p className="text-muted-foreground">{t('reports.last')}: {formatDate(report.lastGenerated)}</p>
                    )}
                  </div>
                  <Button size="sm" onClick={() => handleGenerateReport(report.id)}>
                    {report.id === 'rep-rental-price' ? (
                      <>
                        <DollarSign className="mr-2 h-4 w-4" />
                        {t('reports.create')}
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        {t('reports.generate')}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Operational Reports */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-blue-600"></span>
          {t('reports.operationalReports')}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {groupedReports.operational.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                  <Badge className={categoryColors[report.category]}>
                    {report.category.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <p className="text-muted-foreground">{t('reports.frequency')}: {frequencyLabels[report.frequency]}</p>
                    {report.lastGenerated && (
                      <p className="text-muted-foreground">{t('reports.last')}: {formatDate(report.lastGenerated)}</p>
                    )}
                  </div>
                  <Button size="sm" onClick={() => handleGenerateReport(report.id)}>
                    {report.id === 'rep-rental-price' ? (
                      <>
                        <DollarSign className="mr-2 h-4 w-4" />
                        {t('reports.create')}
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        {t('reports.generate')}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Compliance & Performance Reports */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-purple-600"></span>
            {t('reports.complianceReports')}
          </h2>
          <div className="space-y-4">
            {groupedReports.compliance.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{report.name}</CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <p className="text-muted-foreground">Frequency: {frequencyLabels[report.frequency]}</p>
                      {report.lastGenerated && (
                        <p className="text-muted-foreground">Last: {formatDate(report.lastGenerated)}</p>
                      )}
                    </div>
                    <Button size="sm" onClick={() => handleGenerateReport(report.id)}>
                      {report.id === 'rep-rental-price' ? (
                        <>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Create
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-orange-600"></span>
            {t('reports.performanceReports')}
          </h2>
          <div className="space-y-4">
            {groupedReports.performance.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{report.name}</CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <p className="text-muted-foreground">Frequency: {frequencyLabels[report.frequency]}</p>
                      {report.lastGenerated && (
                        <p className="text-muted-foreground">Last: {formatDate(report.lastGenerated)}</p>
                      )}
                    </div>
                    <Button size="sm" onClick={() => handleGenerateReport(report.id)}>
                      {report.id === 'rep-rental-price' ? (
                        <>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Create
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
