import { useState, useEffect } from 'react'
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Home,
  Wind,
  Droplet,
  DoorClosed,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { complianceAPI } from '@/services/api'
import type { ComplianceItem } from '@/types'
import { cn } from '@/lib/utils'

interface ComplianceCheckerProps {
  propertyId: string
}

const categoryIcons = {
  heating: Flame,
  insulation: Home,
  ventilation: Wind,
  moisture: Droplet,
  draught: DoorClosed,
}

const categoryLabels = {
  heating: 'Heating',
  insulation: 'Insulation',
  ventilation: 'Ventilation',
  moisture: 'Moisture & Drainage',
  draught: 'Draught Stopping',
}

export function ComplianceChecker({ propertyId }: ComplianceCheckerProps) {
  const [items, setItems] = useState<ComplianceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    loadCompliance()
  }, [propertyId])

  const loadCompliance = async () => {
    try {
      setLoading(true)
      const response = await complianceAPI.getByPropertyId(propertyId)

      if (response.success) {
        setItems(response.data)
        setScore(complianceAPI.calculateScore(response.data))
      }
    } catch (error) {
      console.error('Failed to load compliance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRunCheck = async () => {
    try {
      setChecking(true)
      const response = await complianceAPI.runCheck(propertyId)

      if (response.success) {
        setItems(response.data)
        setScore(complianceAPI.calculateScore(response.data))
      }
    } catch (error) {
      console.error('Failed to run compliance check:', error)
    } finally {
      setChecking(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-sm text-muted-foreground">Loading compliance data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const compliantCount = items.filter((item) => item.status === 'compliant').length
  const nonCompliantCount = items.filter((item) => item.status === 'non-compliant').length

  return (
    <div className="space-y-6">
      {/* Header Card with Score */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Healthy Homes Compliance
              </CardTitle>
              <CardDescription>
                NZ Residential Tenancies Act 1986 - Healthy Homes Standards
              </CardDescription>
            </div>
            <Button onClick={handleRunCheck} disabled={checking} size="sm">
              <RefreshCw className={cn('mr-2 h-4 w-4', checking && 'animate-spin')} />
              {checking ? 'Checking...' : 'Run Check'}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Compliance Score Circle */}
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative">
                <div className="flex h-40 w-40 items-center justify-center">
                  <svg className="h-full w-full -rotate-90 transform">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-muted"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - score / 100)}`}
                      className={cn(
                        'transition-all duration-500',
                        score === 100 && 'text-green-600',
                        score >= 60 && score < 100 && 'text-amber-600',
                        score < 60 && 'text-red-600',
                      )}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {score === 100 ? (
                      <ShieldCheck className="h-12 w-12 text-green-600" />
                    ) : (
                      <ShieldAlert className="h-12 w-12 text-amber-600" />
                    )}
                    <span className="mt-2 text-3xl font-bold">{score}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Badge
                  variant={score === 100 ? 'default' : 'secondary'}
                  className={cn(
                    'text-sm',
                    score === 100 && 'bg-green-600',
                    score >= 60 && score < 100 && 'bg-amber-600',
                    score < 60 && 'bg-red-600 text-white',
                  )}
                >
                  {score === 100 ? 'Fully Compliant' : 'Action Required'}
                </Badge>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Compliant Items</p>
                    <p className="text-2xl font-bold">{compliantCount}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Non-Compliant Items</p>
                    <p className="text-2xl font-bold">{nonCompliantCount}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Checked</p>
                    <p className="text-sm font-medium">
                      {items[0]?.lastChecked
                        ? new Date(items[0].lastChecked).toLocaleDateString('en-NZ', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Compliance Requirements</CardTitle>
          <CardDescription>Details of all Healthy Homes Standards requirements</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {items.map((item) => {
              const Icon = categoryIcons[item.category]
              const isCompliant = item.status === 'compliant'

              return (
                <div
                  key={item.id}
                  className={cn(
                    'rounded-lg border p-4 transition-colors',
                    !isCompliant && 'border-red-200 bg-red-50/50',
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg',
                        isCompliant
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600',
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="flex-1 space-y-2">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold">{categoryLabels[item.category]}</h4>
                          <p className="text-sm text-muted-foreground">{item.requirement}</p>
                        </div>
                        <Badge
                          variant={isCompliant ? 'default' : 'destructive'}
                          className={isCompliant ? 'bg-green-600' : ''}
                        >
                          {isCompliant ? (
                            <>
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Compliant
                            </>
                          ) : (
                            <>
                              <XCircle className="mr-1 h-3 w-3" />
                              Non-Compliant
                            </>
                          )}
                        </Badge>
                      </div>

                      {/* Details */}
                      <p className="text-sm">{item.details}</p>

                      {/* Remediation */}
                      {!isCompliant && item.remediation && (
                        <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 border border-amber-200">
                          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-amber-900">
                              Action Required
                            </p>
                            <p className="text-sm text-amber-800">{item.remediation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
