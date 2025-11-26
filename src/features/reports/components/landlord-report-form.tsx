import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { rentalReportsAPI } from '@/services/api'
import { propertiesAPI } from '@/services/api'
import type { Property, PropertyType, RentalPriceReport } from '@/types'
import { useI18n } from '@/lib/i18n'
import { Loader2 } from 'lucide-react'

interface LandlordReportFormProps {
  onReportGenerated: (report: RentalPriceReport) => void
}

export function LandlordReportForm({ onReportGenerated }: LandlordReportFormProps) {
  const { t } = useI18n()
  const [loading, setLoading] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('')
  const [manualEntry, setManualEntry] = useState(false)

  // Form fields
  const [formData, setFormData] = useState({
    address: '',
    suburb: '',
    city: '',
    propertyType: '' as PropertyType | '',
    bedrooms: '',
    bathrooms: '',
    currentRent: '',
  })

  // Load properties
  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      const response = await propertiesAPI.getAll({})
      if (response.success) {
        setProperties(response.data)
      }
    } catch (error) {
      console.error('Failed to load properties:', error)
    }
  }

  // When property is selected, populate form
  const handlePropertySelect = (propertyId: string) => {
    setSelectedPropertyId(propertyId)
    if (propertyId === 'manual') {
      setManualEntry(true)
      setFormData({
        address: '',
        suburb: '',
        city: '',
        propertyType: '',
        bedrooms: '',
        bathrooms: '',
        currentRent: '',
      })
    } else {
      setManualEntry(false)
      const property = properties.find((p) => p.id === propertyId)
      if (property) {
        setFormData({
          address: property.address,
          suburb: property.suburb,
          city: property.city,
          propertyType: property.type,
          bedrooms: property.bedrooms.toString(),
          bathrooms: property.bathrooms.toString(),
          currentRent: property.currentRent?.toString() || '',
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.address ||
      !formData.suburb ||
      !formData.city ||
      !formData.propertyType ||
      !formData.bedrooms ||
      !formData.bathrooms
    ) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const response = await rentalReportsAPI.generateLandlordReport({
        propertyId: selectedPropertyId !== 'manual' ? selectedPropertyId : undefined,
        address: formData.address,
        suburb: formData.suburb,
        city: formData.city,
        propertyType: formData.propertyType as PropertyType,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        currentRent: formData.currentRent ? parseFloat(formData.currentRent) : undefined,
      })

      if (response.success) {
        toast.success(t('rentalReports.messages.reportGenerated'))
        onReportGenerated(response.data)
      }
    } catch (error) {
      console.error('Failed to generate report:', error)
      toast.error(t('rentalReports.messages.errorGenerating'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Property Selection */}
      <div className="space-y-2">
        <Label>{t('rentalReports.landlord.selectProperty')}</Label>
        <Select value={selectedPropertyId} onValueChange={handlePropertySelect}>
          <SelectTrigger>
            <SelectValue placeholder={t('rentalReports.landlord.selectProperty')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">Enter manually</SelectItem>
            {properties.map((property) => (
              <SelectItem key={property.id} value={property.id}>
                {property.address}, {property.suburb}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Form fields - shown when property selected or manual entry */}
      {(selectedPropertyId || manualEntry) && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!manualEntry}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="suburb">{t('rentalReports.form.suburb')} *</Label>
              <Input
                id="suburb"
                value={formData.suburb}
                onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                disabled={!manualEntry}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">{t('rentalReports.form.city')} *</Label>
              <Select
                value={formData.city}
                onValueChange={(value) => setFormData({ ...formData, city: value })}
                disabled={!manualEntry}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('rentalReports.form.selectCity')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Auckland">Auckland</SelectItem>
                  <SelectItem value="Wellington">Wellington</SelectItem>
                  <SelectItem value="Christchurch">Christchurch</SelectItem>
                  <SelectItem value="Hamilton">Hamilton</SelectItem>
                  <SelectItem value="Tauranga">Tauranga</SelectItem>
                  <SelectItem value="Dunedin">Dunedin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType">{t('rentalReports.form.propertyType')} *</Label>
              <Select
                value={formData.propertyType}
                onValueChange={(value) =>
                  setFormData({ ...formData, propertyType: value as PropertyType })
                }
                disabled={!manualEntry}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('rentalReports.form.selectPropertyType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">{t('rentalReports.propertyTypes.house')}</SelectItem>
                  <SelectItem value="apartment">
                    {t('rentalReports.propertyTypes.apartment')}
                  </SelectItem>
                  <SelectItem value="townhouse">
                    {t('rentalReports.propertyTypes.townhouse')}
                  </SelectItem>
                  <SelectItem value="unit">{t('rentalReports.propertyTypes.unit')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">{t('rentalReports.form.bedrooms')} *</Label>
              <Select
                value={formData.bedrooms}
                onValueChange={(value) => setFormData({ ...formData, bedrooms: value })}
                disabled={!manualEntry}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('rentalReports.form.selectBedrooms')} />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">{t('rentalReports.form.bathrooms')} *</Label>
              <Select
                value={formData.bathrooms}
                onValueChange={(value) => setFormData({ ...formData, bathrooms: value })}
                disabled={!manualEntry}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('rentalReports.form.selectBathrooms')} />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentRent">{t('rentalReports.landlord.currentRent')}</Label>
            <Input
              id="currentRent"
              type="number"
              placeholder={t('rentalReports.landlord.enterRent')}
              value={formData.currentRent}
              onChange={(e) => setFormData({ ...formData, currentRent: e.target.value })}
            />
            <p className="text-sm text-muted-foreground">
              Optional: Enter current rent to get pricing comparison
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('rentalReports.messages.generatingReport')}
              </>
            ) : (
              t('rentalReports.landlord.generateButton')
            )}
          </Button>
        </>
      )}
    </form>
  )
}
