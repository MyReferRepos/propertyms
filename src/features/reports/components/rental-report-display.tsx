import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Download,
  Printer,
  Share2,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Home,
  Bed,
  Bath,
} from 'lucide-react'
import type { RentalPriceReport } from '@/types'
import { useI18n } from '@/lib/i18n'

interface RentalReportDisplayProps {
  report: RentalPriceReport
  onBack: () => void
}

export function RentalReportDisplay({ report, onBack }: RentalReportDisplayProps) {
  const { t } = useI18n()

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(0)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const getTrendIcon = () => {
    switch (report.marketData.rentTrend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4" />
      case 'decreasing':
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const getTrendColor = () => {
    switch (report.marketData.rentTrend) {
      case 'increasing':
        return 'text-green-600'
      case 'decreasing':
        return 'text-red-600'
      default:
        return 'text-yellow-600'
    }
  }

  const getDemandColor = () => {
    switch (report.marketData.demandLevel) {
      case 'high':
        return 'bg-green-100 text-green-700'
      case 'low':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('rentalReports.report.backToForm')}
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {report.reportType === 'landlord'
                ? t('rentalReports.landlord.title')
                : t('rentalReports.tenant.title')}
            </h1>
            <Badge variant="outline">
              {report.reportType === 'landlord' ? 'Landlord' : 'Tenant'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t('rentalReports.report.generatedOn')}: {formatDate(report.generatedDate)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            {t('rentalReports.report.shareReport')}
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            {t('rentalReports.report.printReport')}
          </Button>
          <Button variant="default" size="sm">
            <Download className="mr-2 h-4 w-4" />
            {t('rentalReports.report.downloadPDF')}
          </Button>
        </div>
      </div>

      {/* Property Info (if landlord report) */}
      {report.property && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('rentalReports.report.property')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{report.property.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {report.area.suburb}, {report.area.city}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{t(`rentalReports.propertyTypes.${report.property.type}`)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{report.property.bedrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{report.property.bathrooms}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Area Info (if tenant report) */}
      {!report.property && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">
                  {report.area.suburb}, {report.area.city}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t(`rentalReports.propertyTypes.${report.marketData.propertyType}`)} properties
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{t('rentalReports.report.marketOverview')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {t('rentalReports.report.averageRent')}
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(report.marketData.averageRent)}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {t('rentalReports.report.perWeek')}
                </span>
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {t('rentalReports.report.medianRent')}
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(report.marketData.medianRent)}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {t('rentalReports.report.perWeek')}
                </span>
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {t('rentalReports.report.rentRange')}
              </p>
              <p className="text-lg font-semibold">
                {formatCurrency(report.marketData.minRent)} -{' '}
                {formatCurrency(report.marketData.maxRent)}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {t('rentalReports.report.totalListings')}
              </p>
              <p className="text-2xl font-bold">{report.marketData.totalListings}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="font-medium">
                  {t(`rentalReports.trends.${report.marketData.rentTrend}`)}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({report.marketData.rentChangePercent > 0 ? '+' : ''}
                {report.marketData.rentChangePercent.toFixed(1)}%)
              </span>
            </div>

            <div>
              <Badge className={getDemandColor()}>
                {t(`rentalReports.demand.${report.marketData.demandLevel}`)} Demand
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground">
              {t('rentalReports.report.avgDaysToLease')}:{' '}
              <span className="font-medium text-foreground">
                {report.marketData.averageDaysToLease} days
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>{t('rentalReports.report.recommendations')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {report.recommendations.map((recommendation, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span className="text-sm">{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Comparable Properties */}
      <Card>
        <CardHeader>
          <CardTitle>{t('rentalReports.report.comparableProperties')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {report.comparableProperties.map((property, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex-1">
                  <p className="font-medium">{property.address}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="capitalize">{t(`rentalReports.propertyTypes.${property.type}`)}</span>
                    <span className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      {property.bedrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-3 w-3" />
                      {property.bathrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {property.distance} {t('rentalReports.report.km')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{formatCurrency(property.weeklyRent)}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('rentalReports.report.perWeek')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
