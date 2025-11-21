/**
 * Simplified HTTP Client for MVP Demo
 */

import axios, { type AxiosInstance } from 'axios'

// Simple HTTP client without complex interceptors
export const http: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5199/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Simple request interceptor to add auth token
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Simple response interceptor
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)
