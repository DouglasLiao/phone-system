import { useQuery, useMutation, useQueryClient } from 'react-query'
import { phoneLineService } from '../services/api'
import type {
  PhoneLine,
  SubscriptionPlan,
  CreatePhoneLineRequest,
  UseApiError
} from '../types'

// Hook para buscar planos de assinatura
export const useSubscriptionPlans = () => {
  return useQuery<SubscriptionPlan[], UseApiError>(
    ['subscriptionPlans'],
    phoneLineService.getSubscriptionPlans,
    {
      staleTime: 1000 * 60 * 5, // 5 minutos
      cacheTime: 1000 * 60 * 10 // 10 minutos
    }
  )
}

// Hook para buscar linhas telefônicas
export const usePhoneLines = () => {
  return useQuery<PhoneLine[], UseApiError>(
    ['phoneLines'],
    phoneLineService.getPhoneLines,
    {
      refetchInterval: 30000 // Recarrega a cada 30 segundos
    }
  )
}

// Hook para buscar uma linha telefônica específica
export const usePhoneLine = (id: string) => {
  return useQuery<PhoneLine, UseApiError>(
    ['phoneLine', id],
    () => phoneLineService.getPhoneLineById(id),
    {
      enabled: !!id // Only executes if ID is present
    }
  )
}

// Hook to create new phone line
interface CreatePhoneLineMutationData {
  phoneLineData: CreatePhoneLineRequest
  idempotencyKey: string
}

export const useCreatePhoneLine = () => {
  const queryClient = useQueryClient()

  return useMutation<PhoneLine, UseApiError, CreatePhoneLineMutationData>(
    ({ phoneLineData, idempotencyKey }) =>
      phoneLineService.createPhoneLine(phoneLineData, idempotencyKey),
    {
      onSuccess: () => {
        // Invalidates phone lines query to reload the list
        queryClient.invalidateQueries(['phoneLines'])
      }
    }
  )
}

// Hook para health check
export const useHealthCheck = () => {
  return useQuery(
    ['health'],
    phoneLineService.healthCheck,
    {
      refetchInterval: 60000, // Checks every 1 minute
      retry: 1 // Tries only once in case of error
    }
  )
}
