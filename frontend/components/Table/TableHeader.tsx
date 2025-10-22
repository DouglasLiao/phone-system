import React from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

interface TableHeaderProps {
  columns: Array<{
    key: string
    label: string
    sortable?: boolean
  }>
  onSort?: (column: string) => void
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  onSort,
  sortColumn,
  sortDirection
}) => {
  const getSortIcon = (column: any) => {
    if (!column.sortable) return null
    if (sortColumn === column.key) {
      return sortDirection === 'asc'
        ? <ArrowUp className="w-3 h-3" />
        : <ArrowDown className="w-3 h-3" />
    }
    return <ArrowUpDown className="w-3 h-3 opacity-50" />
  }

  return (
    <thead className="bg-primary">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={`px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider select-none ${
              column.sortable
                ? 'cursor-pointer hover:bg-primary-light transition-colors'
                : ''
            }`}
            onClick={() => column.sortable && onSort?.(column.key)}
          >
            <div className="flex items-center space-x-1">
              <span>{column.label}</span>
              {getSortIcon(column)}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default TableHeader
