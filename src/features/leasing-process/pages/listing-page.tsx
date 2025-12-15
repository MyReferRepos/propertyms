import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, Plus, MapPin, Bed, Bath, DollarSign } from 'lucide-react'

const mockListings = [
  {
    id: '1',
    address: '123 Queen Street, Auckland CBD',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 1,
    rent: 650,
    status: 'Active',
    daysListed: 5,
  },
  {
    id: '2',
    address: '45 Ponsonby Road, Ponsonby',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    rent: 850,
    status: 'Active',
    daysListed: 12,
  },
  {
    id: '3',
    address: '78 Newmarket Ave, Newmarket',
    type: 'Unit',
    bedrooms: 1,
    bathrooms: 1,
    rent: 480,
    status: 'Pending',
    daysListed: 3,
  },
  {
    id: '4',
    address: '200 Broadway, Newmarket',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    rent: 720,
    status: 'Active',
    daysListed: 8,
  },
]

export function ListingPage() {
  const { t } = useI18n()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('nav.leasing.listing')}</h1>
          <p className="text-muted-foreground">
            Manage property listings available for rent
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Listing
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active Listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">Total Inquiries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">8 days</div>
            <p className="text-xs text-muted-foreground">Avg. Time to Let</p>
          </CardContent>
        </Card>
      </div>

      {/* Listings */}
      <div className="grid gap-4 md:grid-cols-2">
        {mockListings.map((listing) => (
          <Card key={listing.id} className="hover:bg-accent/30 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{listing.type}</CardTitle>
                </div>
                <Badge className={getStatusColor(listing.status)}>
                  {listing.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{listing.address}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    {listing.bedrooms} bed
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    {listing.bathrooms} bath
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <DollarSign className="h-4 w-4" />
                    {listing.rent}/week
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Listed {listing.daysListed} days ago
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
