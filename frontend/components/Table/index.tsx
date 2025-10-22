import React from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { TableHeader } from './TableHeader'
import { TableBody } from './TableBody'
import { Pagination } from './Pagination'
import type { PhoneLine } from '../../types'

interface PhoneLineTableProps {
  phoneLines: PhoneLine[]
  currentPage: number
  itemsPerPage: number
  sortColumn: string
  sortDirection: 'asc' | 'desc'
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
  onSort: (column: string) => void
}

export const PhoneLineTable: React.FC<PhoneLineTableProps> = ({
  phoneLines,
  currentPage,
  itemsPerPage,
  sortColumn,
  sortDirection,
  onPageChange,
  onItemsPerPageChange,
  onSort
}) => {
  const { t } = useLanguage()

  const columns = [
    { key: 'phoneNumber', label: t('table.phone_number'), sortable: true },
    { key: 'areaCode', label: t('table.area_code'), sortable: true },
    { key: 'subscriptionPlan', label: t('table.subscription_plan'), sortable: true },
    { key: 'createdAt', label: t('table.created_at'), sortable: true },
    { key: 'id', label: 'ID', sortable: false }
  ]

  // Sort phone lines based on the selected column and direction
  const sortedPhoneLines = [...phoneLines].sort((a, b) => {
    if (!sortColumn) return 0

    let aValue = a[sortColumn as keyof PhoneLine]
    let bValue = b[sortColumn as keyof PhoneLine]

    // Handle nested properties
    if (sortColumn === 'subscriptionPlan') {
      aValue = a.subscriptionPlan?.name || ''
      bValue = b.subscriptionPlan?.name || ''
    }

    // Handle phone number sorting (extract numeric part)
    if (sortColumn === 'phoneNumber') {
      const aNumeric = a.phoneNumber?.replace(/\D/g, '') || ''
      const bNumeric = b.phoneNumber?.replace(/\D/g, '') || ''
      aValue = aNumeric
      bValue = bNumeric
    }

    // Handle date sorting
    if (sortColumn === 'createdAt') {
      aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0
      bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0
    }

    // Normalize undefined/null values before comparison
    aValue = aValue ?? ''
    bValue = bValue ?? ''

    // Convert to strings for comparison if needed
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })


  const totalPages = Math.ceil(phoneLines.length / itemsPerPage)

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-primary-dark">
        <TableHeader
          columns={columns}
          onSort={onSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />
        <TableBody
          phoneLines={sortedPhoneLines}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={phoneLines.length}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={(newItemsPerPage) => {
          onItemsPerPageChange(newItemsPerPage)
          onPageChange(1) // Reset to first page when changing items per page
        }}
      />
    </div>
  )
}

// Re-export individual components for external use
export { TableHeader } from './TableHeader'
export { TableBody } from './TableBody'
export { Pagination } from './Pagination'

export default PhoneLineTable
