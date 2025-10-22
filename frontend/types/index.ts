// API Types
export interface SubscriptionPlan {
  id: number
  name: string
}

export interface PhoneLine {
  id: string
  phoneNumber: string
  areaCode: number
  subscriptionPlan: SubscriptionPlan
  createdAt: string
  idempotencyKey?: string
}

export interface CreatePhoneLineRequest {
  areaCode: number
  subscriptionPlanId: number
}

export interface CreatePhoneLineResponse {
  success: boolean
  data: PhoneLine
}

export interface ListPhoneLinesResponse {
  success: boolean
  data: PhoneLine[]
}

export interface ListSubscriptionPlansResponse {
  success: boolean
  data: SubscriptionPlan[]
}

export interface ApiError {
  success: false
  error: string
  message?: string
}

// Health Check Types
export interface HealthCheckResponse {
  status: string
  timestamp: string
  environment: string
  circuitBreaker?: {
    state: string
    failureCount: number
    successCount: number
  }
}

// Form Types
export interface PhoneLineFormData {
  areaCode: string
  subscriptionPlanId: string
}

// Hook Types
export interface UseApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message: string
}

// Component Props Types
export interface PhoneLineCardProps {
  phoneLine: PhoneLine
}

export interface PhoneLineFormProps {
  onSuccess?: () => void
}

export interface HealthStatusProps {
  className?: string
}