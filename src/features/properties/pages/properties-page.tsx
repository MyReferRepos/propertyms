import { useEffect, useState } from 'react'
import { Plus, Grid3x3, List, Search } from 'lucide-react'
import { PropertyCard } from '../components/property-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { propertiesAPI } from '@/services/api'
import type { Property } from '@/types'

export function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<Property['status'] | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    loadProperties()
  }, [statusFilter])

  const loadProperties = async () => {
    try {
      setLoading(true)
      const response = await propertiesAPI.getAll({
        status: statusFilter === 'all' ? undefined : statusFilter,
      })

      if (response.success) {
        setProperties(response.data)
      }
    } catch (error) {
      console.error('Failed to load properties:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter by search term
  const filteredProperties = properties.filter((property) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      property.address.toLowerCase().includes(searchLower) ||
      property.suburb.toLowerCase().includes(searchLower) ||
      property.city.toLowerCase().includes(searchLower)
    )
  })

  const stats = {
    total: properties.length,
    occupied: properties.filter((p) => p.status === 'occupied').length,
    vacant: properties.filter((p) => p.status === 'vacant').length,
    maintenance: properties.filter((p) => p.status === 'maintenance').length,
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
        <p className="text-muted-foreground">Manage your property portfolio</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <button
          className={`rounded-lg border p-4 text-left transition-colors hover:bg-accent ${statusFilter === 'all' ? 'border-primary bg-accent' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Properties</div>
        </button>

        <button
          className={`rounded-lg border p-4 text-left transition-colors hover:bg-accent ${statusFilter === 'occupied' ? 'border-primary bg-accent' : ''}`}
          onClick={() => setStatusFilter('occupied')}
        >
          <div className="text-2xl font-bold text-green-600">{stats.occupied}</div>
          <div className="text-sm text-muted-foreground">Occupied</div>
        </button>

        <button
          className={`rounded-lg border p-4 text-left transition-colors hover:bg-accent ${statusFilter === 'vacant' ? 'border-primary bg-accent' : ''}`}
          onClick={() => setStatusFilter('vacant')}
        >
          <div className="text-2xl font-bold text-amber-600">{stats.vacant}</div>
          <div className="text-sm text-muted-foreground">Vacant</div>
        </button>

        <button
          className={`rounded-lg border p-4 text-left transition-colors hover:bg-accent ${statusFilter === 'maintenance' ? 'border-primary bg-accent' : ''}`}
          onClick={() => setStatusFilter('maintenance')}
        >
          <div className="text-2xl font-bold text-red-600">{stats.maintenance}</div>
          <div className="text-sm text-muted-foreground">Maintenance</div>
        </button>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by address or location..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')}>
            <TabsList>
              <TabsTrigger value="grid">
                <Grid3x3 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>
      </div>

      {/* Properties Grid/List */}
      {filteredProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-6">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No properties found</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm ? 'Try adjusting your search' : 'Get started by adding your first property'}
          </p>
          {!searchTerm && (
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
              : 'flex flex-col gap-4'
          }
        >
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={() => console.log('View property:', property.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
