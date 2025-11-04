import type React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface CustomTableColumn<T> {
  key: string
  label: string
  icon?: React.ReactNode
  render?: (item: T) => React.ReactNode
}

export interface CustomTableProps<T> {
  data: T[]
  columns: CustomTableColumn<T>[]
  onRowClick?: (item: T) => void
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  loading?: boolean
  emptyState?: {
    icon: React.ReactNode
    title: string
    description: string
  }
}

export function CustomTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  loading,
  emptyState,
}: CustomTableProps<T>) {
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="rounded-full bg-accent/50 p-4">{emptyState.icon}</div>
        <div className="text-center">
          <h3 className="font-semibold text-lg text-foreground">{emptyState.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{emptyState.description}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              {columns.map((column) => (
                <TableHead key={column.key} className="h-12">
                  <div className="flex items-center gap-2 text-foreground/80 font-medium">
                    {column.icon}
                    {column.label}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow
                key={idx}
                className={`border-border/50 transition-all duration-200 ${
                  onRowClick ? "cursor-pointer hover:bg-accent/30" : ""
                }`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className="py-4">
                    {column.render ? column.render(item) : item[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 0 && (
        <div className="flex items-center justify-between p-3">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {endIndex} de {totalItems}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-xl"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className="w-9 rounded-xl"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-xl"
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
