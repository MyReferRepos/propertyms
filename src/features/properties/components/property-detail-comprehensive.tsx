/**
 * Comprehensive Property Detail Component
 * Based on Property Information screenshots - displays all detailed property information
 */

import type { Property } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Home,
  MapPin,
  Bed,
  Bath,
  Car,
  Maximize,
  Building2,
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
  Calendar,
  DollarSign,
  TrendingUp,
} from 'lucide-react'

interface PropertyDetailComprehensiveProps {
  property: Property
}

export function PropertyDetailComprehensive({ property }: PropertyDetailComprehensiveProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{property.address}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {property.suburb}, {property.city} {property.postcode}, {property.country}
                </span>
              </CardDescription>
            </div>
            <Button variant="outline">Show map</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Area */}
          {property.area && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Area</p>
              <p className="capitalize">{property.area}</p>
            </div>
          )}

          {/* Dwelling Type */}
          {property.dwellingType && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dwelling Type *</p>
              <p className="capitalize">{property.dwellingType.replace(/-/g, ' / ')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Room Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Room Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Bedroom</p>
                <p className="text-lg">{property.bedrooms}</p>
              </div>
            </div>

            {property.livingAreas !== undefined && (
              <div>
                <p className="text-sm font-medium">Living area</p>
                <p className="text-lg">{property.livingAreas}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Bath className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Bathroom</p>
                <p className="text-lg">{property.bathrooms}</p>
              </div>
            </div>

            {property.separateToilets !== undefined && (
              <div>
                <p className="text-sm font-medium">Separate toilet</p>
                <p className="text-lg">{property.separateToilets}</p>
              </div>
            )}

            {property.hasFloorPlan !== undefined && (
              <div>
                <p className="text-sm font-medium">Floor Plan</p>
                <p className="text-lg">{property.hasFloorPlan ? 'Yes' : 'No'}</p>
                {property.hasFloorPlan && property.floorPlanUrl && (
                  <Button variant="link" size="sm" className="p-0 h-auto">
                    View Plan
                  </Button>
                )}
              </div>
            )}
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {property.studyRooms !== undefined && (
              <div>
                <p className="text-sm font-medium">Study room</p>
                <p className="text-lg">{property.studyRooms}</p>
              </div>
            )}

            {property.familyLounges !== undefined && (
              <div>
                <p className="text-sm font-medium">Family Lounge</p>
                <p className="text-lg">{property.familyLounges}</p>
              </div>
            )}

            {property.laundryRooms !== undefined && (
              <div>
                <p className="text-sm font-medium">Laundry room</p>
                <p className="text-lg">{property.laundryRooms}</p>
              </div>
            )}

            {property.sheds !== undefined && (
              <div>
                <p className="text-sm font-medium">No of shed</p>
                <p className="text-lg">{property.sheds}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Parking & Special Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Parking Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Car space</p>
            <p>{property.parkingDescription || `${property.parkingSpaces} parking spaces`}</p>
          </div>

          {property.specialInfo && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Special info</p>
              <p>{property.specialInfo}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Amenities */}
      {property.amenities && (
        <Card>
          <CardHeader>
            <CardTitle>Amenities & Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities.swimmingPool !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Swimming pool:</span>
                  <span>{property.amenities.swimmingPool ? 'Yes' : 'No'}</span>
                </div>
              )}

              {property.amenities.spa !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">SPA:</span>
                  <span>{property.amenities.spa ? 'Yes' : 'No'}</span>
                </div>
              )}

              {property.amenities.clothesline !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Clothesline:</span>
                  <span>{property.amenities.clothesline ? 'Yes' : 'No'}</span>
                </div>
              )}

              {property.amenities.offStreetParking !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Off-street Parking:</span>
                  <span>{property.amenities.offStreetParking ? 'Yes' : 'No'}</span>
                </div>
              )}

              {property.amenities.lawn !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Lawn*:</span>
                  <span>{property.amenities.lawn ? 'Yes' : 'No'}</span>
                </div>
              )}

              {property.amenities.garden && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Garden*:</span>
                  <span>
                    {property.amenities.garden.hasGarden
                      ? property.amenities.garden.fencingType || 'Yes'
                      : 'No'}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Utilities */}
      {property.utilities && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Utilities & Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Gas */}
            {property.utilities.gas && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gas*</p>
                <p>
                  {property.utilities.gas.available ? 'Yes' : 'No'}
                  {property.utilities.gas.available && property.utilities.gas.type && (
                    <span className="text-muted-foreground"> - {property.utilities.gas.type}</span>
                  )}
                  {property.utilities.gas.icpNumber && (
                    <span className="text-muted-foreground"> (ICP: {property.utilities.gas.icpNumber})</span>
                  )}
                </p>
              </div>
            )}

            {/* Electricity */}
            {property.utilities.electricity && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Electricity* ICP and location</p>
                <p>
                  {property.utilities.electricity.icpNumber || 'Not specified'}
                  {property.utilities.electricity.location && (
                    <span className="text-muted-foreground"> - {property.utilities.electricity.location}</span>
                  )}
                </p>
              </div>
            )}

            {/* Water */}
            {property.utilities.water && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Water* Meter no and location</p>
                <p>
                  {property.utilities.water.meterNumber || 'Not specified'}
                  {property.utilities.water.location && (
                    <span className="text-muted-foreground"> - {property.utilities.water.location}</span>
                  )}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.utilities.septicTank !== undefined && (
                <div className="flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Septic Tank:</span>
                  <span>{property.utilities.septicTank ? 'Yes' : 'No'}</span>
                </div>
              )}

              {property.utilities.waterFilterSystem !== undefined && (
                <div className="flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Water filter system:</span>
                  <span>{property.utilities.waterFilterSystem ? 'Yes' : 'No'}</span>
                </div>
              )}

              {property.utilities.internet && (
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Internet*:</span>
                  <span>{property.utilities.internet.type || 'Available'}</span>
                </div>
              )}

              {property.utilities.hrvSystem !== undefined && (
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">HRV system:</span>
                  <span>{property.utilities.hrvSystem ? 'Yes' : 'No'}</span>
                </div>
              )}

              {property.smokeAlarmCompliance && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Smoke alarm* complied:</span>
                  <span className="capitalize">{property.smokeAlarmCompliance.replace('-', ' ')}</span>
                </div>
              )}

              {property.utilities.fireplace !== undefined && (
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Fireplace:</span>
                  <span>{property.utilities.fireplace ? 'Yes' : 'No'}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chattels */}
      {property.chattels && (
        <Card>
          <CardHeader>
            <CardTitle>Chattel List</CardTitle>
            <CardDescription>Fixtures and furnishings included with the property</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {property.chattels.mainList.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Main Chattels</p>
                <p className="text-sm">
                  {property.chattels.mainList.map((item, idx) => (
                    <span key={idx}>
                      {item.item}
                      {item.quantity > 1 && ` *${item.quantity}`}
                      {idx < property.chattels!.mainList.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
              </div>
            )}

            {property.chattels.additionalList && property.chattels.additionalList.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Additional Chattel list (Not affect tenants enjoy when staying at the place):
                </p>
                <p className="text-sm">
                  {property.chattels.additionalList.map((item, idx) => (
                    <span key={idx}>
                      {item.item}
                      {item.quantity > 1 && ` *${item.quantity}`}
                      {idx < property.chattels!.additionalList!.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Insurance */}
      {property.insurance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Insurance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Insurance</p>
              <p>{property.insurance.hasInsurance ? 'Yes' : 'No'}</p>
            </div>

            {property.insurance.hasInsurance && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {property.insurance.insurer && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Insurer</p>
                      <p>{property.insurance.insurer}</p>
                    </div>
                  )}

                  {property.insurance.policyNumber && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Policy</p>
                      <p>{property.insurance.policyNumber}</p>
                    </div>
                  )}

                  {property.insurance.excessFee !== undefined && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Excess Fee</p>
                      <p>${property.insurance.excessFee}</p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expire on specific date?</p>
                  <p>
                    {property.insurance.isMonthlyAutoRenewal
                      ? 'No: Monthly payment with automatic renewal.'
                      : `Yes on ${new Date(property.insurance.expiryDate!).toLocaleDateString('en-NZ', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}`}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Healthy Homes Compliance */}
      {property.healthyHomesCompliance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {property.healthyHomesCompliance.isCompliant ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-orange-600" />
              )}
              Healthy home compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {property.healthyHomesCompliance.isCompliant ? (
              <>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>
                    Yes on{' '}
                    {new Date(property.healthyHomesCompliance.complianceDate!).toLocaleDateString('en-NZ', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {property.healthyHomesCompliance.certificateUrl && (
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Compliance certificate attachment</p>
                        <p className="text-xs text-muted-foreground">
                          updated on{' '}
                          {new Date(property.healthyHomesCompliance.certificateUpdatedDate!).toLocaleDateString(
                            'en-NZ'
                          )}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-orange-600" />
                  <span>
                    No, Will need to comply before{' '}
                    {property.healthyHomesCompliance.needsComplianceBy &&
                      new Date(property.healthyHomesCompliance.needsComplianceBy).toLocaleDateString('en-NZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                  </span>
                </div>
                {property.healthyHomesCompliance.reportUrl && (
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Healthy home report attachment</p>
                        <p className="text-xs text-muted-foreground">
                          updated on{' '}
                          {new Date(property.healthyHomesCompliance.reportUpdatedDate!).toLocaleDateString('en-NZ')}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Keys Information */}
      {property.keys && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Key info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {property.keys.mainEntranceDoor && `Main Entrance Door *${property.keys.mainEntranceDoor}, `}
              {property.keys.backDoor && `Back door *${property.keys.backDoor}, `}
              {property.keys.slidingDoor && `Sliding door *${property.keys.slidingDoor}, `}
              {property.keys.garageRemote && `Garage remote: ${property.keys.garageRemote}`}
              {property.keys.keysPhotoUrl && ' (attachments of photo for keys)'}
            </p>
            {property.keys.keysPhotoUrl && (
              <Button variant="outline" size="sm" className="mt-3">
                <FileText className="h-4 w-4 mr-2" />
                View Keys Photo
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Hazards & Risks */}
      {property.hazards && property.hazards.hasHazards && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="h-5 w-5" />
              Hazards or risk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium">Yes</span>
            </div>
            {property.hazards.details && property.hazards.details.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Please give more information if Yes:</p>
                {property.hazards.details.map((hazard, idx) => (
                  <div key={idx} className="text-sm">
                    {hazard.type}
                    {hazard.isPhysicalDanger && (
                      <Badge variant="destructive" className="ml-2">
                        physical danger
                      </Badge>
                    )}
                    {hazard.description && <p className="text-muted-foreground mt-1">{hazard.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Rental Appraisal */}
      {property.rentalAppraisal && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Rental Appraisal (AI tech)
            </CardTitle>
            <CardDescription>Generate a report for checking and editing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {property.rentalAppraisal.lastGeneratedDate && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Last generated:{' '}
                  {new Date(property.rentalAppraisal.lastGeneratedDate).toLocaleDateString('en-NZ')}
                </p>
              </div>
            )}
            {property.rentalAppraisal.suggestedRent && (
              <div>
                <p className="text-sm font-medium">Suggested Weekly Rent</p>
                <p className="text-2xl font-bold text-blue-600">${property.rentalAppraisal.suggestedRent}</p>
              </div>
            )}
            <div className="flex gap-2">
              {property.rentalAppraisal.reportUrl && (
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Report
                </Button>
              )}
              <Button variant="default">
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate New Appraisal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
