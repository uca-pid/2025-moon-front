"use client"

import { Container } from "@/components/Container"
import { create, edit, getSpareParts, remove } from "@/services/spare-parts"
import type { PaginatedQueryDto, PaginatedResponseDto } from "@/types/paginated.types"
import type { SparePartData } from "@/types/spare-part.types"
import { useEffect, useMemo, useState } from "react"
import { SparePartDialog } from "./modal"
import { Button } from "@/components/ui/button"
import { useQuery } from "react-query"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { Trash, Package, Hash, Box, Search, Plus } from "lucide-react"
import { TableCell, Table, TableHeader, TableBody, TableHead, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const SpareParts = () => {
  const onSave = async () => {
    const isCreating = !editingSparePart?.id
    if (isCreating) {
      await create(editingSparePart!)
    } else {
      await edit(editingSparePart!.id!, editingSparePart!)
    }
    setIsOpen(false)
    setEditingSparePart(null)
    refetch()
  }
  const [isOpen, setIsOpen] = useState(false)
  const [editingSparePart, setEditingSparePart] = useState<SparePartData | null>(null)
  const [pagination, setPagination] = useState<PaginatedQueryDto>({
    page: 1,
    pageSize: 10,
    search: "",
    orderBy: "id",
    orderDir: "asc",
  })
  const [searchInput, setSearchInput] = useState<string>("")

  const { data, refetch, isLoading } = useQuery<PaginatedResponseDto<SparePartData>>(
    ["spare-parts", pagination],
    () => getSpareParts(pagination),
    {
      initialData: undefined,
      cacheTime: 0,
      onSuccess: (data) => {
        if (pagination.page != data.page || pagination.pageSize != data.pageSize) {
          setPagination({
            ...pagination,
            page: data.page,
            pageSize: data.pageSize,
          })
        }
      },
    },
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPagination((prev) => ({ ...prev, page: 1, search: searchInput }))
    }, 1000)
    return () => clearTimeout(timeout)
  }, [searchInput])

  const totalPages = useMemo(() => {
    if (!data) return 1
    return Math.max(1, Math.ceil(data.total / pagination.pageSize))
  }, [data, pagination.pageSize])

  const isFirstPage = pagination.page <= 1
  const isLastPage = pagination.page >= totalPages

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === pagination.page) return
    setPagination((prev) => ({ ...prev, page }))
  }

  const goPrev = () => {
    if (isFirstPage) return
    goToPage(pagination.page - 1)
  }

  const goNext = () => {
    if (isLastPage) return
    goToPage(pagination.page + 1)
  }

  return (
    <Container>
      <SparePartDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        sparePart={editingSparePart}
        onChangeSparePart={setEditingSparePart}
        onSave={onSave}
      />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-primary">Gestión de Repuestos</h1>
          <p className="text-muted-foreground">Administra el inventario de repuestos y su stock</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Inventario de Repuestos</CardTitle>
                <CardDescription>
                  {data?.total || 0} {data?.total === 1 ? "repuesto registrado" : "repuestos registrados"}
                </CardDescription>
              </div>

              <Button
                onClick={() => {
                  setEditingSparePart({ id: undefined, name: "", stock: 0 })
                  setIsOpen(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Repuesto
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mt-4">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Ordenar por</span>
                <Select
                  value={pagination.orderBy}
                  onValueChange={(val) => {
                    setPagination((prev) => ({ ...prev, page: 1, orderBy: val }))
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">ID</SelectItem>
                    <SelectItem value="name">Nombre</SelectItem>
                    <SelectItem value="stock">Stock</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={pagination.orderDir}
                  onValueChange={(val) => {
                    setPagination((prev) => ({ ...prev, page: 1, orderDir: val }))
                  }}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">ASC</SelectItem>
                    <SelectItem value="desc">DESC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground">Cargando repuestos...</p>
                </div>
              </div>
            ) : data?.data && data.data.length > 0 ? (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            ID
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Nombre
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Box className="h-4 w-4" />
                            Stock
                          </div>
                        </TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.data.map((sparePart) => (
                        <TableRow
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            setIsOpen(true)
                            setEditingSparePart(sparePart)
                          }}
                          key={sparePart.id}
                        >
                          <TableCell className="font-medium">{sparePart.id}</TableCell>
                          <TableCell>{sparePart.name}</TableCell>
                          <TableCell>
                            <span className={sparePart.stock && sparePart.stock < 10 ? "text-destructive font-semibold" : ""}>
                              {sparePart.stock}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={"ghost"}
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                remove(sparePart.id!).then(() => refetch())
                              }}
                            >
                              <Trash size={20} className="text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Mostrando {(pagination.page - 1) * pagination.pageSize + 1} a{" "}
                      {Math.min(pagination.page * pagination.pageSize, data.total)} de {data.total} repuestos
                    </p>
                    <Pagination>
                      <PaginationPrevious
                        onClick={goPrev}
                        className={isFirstPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        aria-disabled={isFirstPage}
                        tabIndex={isFirstPage ? -1 : 0}
                      />
                      <PaginationContent>
                        {totalPages <= 5 ? (
                          Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <PaginationItem key={p}>
                              <PaginationLink
                                isActive={pagination.page === p}
                                onClick={() => goToPage(p)}
                                className="cursor-pointer"
                              >
                                {p}
                              </PaginationLink>
                            </PaginationItem>
                          ))
                        ) : (
                          <>
                            <PaginationItem>
                              <PaginationLink
                                isActive={pagination.page === 1}
                                onClick={() => goToPage(1)}
                                className="cursor-pointer"
                              >
                                1
                              </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink
                                isActive={pagination.page === 2}
                                onClick={() => goToPage(2)}
                                className="cursor-pointer"
                              >
                                2
                              </PaginationLink>
                            </PaginationItem>

                            <PaginationItem>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <PaginationEllipsis className="cursor-pointer" />
                                </PopoverTrigger>
                                <PopoverContent className="flex flex-col gap-2 max-h-60 overflow-y-auto w-[75px]">
                                  {Array.from({ length: totalPages - 4 }, (_, i) => i + 3).map((p) => (
                                    <PaginationLink
                                      key={p}
                                      isActive={pagination.page === p}
                                      onClick={() => goToPage(p)}
                                      className="cursor-pointer"
                                    >
                                      {p}
                                    </PaginationLink>
                                  ))}
                                </PopoverContent>
                              </Popover>
                            </PaginationItem>

                            <PaginationItem>
                              <PaginationLink
                                isActive={pagination.page === totalPages - 1}
                                onClick={() => goToPage(totalPages - 1)}
                                className="cursor-pointer"
                              >
                                {totalPages - 1}
                              </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink
                                isActive={pagination.page === totalPages}
                                onClick={() => goToPage(totalPages)}
                                className="cursor-pointer"
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}
                      </PaginationContent>
                      <PaginationNext
                        onClick={goNext}
                        className={isLastPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        aria-disabled={isLastPage}
                        tabIndex={isLastPage ? -1 : 0}
                      />
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="rounded-full bg-muted p-4">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">No hay repuestos registrados</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchInput
                      ? "No se encontraron repuestos con ese criterio de búsqueda"
                      : "Comienza agregando tu primer repuesto al inventario"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
