import { createFileRoute } from '@tanstack/react-router'
import { PropertyDetailPage } from '@/features/properties/pages/property-detail-page'

export const Route = createFileRoute('/_authenticated/properties/$propertyId')({
  component: PropertyDetailPage,
})
