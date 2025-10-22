import axios, { AxiosResponse } from 'axios'
import type {
  CreatePhoneLineRequest,
  CreatePhoneLineResponse,
  ListPhoneLinesResponse,
  ListSubscriptionPlansResponse,
  HealthCheckResponse,
  PhoneLine,
  SubscriptionPlan
} from '../types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000, // 30 segundos timeout
  headers: {
    'Content-Type': 'application/json'
  }
})

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const phoneLineService = {
  // Get subscription plans
  getSubscriptionPlans: async(): Promise<SubscriptionPlan[]> => {
    const response: AxiosResponse<ListSubscriptionPlansResponse> = await api.get('/subscription-plans')
    return response.data.data // Returns only the plans data
  },

  // Create new phone line
  createPhoneLine: async(
    phoneLineData: CreatePhoneLineRequest,
    idempotencyKey: string
  ): Promise<PhoneLine> => {
    const response: AxiosResponse<CreatePhoneLineResponse> = await api.post('/phone-lines', phoneLineData, {
      headers: {
        'Idempotency-Key': idempotencyKey
      }
    })
    return response.data.data // Returns only the created line data
  },

  // Get all phone lines
  getPhoneLines: async(): Promise<PhoneLine[]> => {
    const response: AxiosResponse<ListPhoneLinesResponse> = await api.get('/phone-lines')
    return response.data.data // Returns only the lines data
  },

  // Get phone line by ID
  getPhoneLineById: async(id: string): Promise<PhoneLine> => {
    const response: AxiosResponse<CreatePhoneLineResponse> = await api.get(`/phone-lines/${id}`)
    return response.data.data // Returns only the line data
  },

  // Health check
  healthCheck: async(): Promise<HealthCheckResponse> => {
    // Health check está fora do /api prefix
    const healthApi = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000
    })
    const response: AxiosResponse<HealthCheckResponse> = await healthApi.get('/health')
    return response.data
  }
}

export default api
