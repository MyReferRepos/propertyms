import { useState } from 'react'
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
import { useToast } from '@/hooks/use-toast'
import { rentalReportsAPI } from '@/services/api'
import type { PropertyType, RentalPriceReport } from '@/types'
import { useI18n } from '@/lib/i18n'
import { Loader2 } from 'lucide-react'

interface TenantReportFormProps {
  onReportGenerated: (report: RentalPriceReport) => void
}

export function TenantReportForm({ onReportGenerated }: TenantReportFormProps) {
  const { t } = useI18n()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Form fields
  const [formData, setFormData] = useState({
    suburb: '',
    city: '',
    propertyType: '' as PropertyType | '',
    bedrooms: '',
    bathrooms: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.suburb ||
      !formData.city ||
      !formData.propertyType ||
      !formData.bedrooms ||
      !formData.bathrooms
    ) {
      toast({
        title: t('common.error'),
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const response = await rentalReportsAPI.generateTenantReport({
        suburb: formData.suburb,
        city: formData.city,
        propertyType: formData.propertyType as PropertyType,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
      })

      if (response.success) {
        toast({
          title: t('common.success'),
          description: t('rentalReports.messages.reportGenerated'),
        })
        onReportGenerated(response.data)
      }
    } catch (error) {
      console.error('Failed to generate report:', error)
      toast({
        title: t('common.error'),
        description: t('rentalReports.messages.errorGenerating'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="suburb">{t('rentalReports.form.suburb')} *</Label>
          <Input
            id="suburb"
            placeholder={t('rentalReports.form.selectSuburb')}
            value={formData.suburb}
            onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">{t('rentalReports.form.city')} *</Label>
          <Select
            value={formData.city}
            onValueChange={(value) => setFormData({ ...formData, city: value })}
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
            onValueChange={(value) => setFormData({ ...formData, propertyType: value as PropertyType })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('rentalReports.form.selectPropertyType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="house">{t('rentalReports.propertyTypes.house')}</SelectItem>
              <SelectItem value="apartment">{t('rentalReports.propertyTypes.apartment')}</SelectItem>
              <SelectItem value="townhouse">{t('rentalReports.propertyTypes.townhouse')}</SelectItem>
              <SelectItem value="unit">{t('rentalReports.propertyTypes.unit')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedrooms">{t('rentalReports.form.bedrooms')} *</Label>
          <Select
            value={formData.bedrooms}
            onValueChange={(value) => setFormData({ ...formData, bedrooms: value })}
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

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('rentalReports.messages.generatingReport')}
          </>
        ) : (
          t('rentalReports.tenant.generateButton')
        )}
      </Button>
    </form>
  )
}
