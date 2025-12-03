/**
 * Comprehensive Property Detail Component
 * Optimized for property managers - clear, concise, high space utilization
 */

import { useState } from 'react'
import type { Property } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Home,
  MapPin,
  Bed,
  Bath,
  Car,
  Droplet,
  Zap,
  Wifi,
  Wind,
  Flame,
  Shield,
  Key,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  TrendingUp,
  Maximize2,
} from 'lucide-react'

interface PropertyDetailComprehensiveProps {
  property: Property
}

export function PropertyDetailComprehensive({ property }: PropertyDetailComprehensiveProps) {
  const [floorPlanOpen, setFloorPlanOpen] = useState(false)
  const [photoGalleryOpen, setPhotoGalleryOpen] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  // Get photos from imageUrl and images array
  const allPhotos = [
    ...(property.imageUrl ? [property.imageUrl] : []),
    ...(property.images || [])
  ].filter(Boolean)

  const openPhotoGallery = (index: number) => {
    setCurrentPhotoIndex(index)
    setPhotoGalleryOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Floor Plan Dialog - Full Screen with Zoom */}
      {property.floorPlanUrl && (
        <Dialog open={floorPlanOpen} onOpenChange={setFloorPlanOpen}>
          <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 flex flex-col">
            <DialogHeader className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <DialogTitle>Floor Plan - {property.address}</DialogTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const img = document.querySelector('#floor-plan-image') as HTMLImageElement
                      if (img) {
                        if (document.fullscreenElement) {
                          document.exitFullscreen()
                        } else {
                          img.requestFullscreen()
                        }
                      }
                    }}
                  >
                    <Maximize2 className="h-4 w-4 mr-2" />
                    Full Screen
                  </Button>
                </div>
              </div>
            </DialogHeader>
            <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-4">
              <img
                id="floor-plan-image"
                src={property.floorPlanUrl}
                alt="Floor Plan Full View"
                className="max-w-full max-h-full object-contain cursor-zoom-in"
                style={{ minHeight: '500px' }}
                onClick={(e) => {
                  const img = e.target as HTMLImageElement
                  if (img.style.transform === 'scale(2)') {
                    img.style.transform = 'scale(1)'
                    img.style.cursor = 'zoom-in'
                  } else {
                    img.style.transform = 'scale(2)'
                    img.style.cursor = 'zoom-out'
                  }
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Photo Gallery Dialog */}
      {allPhotos.length > 0 && (
        <Dialog open={photoGalleryOpen} onOpenChange={setPhotoGalleryOpen}>
          <DialogContent className="max-w-5xl w-full">
            <DialogHeader>
              <DialogTitle>Property Photos ({currentPhotoIndex + 1} / {allPhotos.length})</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
                <img
                  src={allPhotos[currentPhotoIndex]}
                  alt={`Property photo ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Thumbnails */}
              <div className="grid grid-cols-6 gap-2">
                {allPhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentPhotoIndex(idx)}
                    className={`aspect-video rounded overflow-hidden cursor-pointer border-2 transition-all ${
                      idx === currentPhotoIndex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={photo} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Core Information - Compact Display with Visual Assets */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{property.address}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {property.suburb}, {property.city} {property.postcode}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">Show map</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Basic Info & Room Configuration */}
            <div className="space-y-3">
              {/* Area and Type */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {property.area && (
                  <div>
                    <span className="text-muted-foreground">Area:</span>{' '}
                    <span className="font-medium capitalize">{property.area}</span>
                  </div>
                )}
                {property.dwellingType && (
                  <div>
                    <span className="text-muted-foreground">Type:</span>{' '}
                    <span className="font-medium capitalize">{property.dwellingType.replace(/-/g, ' / ')}</span>
                  </div>
                )}
              </div>

              {/* Room Configuration */}
              <div className="pt-2 border-t">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Room Configuration</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Bed className="h-3.5 w-3.5 text-muted-foreground" />
                    <span><strong>{property.bedrooms}</strong> Bed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bath className="h-3.5 w-3.5 text-muted-foreground" />
                    <span><strong>{property.bathrooms}</strong> Bath</span>
                  </div>
                  {property.separateToilets !== undefined && property.separateToilets > 0 && (
                    <div className="text-sm">
                      <strong>{property.separateToilets}</strong> Toilet
                    </div>
                  )}
                  {property.livingAreas !== undefined && property.livingAreas > 0 && (
                    <div className="text-sm">
                      <strong>{property.livingAreas}</strong> Living
                    </div>
                  )}
                  {property.studyRooms !== undefined && property.studyRooms > 0 && (
                    <div className="text-sm">
                      <strong>{property.studyRooms}</strong> Study
                    </div>
                  )}
                  {property.laundryRooms !== undefined && property.laundryRooms > 0 && (
                    <div className="text-sm">
                      <strong>{property.laundryRooms}</strong> Laundry
                    </div>
                  )}
                  {property.sheds !== undefined && property.sheds > 0 && (
                    <div className="text-sm">
                      <strong>{property.sheds}</strong> Shed
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Middle: Floor Plan (if available) */}
            {property.hasFloorPlan && property.floorPlanUrl && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Floor Plan</p>
                <div
                  onClick={() => setFloorPlanOpen(true)}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group border-2 border-blue-200 hover:border-blue-400 transition-all bg-blue-50"
                >
                  <img
                    src={property.floorPlanUrl}
                    alt="Floor Plan"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-xs text-white">Click to enlarge</p>
                  </div>
                </div>
              </div>
            )}

            {/* Right: Photos */}
            {allPhotos.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Photos ({allPhotos.length})
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {allPhotos.slice(0, 4).map((photo, idx) => (
                    <div
                      key={idx}
                      onClick={() => openPhotoGallery(idx)}
                      className="relative aspect-[4/3] rounded overflow-hidden cursor-pointer group border border-gray-200 hover:border-gray-400 transition-all"
                    >
                      <img
                        src={photo}
                        alt={`Property ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {idx === 3 && allPhotos.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">+{allPhotos.length - 4} more</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {allPhotos.length > 4 && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => openPhotoGallery(0)}
                    className="w-full h-auto p-0 mt-2 text-xs"
                  >
                    View all {allPhotos.length} photos
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout for Detailed Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Parking */}
          {(property.parkingSpaces || property.parkingDescription) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Parking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Spaces:</span>{' '}
                  <strong>{property.parkingSpaces || 0}</strong>
                </div>
                {property.parkingDescription && (
                  <p className="text-muted-foreground">{property.parkingDescription}</p>
                )}
                {property.specialInfo && (
                  <p className="text-xs bg-amber-50 p-2 rounded border border-amber-200">{property.specialInfo}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Amenities - Compact Table */}
          {property.amenities && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Amenities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                  {property.amenities.swimmingPool !== undefined && (
                    <div className="flex items-center gap-1.5">
                      {property.amenities.swimmingPool ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-gray-300" />
                      )}
                      <span>Pool</span>
                    </div>
                  )}
                  {property.amenities.spa !== undefined && (
                    <div className="flex items-center gap-1.5">
                      {property.amenities.spa ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-gray-300" />
                      )}
                      <span>SPA</span>
                    </div>
                  )}
                  {property.amenities.clothesline !== undefined && (
                    <div className="flex items-center gap-1.5">
                      {property.amenities.clothesline ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-gray-300" />
                      )}
                      <span>Clothesline</span>
                    </div>
                  )}
                  {property.amenities.offStreetParking !== undefined && (
                    <div className="flex items-center gap-1.5">
                      {property.amenities.offStreetParking ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-gray-300" />
                      )}
                      <span>Off-street Parking</span>
                    </div>
                  )}
                  {property.amenities.lawn !== undefined && (
                    <div className="flex items-center gap-1.5">
                      {property.amenities.lawn ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-gray-300" />
                      )}
                      <span>Lawn</span>
                    </div>
                  )}
                  {property.amenities.garden?.hasGarden && (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      <span>Garden{property.amenities.garden.fencingType && ` (${property.amenities.garden.fencingType})`}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Utilities - Compact List */}
          {property.utilities && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Utilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5 text-sm">
                  {property.utilities.gas?.available && (
                    <div className="flex items-start gap-2">
                      <Flame className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <strong>Gas:</strong> {property.utilities.gas.type}
                        {property.utilities.gas.icpNumber && <span className="text-muted-foreground text-xs block">ICP: {property.utilities.gas.icpNumber}</span>}
                      </div>
                    </div>
                  )}
                  {property.utilities.electricity && (
                    <div className="flex items-start gap-2">
                      <Zap className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <strong>Electricity</strong>
                        {property.utilities.electricity.icpNumber && <span className="text-muted-foreground text-xs block">ICP: {property.utilities.electricity.icpNumber}</span>}
                        {property.utilities.electricity.location && <span className="text-muted-foreground text-xs block">{property.utilities.electricity.location}</span>}
                      </div>
                    </div>
                  )}
                  {property.utilities.water && (
                    <div className="flex items-start gap-2">
                      <Droplet className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <strong>Water</strong>
                        {property.utilities.water.meterNumber && <span className="text-muted-foreground text-xs block">Meter: {property.utilities.water.meterNumber}</span>}
                        {property.utilities.water.location && <span className="text-muted-foreground text-xs block">{property.utilities.water.location}</span>}
                      </div>
                    </div>
                  )}
                  {property.utilities.internet && (
                    <div className="flex items-start gap-2">
                      <Wifi className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <strong>Internet:</strong> {property.utilities.internet.type}
                      </div>
                    </div>
                  )}
                  {property.utilities.hrvSystem && (
                    <div className="flex items-center gap-2">
                      <Wind className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>HRV System</span>
                    </div>
                  )}
                  {property.utilities.fireplace && (
                    <div className="flex items-center gap-2">
                      <Flame className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Fireplace</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chattels - Compact Lists */}
          {property.chattels && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Chattels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {property.chattels.mainList && property.chattels.mainList.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1.5">Main Chattels</p>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {property.chattels.mainList.map((item, idx) => (
                        <span key={idx}>
                          {item.item} ×{item.quantity}
                          {idx < property.chattels!.mainList!.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {property.chattels.additionalList && property.chattels.additionalList.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1.5">Additional (Not affecting tenants)</p>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {property.chattels.additionalList.map((item, idx) => (
                        <span key={idx}>
                          {item.item} ×{item.quantity}
                          {idx < property.chattels!.additionalList!.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Compliance & Safety - Combined Card */}
          <Card className={property.hazards?.hasHazards ? 'border-orange-300' : ''}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Compliance & Safety
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Healthy Homes */}
              {property.healthyHomesCompliance && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {property.healthyHomesCompliance.isCompliant ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-orange-600" />
                    )}
                    <span className="font-semibold text-sm">Healthy Homes Compliant</span>
                  </div>
                  {property.healthyHomesCompliance.complianceDate && (
                    <p className="text-xs text-muted-foreground ml-6">
                      Since {new Date(property.healthyHomesCompliance.complianceDate).toLocaleDateString('en-NZ')}
                    </p>
                  )}
                  {property.healthyHomesCompliance.certificateUrl && (
                    <Button variant="link" size="sm" className="h-auto p-0 ml-6 text-xs">
                      View Certificate
                    </Button>
                  )}
                </div>
              )}

              {/* Insurance */}
              {property.insurance?.hasInsurance && (
                <div className="space-y-1 pt-2 border-t">
                  <p className="font-semibold text-sm">Insurance</p>
                  <div className="text-xs space-y-0.5 ml-2">
                    {property.insurance.insurer && (
                      <div><span className="text-muted-foreground">Provider:</span> {property.insurance.insurer}</div>
                    )}
                    {property.insurance.policyNumber && (
                      <div><span className="text-muted-foreground">Policy:</span> {property.insurance.policyNumber}</div>
                    )}
                    {property.insurance.excessFee !== undefined && (
                      <div><span className="text-muted-foreground">Excess:</span> ${property.insurance.excessFee}</div>
                    )}
                    {property.insurance.expiryDate && (
                      <div><span className="text-muted-foreground">Expires:</span> {new Date(property.insurance.expiryDate).toLocaleDateString('en-NZ')}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Hazards - Prominent Display */}
              {property.hazards?.hasHazards && property.hazards.details && property.hazards.details.length > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="font-semibold text-sm text-orange-900">Hazards Identified</span>
                  </div>
                  <div className="space-y-2">
                    {property.hazards.details.map((hazard, idx) => (
                      <div key={idx} className="text-xs bg-orange-50 p-2 rounded border border-orange-200">
                        <div className="font-medium text-orange-900 flex items-center gap-1.5">
                          {hazard.type}
                          {hazard.isPhysicalDanger && (
                            <Badge variant="destructive" className="text-xs h-4 px-1">
                              Physical Danger
                            </Badge>
                          )}
                        </div>
                        {hazard.description && (
                          <p className="text-muted-foreground mt-1">{hazard.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Keys */}
          {property.keys && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Keys
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {property.keys.mainEntranceDoor !== undefined && property.keys.mainEntranceDoor > 0 && (
                    <div>Main Door: <strong>{property.keys.mainEntranceDoor}</strong></div>
                  )}
                  {property.keys.backDoor !== undefined && property.keys.backDoor > 0 && (
                    <div>Back Door: <strong>{property.keys.backDoor}</strong></div>
                  )}
                  {property.keys.slidingDoor !== undefined && property.keys.slidingDoor > 0 && (
                    <div>Sliding Door: <strong>{property.keys.slidingDoor}</strong></div>
                  )}
                  {property.keys.garageRemote !== undefined && property.keys.garageRemote > 0 && (
                    <div>Garage Remote: <strong>{property.keys.garageRemote}</strong></div>
                  )}
                </div>
                {property.keys.keysPhotoUrl && (
                  <Button variant="outline" size="sm" className="w-full mt-3 h-8 text-xs">
                    <FileText className="h-3 w-3 mr-1.5" />
                    View Keys Photo
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* AI Rental Appraisal - Full Width at Bottom */}
      {property.rentalAppraisal && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-blue-900">
              <TrendingUp className="h-4 w-4" />
              AI Rental Appraisal
            </CardTitle>
            <CardDescription className="text-xs">
              {property.rentalAppraisal.lastGeneratedDate && (
                <>Last generated: {new Date(property.rentalAppraisal.lastGeneratedDate).toLocaleDateString('en-NZ')}</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            {property.rentalAppraisal.suggestedRent !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Suggested Weekly Rent</p>
                <p className="text-3xl font-bold text-blue-600">${property.rentalAppraisal.suggestedRent}</p>
              </div>
            )}
            <div className="flex gap-2">
              {property.rentalAppraisal.reportUrl && (
                <Button variant="outline" size="sm">
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  View Report
                </Button>
              )}
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                Generate New
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
