import { useState } from 'react'
import { FileText, Building2, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LandlordReportForm } from '../components/landlord-report-form'
import { TenantReportForm } from '../components/tenant-report-form'
import { RentalReportDisplay } from '../components/rental-report-display'
import type { RentalPriceReport } from '@/types'
import { useI18n } from '@/lib/i18n'

export function RentalPriceReportsPage() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<'landlord' | 'tenant'>('landlord')
  const [generatedReport, setGeneratedReport] = useState<RentalPriceReport | null>(null)

  const handleReportGenerated = (report: RentalPriceReport) => {
    setGeneratedReport(report)
  }

  const handleBackToForm = () => {
    setGeneratedReport(null)
  }

  // If a report is generated, show it
  if (generatedReport) {
    return (
      <div className="space-y-6">
        <RentalReportDisplay report={generatedReport} onBack={handleBackToForm} />
      </div>
    )
  }

  // Otherwise, show the form
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">{t('rentalReports.title')}</h1>
        </div>
        <p className="text-muted-foreground mt-1">{t('rentalReports.subtitle')}</p>
      </div>

      {/* Report Type Selection */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'landlord' | 'tenant')}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="landlord" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            {t('rentalReports.landlord.title')}
          </TabsTrigger>
          <TabsTrigger value="tenant" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('rentalReports.tenant.title')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="landlord" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('rentalReports.landlord.title')}</CardTitle>
              <CardDescription>{t('rentalReports.landlord.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <LandlordReportForm onReportGenerated={handleReportGenerated} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenant" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('rentalReports.tenant.title')}</CardTitle>
              <CardDescription>{t('rentalReports.tenant.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <TenantReportForm onReportGenerated={handleReportGenerated} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('rentalReports.landlord.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Market rental analysis for your property</li>
              <li>• Pricing recommendations based on comparable properties</li>
              <li>• Market trend insights and demand analysis</li>
              <li>• Optimize rental income potential</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('rentalReports.tenant.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Rental market overview for your desired area</li>
              <li>• Budget planning and price expectations</li>
              <li>• Comparable property listings and prices</li>
              <li>• Negotiation insights and market timing</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
