import type { APIResponse } from '@/types'

// API Client Interface
export interface APIClient {
  get<T>(url: string, params?: Record<string, any>): Promise<APIResponse<T>>
  post<T>(url: string, data?: any): Promise<APIResponse<T>>
  put<T>(url: string, data?: any): Promise<APIResponse<T>>
  delete<T>(url: string): Promise<APIResponse<T>>
  patch<T>(url: string, data?: any): Promise<APIResponse<T>>
}

// Mock API Client Implementation
class MockAPIClient implements APIClient {
  private delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  private async mockRequest<T>(data: T, delay = 300): Promise<APIResponse<T>> {
    await this.delay(delay)
    return {
      success: true,
      data,
    }
  }

  async get<T>(_url: string, _params?: Record<string, any>): Promise<APIResponse<T>> {
    // Mock implementation - will be replaced with actual API calls
    // For now, this will be handled by individual service files
    throw new Error('Mock GET not implemented. Use specific service methods.')
  }

  async post<T>(url: string, data?: any): Promise<APIResponse<T>> {
    console.log('[Mock API] POST:', url, data)
    return this.mockRequest(data as T)
  }

  async put<T>(url: string, data?: any): Promise<APIResponse<T>> {
    console.log('[Mock API] PUT:', url, data)
    return this.mockRequest(data as T)
  }

  async delete<T>(url: string): Promise<APIResponse<T>> {
    console.log('[Mock API] DELETE:', url)
    return this.mockRequest({} as T)
  }

  async patch<T>(url: string, data?: any): Promise<APIResponse<T>> {
    console.log('[Mock API] PATCH:', url, data)
    return this.mockRequest(data as T)
  }
}

// Real API Client Implementation (for future use)
class RealAPIClient implements APIClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  setToken(token: string) {
    this.token = token
  }

  private async request<T>(
    method: string,
    url: string,
    data?: any,
    params?: Record<string, any>,
  ): Promise<APIResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const queryString = params
      ? '?' +
        Object.entries(params)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&')
      : ''

    const response = await fetch(`${this.baseURL}${url}${queryString}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<APIResponse<T>> {
    return this.request<T>('GET', url, undefined, params)
  }

  async post<T>(url: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>('POST', url, data)
  }

  async put<T>(url: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>('PUT', url, data)
  }

  async delete<T>(url: string): Promise<APIResponse<T>> {
    return this.request<T>('DELETE', url)
  }

  async patch<T>(url: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>('PATCH', url, data)
  }
}

// Factory function to create API client
export const createAPIClient = (): APIClient => {
  // For MVP demo, always use Mock API
  const useMock = true

  if (useMock) {
    console.log('[API] Using Mock API Client')
    return new MockAPIClient()
  } else {
    console.log('[API] Using Real API Client')
    const baseURL = 'http://localhost:5199/api'
    return new RealAPIClient(baseURL)
  }
}

// Singleton instance
export const apiClient = createAPIClient()
