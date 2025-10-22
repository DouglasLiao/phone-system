import React from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}) => {
  const { t } = useLanguage()
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalPages <= 1) {
    return (
      <div className="bg-primary px-4 py-3 flex items-center justify-between border-t border-primary-dark">
        <div className="flex items-center text-sm text-text">
          {t('table.showing')} {totalItems} {t('table.of')} {totalItems} {t('table.entries')}
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="itemsPerPage" className="text-sm text-text">
            {t('table.rows_per_page')}:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="border border-primary-dark rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-secondary bg-background text-text"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-primary px-4 py-3 flex items-center justify-between border-t border-primary-dark">
      <div className="flex items-center text-sm text-text">
        {t('table.showing')} {startItem} {t('table.to')} {endItem} {t('table.of')} {totalItems} {t('table.entries')}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="itemsPerPage" className="text-sm text-text">
            {t('table.rows_per_page')}:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="border border-primary-dark rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-secondary bg-background text-text"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-text bg-background border border-primary-dark rounded-l-md hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {getVisiblePages().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border transition-colors ${
                page === currentPage
                  ? 'z-10 bg-secondary border-secondary text-primary'
                  : page === '...'
                    ? 'bg-background border-primary-dark text-text-muted cursor-default'
                    : 'bg-background border-primary-dark text-text hover:bg-primary-light'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-text bg-background border border-primary-dark rounded-r-md hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Pagination
