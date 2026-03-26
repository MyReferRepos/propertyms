import { Link } from '@tanstack/react-router'
import {
  ClipboardList,
  FileCheck,
  FileText,
  GitCompare,
  History,
  Receipt,
  Shield,
  TrendingUp,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  auditStatistics,
  mockAuditLogs,
} from '@/data/mock/audit'
import { useI18n } from '@/lib/i18n'

export function AuditOverviewPage() {
  const { t } = useI18n()

  const quickLinks = [
    {
      title: t('accounting.audit.logs.title'),
      description: t('accounting.audit.logs.subtitle'),
      href: '/accounting/audit/logs',
      icon: History,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: t('accounting.audit.reports.title'),
      description: t('accounting.audit.reports.subtitle'),
      href: '/accounting/audit/reports',
      icon: FileCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: t('accounting.audit.changes.title'),
      description: t('accounting.audit.changes.subtitle'),
      href: '/accounting/audit/changes',
      icon: GitCompare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: t('accounting.audit.financial.title'),
      description: t('accounting.audit.financial.subtitle'),
      href: '/accounting/audit/financial',
      icon: Receipt,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'create':
        return (
          <Badge className="bg-green-100 text-green-800">
            {t('accounting.audit.type.create')}
          </Badge>
        )
      case 'update':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            {t('accounting.audit.type.update')}
          </Badge>
        )
      case 'delete':
        return (
          <Badge className="bg-red-100 text-red-800">
            {t('accounting.audit.type.delete')}
          </Badge>
        )
      case 'view':
        return (
          <Badge className="bg-gray-100 text-gray-800">
            {t('accounting.audit.type.view')}
          </Badge>
        )
      case 'export':
        return (
          <Badge className="bg-purple-100 text-purple-800">
            {t('accounting.audit.type.export')}
          </Badge>
        )
      default:
        return <Badge>{type}</Badge>
    }
  }

  const recentLogs = mockAuditLogs.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('accounting.audit.title')}</h1>
        <p className="text-muted-foreground">{t('accounting.audit.subtitle')}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('accounting.audit.stats.totalLogs')}
            </CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditStatistics.totalLogs.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('accounting.audit.stats.lastDays')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('accounting.audit.stats.createActions')}
            </CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {auditStatistics.createActions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {((auditStatistics.createActions / auditStatistics.totalLogs) * 100).toFixed(1)}%{' '}
              {t('accounting.audit.stats.ofTotal')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('accounting.audit.stats.updateActions')}
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {auditStatistics.updateActions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {((auditStatistics.updateActions / auditStatistics.totalLogs) * 100).toFixed(1)}%{' '}
              {t('accounting.audit.stats.ofTotal')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('accounting.audit.stats.complianceScore')}
            </CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {auditStatistics.complianceScore}%
            </div>
            <p className="text-xs text-muted-foreground">
              {t('accounting.audit.stats.excellent')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">{t('accounting.audit.quickLinks')}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className={`mb-4 inline-flex rounded-lg p-3 ${link.bgColor}`}>
                    <link.icon className={`h-6 w-6 ${link.color}`} />
                  </div>
                  <h3 className="font-semibold">{link.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('accounting.audit.recentActivity')}</CardTitle>
          <Link
            to="/accounting/audit/logs"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            {t('common.viewAll')}
            <TrendingUp className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="font-medium">{log.entityName}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('accounting.audit.by')} {log.userName}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {getTypeBadge(log.action)}
                  <span className="text-sm text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
