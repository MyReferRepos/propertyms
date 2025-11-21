import type { Property, APIResponse } from '@/types'
import { mockProperties, getPropertyById, getPropertiesByStatus } from '@/data/mock'

// Simulate API delay
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const propertiesAPI = {
  async getAll(filters?: {
    status?: Property['status']
    city?: string
    search?: string
  }): Promise<APIResponse<Property[]>> {
    await delay()

    let properties = [...mockProperties]

    if (filters?.status) {
      properties = properties.filter((p) => p.status === filters.status)
    }

    if (filters?.city) {
      properties = properties.filter((p) => p.city === filters.city)
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      properties = properties.filter(
        (p) =>
          p.address.toLowerCase().includes(searchLower) ||
          p.suburb.toLowerCase().includes(searchLower),
      )
    }

    return {
      success: true,
      data: properties,
    }
  },

  async getById(id: string): Promise<APIResponse<Property | null>> {
    await delay()

    const property = getPropertyById(id)

    return {
      success: true,
      data: property || null,
    }
  },

  async create(property: Omit<Property, 'id'>): Promise<APIResponse<Property>> {
    await delay()

    const newProperty: Property = {
      ...property,
      id: `prop-${Date.now()}`,
    }

    // In real implementation, this would POST to the API
    mockProperties.push(newProperty)

    return {
      success: true,
      data: newProperty,
      message: 'Property created successfully',
    }
  },

  async update(id: string, updates: Partial<Property>): Promise<APIResponse<Property>> {
    await delay()

    const index = mockProperties.findIndex((p) => p.id === id)

    if (index === -1) {
      throw new Error('Property not found')
    }

    mockProperties[index] = {
      ...mockProperties[index],
      ...updates,
    }

    return {
      success: true,
      data: mockProperties[index],
      message: 'Property updated successfully',
    }
  },

  async delete(id: string): Promise<APIResponse<void>> {
    await delay()

    const index = mockProperties.findIndex((p) => p.id === id)

    if (index === -1) {
      throw new Error('Property not found')
    }

    mockProperties.splice(index, 1)

    return {
      success: true,
      data: undefined,
      message: 'Property deleted successfully',
    }
  },

  async getByStatus(status: Property['status']): Promise<APIResponse<Property[]>> {
    await delay()

    const properties = getPropertiesByStatus(status)

    return {
      success: true,
      data: properties,
    }
  },
}
