import { Bed, Bath, Car, MapPin, DollarSign, Home } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Property } from '@/types'
import { cn } from '@/lib/utils'

interface PropertyCardProps {
  property: Property
  onClick?: () => void
  linkTo?: string
}

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

export function PropertyCard({ property, onClick, linkTo }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative h-48">
        <img
          src={property.imageUrl}
          alt={property.address}
          className="h-full w-full object-cover"
        />
        <div className="absolute right-2 top-2">
          <Badge className={cn('capitalize', statusColors[property.status])}>
            {property.status}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Address */}
          <div>
            <h3 className="font-semibold text-lg">{property.address}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {property.suburb}, {property.city}
            </p>
          </div>

          {/* Property Type */}
          <Badge variant="outline">{typeLabels[property.type]}</Badge>

          {/* Features */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Car className="h-4 w-4" />
              <span>{property.parkingSpaces}</span>
            </div>
            <div className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>{property.floorArea}m²</span>
            </div>
          </div>

          {/* Rent */}
          {property.currentRent && (
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-sm text-muted-foreground">Weekly Rent</span>
              <span className="text-lg font-semibold flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {property.currentRent}
              </span>
            </div>
          )}

          {/* Value */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estimated Value</span>
            <span className="text-sm font-medium">
              ${property.estimatedValue.toLocaleString()}
            </span>
          </div>

          {/* Compliance Score */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Compliance</span>
            <Badge
              variant={property.complianceScore === 100 ? 'default' : 'secondary'}
              className={property.complianceScore === 100 ? 'bg-green-600' : ''}
            >
              {property.complianceScore}%
            </Badge>
          </div>

          {/* Action Button */}
          {linkTo ? (
            <Button className="w-full" variant="outline" asChild>
              <Link to={linkTo}>View Details</Link>
            </Button>
          ) : (
            <Button className="w-full" variant="outline" onClick={onClick}>
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
