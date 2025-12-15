import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Eye, FileText, CheckCircle, ArrowRight } from 'lucide-react'

export function LeasingPage() {
  const { t } = useI18n()

  const stages = [
    {
      title: 'Listing Properties',
      titleKey: 'nav.leasing.listing',
      icon: Building2,
      count: 12,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/leasing-process/listing',
    },
    {
      title: 'Viewing Tracker',
      titleKey: 'nav.leasing.viewing',
      icon: Eye,
      count: 28,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/leasing-process/viewing',
    },
    {
      title: 'Applications',
      titleKey: 'nav.leasing.applications',
      icon: FileText,
      count: 15,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/leasing-process/applications',
    },
    {
      title: 'Agreements',
      titleKey: 'nav.leasing.agreements',
      icon: CheckCircle,
      count: 8,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/leasing-process/agreements',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('nav.leasingProcess')}</h1>
        <p className="text-muted-foreground">
          Manage the complete leasing workflow from listing to agreement
        </p>
      </div>

      {/* Workflow Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Leasing Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {stages.map((stage, index) => {
              const Icon = stage.icon
              return (
                <div key={stage.title} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full ${stage.bgColor}`}
                    >
                      <Icon className={`h-8 w-8 ${stage.color}`} />
                    </div>
                    <p className="mt-2 text-sm font-medium">{stage.title}</p>
                    <p className={`text-lg font-bold ${stage.color}`}>
                      {stage.count}
                    </p>
                  </div>
                  {index < stages.length - 1 && (
                    <ArrowRight className="mx-4 h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stage Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {stages.map((stage) => {
          const Icon = stage.icon
          return (
            <Card
              key={stage.title}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={`rounded-full p-3 ${stage.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stage.color}`} />
                </div>
                <div>
                  <CardTitle>{stage.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {stage.count} active items
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Click to manage {stage.title.toLowerCase()}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
