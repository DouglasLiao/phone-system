import React from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { Phone, CreditCard } from 'lucide-react'
import type { PhoneLine } from '../../types'

interface TableBodyProps {
  phoneLines: PhoneLine[]
  currentPage: number
  itemsPerPage: number
}

export const TableBody: React.FC<TableBodyProps> = ({
  phoneLines,
  currentPage,
  itemsPerPage
}) => {
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedLines = phoneLines.slice(startIndex, endIndex)

  return (
    <tbody className="bg-background divide-y divide-primary-dark">
      {paginatedLines.map((line, index) => (
        <tr
          key={line.id}
          className={`hover:bg-primary-light transition-colors ${
            index % 2 === 0 ? 'bg-background' : 'bg-primary-light'
          }`}
        >
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <Phone className="w-4 h-4 text-text-muted mr-2" />
              <span className="text-sm font-medium text-text">
                {formatPhoneNumber(line.areaCode, line.phoneNumber)}
              </span>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="text-sm text-text">{line.areaCode}</span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 text-text-muted mr-2" />
              <span className="text-sm text-text">
                {line.subscriptionPlan?.name || 'N/A'}
              </span>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="text-sm text-text">
              {line.createdAt ? formatDate(line.createdAt) : 'N/A'}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="text-xs text-text-muted font-mono">
              {line.id.length > 8 ? `${line.id.substring(0, 8)}...` : line.id}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  )
}

export default TableBody
