import { useState } from 'react'
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  XCircle,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockComplianceReports } from '@/data/mock/audit'
import { useI18n } from '@/lib/i18n'

export function ComplianceReportsPage() {
  const { t } = useI18n()
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [expandedReports, setExpandedReports] = useState<Set<string>>(new Set())

  const filteredReports = mockComplianceReports.filter(
    (report) => typeFilter === 'all' || report.type === typeFilter
  )

  const toggleReport = (reportId: string) => {
    const newExpanded = new Set(expandedReports)
    if (newExpanded.has(reportId)) {
      newExpanded.delete(reportId)
    } else {
      newExpanded.add(reportId)
    }
    setExpandedReports(newExpanded)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      passed: 'bg-green-100 text-green-800',
      warning: 'bg-amber-100 text-amber-800',
      failed: 'bg-red-100 text-red-800',
    }
    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {t(`accounting.audit.reports.status.${status}`)}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      monthly: 'bg-blue-100 text-blue-800',
      quarterly: 'bg-purple-100 text-purple-800',
      annual: 'bg-indigo-100 text-indigo-800',
    }
    return (
      <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>
        {t(`accounting.audit.reports.type.${type}`)}
      </Badge>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600'
    if (score >= 80) return 'text-amber-600'
    return 'text-red-600'
  }

  // Statistics
  const stats = {
    total: mockComplianceReports.length,
    passed: mockComplianceReports.filter((r) => r.status === 'passed').length,
    warning: mockComplianceReports.filter((r) => r.status === 'warning').length,
    failed: mockComplianceReports.filter((r) => r.status === 'failed').length,
    avgScore:
      mockComplianceReports.reduce((sum, r) => sum + r.score, 0) /
      mockComplianceReports.length,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('accounting.audit.reports.title')}</h1>
        <p className="text-muted-foreground">{t('accounting.audit.reports.subtitle')}</p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('accounting.audit.reports.stats.total')}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('accounting.audit.reports.stats.passed')}
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('accounting.audit.reports.stats.warnings')}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.warning}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('accounting.audit.reports.stats.avgScore')}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(stats.avgScore)}`}>
              {stats.avgScore.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('accounting.audit.reports.filters.type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')}</SelectItem>
            <SelectItem value="monthly">{t('accounting.audit.reports.type.monthly')}</SelectItem>
            <SelectItem value="quarterly">
              {t('accounting.audit.reports.type.quarterly')}
            </SelectItem>
            <SelectItem value="annual">{t('accounting.audit.reports.type.annual')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Collapsible
            key={report.id}
            open={expandedReports.has(report.id)}
            onOpenChange={() => toggleReport(report.id)}
          >
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {expandedReports.has(report.id) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                      {getStatusIcon(report.status)}
                      <div>
                        <CardTitle className="text-base">
                          {report.period} {t('accounting.audit.reports.report')}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {t('accounting.audit.reports.generatedAt')}:{' '}
                          {new Date(report.generatedAt).toLocaleDateString()} |{' '}
                          {t('accounting.audit.reports.generatedBy')}: {report.generatedBy}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getTypeBadge(report.type)}
                      {getStatusBadge(report.status)}
                      <span className={`text-xl font-bold ${getScoreColor(report.score)}`}>
                        {report.score}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="border-t pt-4">
                  <div className="space-y-3">
                    {report.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(item.status)}
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{item.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {t('accounting.audit.reports.lastChecked')}:{' '}
                            {new Date(item.lastChecked).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">
                      {t('accounting.audit.reports.exportPdf')}
                    </Button>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}
