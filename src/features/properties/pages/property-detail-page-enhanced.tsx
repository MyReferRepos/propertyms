/**
 * Enhanced Property Detail Page
 * Displays comprehensive property information based on screenshots
 */

import { useEffect, useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import {
  Building2,
  ChevronLeft,
  Camera,
  Edit,
  CloudUpload,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Property } from '@/types'
import { PropertyDetailComprehensive } from '../components/property-detail-comprehensive'
import { propertiesAPI } from '@/services/api'

export function PropertyDetailPageEnhanced() {
  const { propertyId } = useParams({ from: '/_authenticated/properties/$propertyId' })
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPropertyDetail()
  }, [propertyId])

  const loadPropertyDetail = async () => {
    try {
      setLoading(true)
      // In a real app, this would be: propertiesAPI.getById(propertyId)
      // For now, we'll get it from the list
      const response = await propertiesAPI.getAll({})
      if (response.success) {
        const foundProperty = response.data.find((p) => p.id === propertyId)
        setProperty(foundProperty || null)
      }
    } catch (error) {
      console.error('Failed to load property:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Property Not Found</h2>
        <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/properties">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Link>
        </Button>
      </div>
    )
  }

  const statusColors = {
    vacant: 'bg-green-100 text-green-700 border-green-200',
    occupied: 'bg-blue-100 text-blue-700 border-blue-200',
    maintenance: 'bg-orange-100 text-orange-700 border-orange-200',
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to="/properties">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Properties
          </Link>
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Properties / Property address</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={statusColors[property.status]}>
                  {property.status === 'occupied'
                    ? 'Occupied'
                    : property.status === 'vacant'
                      ? 'Available'
                      : 'Maintenance'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <CloudUpload className="h-4 w-4 mr-2" />
            </Button>
            <Button variant="outline" size="sm">
              <Camera className="h-4 w-4 mr-2" />
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
            </Button>
            <Button variant="outline" size="sm">
              Actions
            </Button>
          </div>
        </div>
      </div>

      {/* Property Image (if available) */}
      {property.imageUrl && (
        <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden">
          <img src={property.imageUrl} alt={property.address} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Comprehensive Property Details */}
      <PropertyDetailComprehensive property={property} />
    </div>
  )
}
