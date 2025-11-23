import { useEffect, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Bed,
  Bath,
  Car,
  MapPin,
  Home,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  FileText,
  AlertCircle,
  CheckCircle,
  Users,
  Wrench
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { propertiesAPI } from '@/services/api'
import type { Property } from '@/types'
import { cn } from '@/lib/utils'

const statusColors = {
  occupied: 'bg-green-100 text-green-700',
  vacant: 'bg-amber-100 text-amber-700',
  maintenance: 'bg-red-100 text-red-700',
}

const typeLabels = {
  house: 'House',
  apartment: 'Apartment',
  townhouse: 'Townhouse',
  unit: 'Unit',
}

export function PropertyDetailPage() {
  const { propertyId } = useParams({ from: '/_authenticated/properties/$propertyId' })
  const navigate = useNavigate()

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    loadProperty()
  }, [propertyId])

  const loadProperty = async () => {
    try {
      setLoading(true)
      const response = await propertiesAPI.getById(propertyId)

      if (response.success) {
        setProperty(response.data)
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
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="mt-4 text-lg font-semibold">Property not found</h3>
          <p className="text-sm text-muted-foreground">The property you're looking for doesn't exist.</p>
          <Button className="mt-4" onClick={() => navigate({ to: '/properties' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/properties' })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>

        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" className="hidden">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Image Gallery */}
      <Card>
        <CardContent className="p-0">
          <div className="relative h-96">
            <img
              src={property.images[activeImageIndex] || property.imageUrl}
              alt={property.address}
              className="h-full w-full object-cover rounded-t-lg"
            />
            <div className="absolute right-4 top-4">
              <Badge className={cn('capitalize', statusColors[property.status])}>
                {property.status}
              </Badge>
            </div>
          </div>

          {property.images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={cn(
                    "h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                    activeImageIndex === index ? "border-primary" : "border-transparent"
                  )}
                >
                  <img
                    src={image}
                    alt={`${property.address} - ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Details */}
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <CardTitle className="text-2xl">{property.address}</CardTitle>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {property.suburb}, {property.city} {property.postcode}
                </p>
                <Badge variant="outline" className="w-fit">
                  {typeLabels[property.type]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted">
                  <Bed className="h-6 w-6 text-muted-foreground" />
                  <span className="text-2xl font-bold">{property.bedrooms}</span>
                  <span className="text-sm text-muted-foreground">Bedrooms</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted">
                  <Bath className="h-6 w-6 text-muted-foreground" />
                  <span className="text-2xl font-bold">{property.bathrooms}</span>
                  <span className="text-sm text-muted-foreground">Bathrooms</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted">
                  <Car className="h-6 w-6 text-muted-foreground" />
                  <span className="text-2xl font-bold">{property.parkingSpaces}</span>
                  <span className="text-sm text-muted-foreground">Parking</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted">
                  <Home className="h-6 w-6 text-muted-foreground" />
                  <span className="text-2xl font-bold">{property.floorArea}</span>
                  <span className="text-sm text-muted-foreground">sqm</span>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid gap-4 md:grid-cols-2">
                {property.landArea && (
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm text-muted-foreground">Land Area</span>
                    <span className="font-medium">{property.landArea} sqm</span>
                  </div>
                )}
                {property.yearBuilt && (
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm text-muted-foreground">Year Built</span>
                    <span className="font-medium">{property.yearBuilt}</span>
                  </div>
                )}
              </div>

              {/* Property Features */}
              {property.features.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tabs for additional info */}
          <Tabs defaultValue="compliance" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="tenancy">Tenancy</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="compliance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Score</span>
                    <Badge
                      variant={property.complianceScore === 100 ? 'default' : 'secondary'}
                      className={property.complianceScore === 100 ? 'bg-green-600' : ''}
                    >
                      {property.complianceScore}%
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <span className="text-sm">Insulation</span>
                      {property.hasInsulation ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <span className="text-sm">Heating</span>
                      {property.hasHeating ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <span className="text-sm">Smoke Alarms</span>
                      {property.hasSmokeAlarms ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </div>

                  {property.lastInspectionDate && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Last Inspection</span>
                        <span className="font-medium">{new Date(property.lastInspectionDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}

                  {property.nextInspectionDue && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Next Inspection Due</span>
                      <span className="font-medium">{new Date(property.nextInspectionDue).toLocaleDateString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tenancy">
              <Card>
                <CardHeader>
                  <CardTitle>Tenancy Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">No active tenancy</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">No maintenance records</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Financial Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {property.currentRent && (
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Rent</p>
                  <p className="text-2xl font-bold">${property.currentRent}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">Estimated Value</p>
                <p className="text-xl font-semibold">${property.estimatedValue.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View Tenants
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Wrench className="mr-2 h-4 w-4" />
                Maintenance
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Inspection
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View Documents
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
