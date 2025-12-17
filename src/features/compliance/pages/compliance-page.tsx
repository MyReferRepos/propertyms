import { useState, useEffect } from 'react'
import { Building2, ChevronDown } from 'lucide-react'
import { ComplianceChecker } from '../components/compliance-checker'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { propertiesAPI } from '@/services/api'
import type { Property } from '@/types'
import { useI18n } from '@/lib/i18n'

export function CompliancePage() {
  const { t } = useI18n()
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      setLoading(true)
      const response = await propertiesAPI.getAll()

      if (response.success) {
        setProperties(response.data)
        // Auto-select first property
        if (response.data.length > 0) {
          setSelectedProperty(response.data[0])
        }
      }
    } catch (error) {
      console.error('Failed to load properties:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">{t('compliance.noProperties')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('compliance.addProperties')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('compliance.title')}</h1>
          <p className="text-muted-foreground">
            {t('compliance.subtitle')}
          </p>
        </div>

        {/* Property Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[300px] justify-between">
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {selectedProperty ? (
                  <span className="truncate">{selectedProperty.address}</span>
                ) : (
                  t('compliance.selectProperty')
                )}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px]">
            {properties.map((property) => (
              <DropdownMenuItem
                key={property.id}
                onClick={() => setSelectedProperty(property)}
                className="flex flex-col items-start"
              >
                <span className="font-medium">{property.address}</span>
                <span className="text-xs text-muted-foreground">
                  {property.suburb}, {property.city}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Compliance Checker */}
      {selectedProperty && <ComplianceChecker propertyId={selectedProperty.id} />}
    </div>
  )
}
