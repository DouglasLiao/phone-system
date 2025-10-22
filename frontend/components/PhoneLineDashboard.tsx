import React, { useState } from 'react'
import { usePhoneLines } from '../hooks/useApi'
import { useLanguage } from '../contexts/LanguageContext'
import { Phone, CreditCard, Loader2, AlertCircle, Grid3X3, Table2 } from 'lucide-react'
import { PhoneLineTable } from './Table'
import type { PhoneLineCardProps } from '../types'

const PhoneLineDashboard: React.FC = () => {
  const { data: phoneLines, isLoading, error, refetch } = usePhoneLines()
  const { t } = useLanguage()
  const [viewMode, setViewMode] = useState<'dashboard' | 'table'>('dashboard')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        <span className="ml-2 text-text-muted">{t('dashboard.loading_phone_lines')}</span>
      </div>
    )
  }

  if (error) {
    // Determina a mensagem de erro de forma segura
    const errorMessage = error.response?.data?.message || error.message || t('common.error')

    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <h3 className="text-sm font-medium text-red-800">{t('dashboard.error_loading_lines')}</h3>
        </div>
        <p className="mt-2 text-sm text-red-700">
          {errorMessage}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
        >
          {t('dashboard.try_again')}
        </button>
      </div>
    )
  }

  return (
    <div className="bg-primary rounded-lg shadow-md">
      <div className="p-6 border-b border-primary-dark">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Phone className="w-6 h-6 text-secondary mr-2" />
            <h2 className="text-2xl font-bold text-secondary">{t('dashboard.phone_lines')}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-text-muted">
              {t('dashboard.total_lines')}: {phoneLines?.length || 0} {t('dashboard.line_s')}
            </div>
            <div className="flex bg-primary-light rounded-lg p-1">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'dashboard'
                    ? 'bg-background text-secondary shadow-sm'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <Grid3X3 className="w-4 h-4 inline mr-1" />
                {t('dashboard.cards')}
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-background text-secondary shadow-sm'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <Table2 className="w-4 h-4 inline mr-1" />
                {t('dashboard.table')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {!phoneLines || phoneLines.length === 0 ? (
          <div className="text-center py-8">
            <Phone className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text mb-2">
              {t('dashboard.no_phone_lines')}
            </h3>
            <p className="text-text-muted">
              {t('dashboard.create_first_line')}
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'dashboard' ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {phoneLines.map((line) => (
                  <PhoneLineCard key={line.id} phoneLine={line} />
                ))}
              </div>
            ) : (
              <PhoneLineTable
                phoneLines={phoneLines}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
                onSort={(column) => {
                  if (column === sortColumn) {
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                  } else {
                    setSortColumn(column)
                    setSortDirection('asc')
                  }
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

const PhoneLineCard: React.FC<PhoneLineCardProps> = ({ phoneLine }) => {
  const { t } = useLanguage()

  const formatPhoneNumber = (areaCode: number, number: string): string => {
    if (!number) return `(${areaCode}) ${t('dashboard.pending')}`

    // If number is already formatted (contains parentheses), return as is
    if (number.includes('(') && number.includes(')')) {
      return number
    }

    // Brazilian formatting: (11) 99999-9999
    const cleaned = number.replace(/\D/g, '')
    if (cleaned.length === 9) {
      return `(${areaCode}) ${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
    }
    return `(${areaCode}) ${number}`
  }

  return (
    <div className="border border-primary-dark rounded-lg p-4 hover:shadow-md transition-shadow bg-background">
      <div className="mb-3">
        <h3 className="font-semibold text-secondary flex items-center mb-2">
          <Phone className="w-4 h-4 mr-2" />
          {formatPhoneNumber(phoneLine.areaCode, phoneLine.phoneNumber)}
        </h3>
        <p className="text-xs text-text-muted font-mono">
          ID: {phoneLine.id}
        </p>
      </div>

      <div className="space-y-2">

        {phoneLine.subscriptionPlan && (
          <div className="flex items-center text-sm">
            <CreditCard className="w-4 h-4 text-text-muted mr-2" />
            <span className="text-text">
              {phoneLine.subscriptionPlan.name}
            </span>
          </div>
        )}

        {phoneLine.createdAt && (
          <div className="text-xs text-text-muted mt-3 pt-2 border-t border-primary-dark">
            {t('dashboard.created_on')}: {new Date(phoneLine.createdAt).toLocaleDateString('en-US', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default PhoneLineDashboard
