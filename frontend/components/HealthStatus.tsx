import React from 'react'
import { useHealthCheck } from '../hooks/useApi'
import { Activity, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import type { HealthStatusProps } from '../types'

const HealthStatus: React.FC<HealthStatusProps> = () => {
  const { data: healthData, isLoading, error } = useHealthCheck()
  const { t } = useLanguage()

  const isHealthy = healthData?.status === 'OK'
  const circuitBreakerState = healthData?.circuitBreaker?.state

  const getStatusIcon = () => {
    if (isLoading) return <Activity className="w-4 h-4 animate-pulse text-secondary" />
    if (error) return <XCircle className="w-4 h-4 text-red-500" />
    if (isHealthy && circuitBreakerState === 'CLOSED') return <CheckCircle className="w-4 h-4 text-green-500" />
    if (isHealthy && circuitBreakerState === 'HALF_OPEN') return <AlertCircle className="w-4 h-4 text-yellow-500" />
    if (isHealthy && circuitBreakerState === 'OPEN') return <AlertCircle className="w-4 h-4 text-orange-500" />
    return <AlertCircle className="w-4 h-4 text-yellow-500" />
  }

  const getStatusText = () => {
    if (isLoading) return t('status.checking')
    if (error) return t('status.offline')
    if (isHealthy && circuitBreakerState === 'CLOSED') return t('status.online')
    if (isHealthy && circuitBreakerState === 'HALF_OPEN') return t('status.recovering')
    if (isHealthy && circuitBreakerState === 'OPEN') return t('status.unstable')
    return isHealthy ? t('status.online') : t('status.error')
  }

  const getStatusColor = () => {
    if (isLoading) return 'text-secondary'
    if (error) return 'text-red-600'
    if (isHealthy && circuitBreakerState === 'CLOSED') return 'text-green-600'
    if (isHealthy && circuitBreakerState === 'HALF_OPEN') return 'text-yellow-600'
    if (isHealthy && circuitBreakerState === 'OPEN') return 'text-orange-600'
    return 'text-yellow-600'
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      {getStatusIcon()}
      <span className={`font-medium ${getStatusColor()}`}>
        {t('header.backend_status')}: {getStatusText()}
      </span>
      {healthData && (
        <span className="text-xs text-text-muted">
          (Reqs: {(healthData.circuitBreaker?.successCount || 0) + (healthData.circuitBreaker?.failureCount || 0)})
        </span>
      )}
    </div>
  )
}

export default HealthStatus
