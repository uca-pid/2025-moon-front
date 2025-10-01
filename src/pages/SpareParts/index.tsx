import { Container } from '@/components/Container'
import { create, edit, getSpareParts, remove } from '@/services/spare-parts'
import {
  type PaginatedQueryDto,
  type PaginatedResponseDto,
} from '@/types/paginated.types'
import type { SparePartData } from '@/types/spare-part.types'
import { useEffect, useMemo, useState } from 'react'
import { SparePartDialog } from './modal'
import { Button } from '@/components/ui/button'
import { useQuery } from 'react-query'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import { Trash } from 'lucide-react'

import {
  TableCell,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

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
  const [editingSparePart, setEditingSparePart] =
    useState<SparePartData | null>(null)
  const [pagination, setPagination] = useState<PaginatedQueryDto>({
    page: 1,
    pageSize: 10,
    search: '',
    orderBy: 'id',
    orderDir: 'asc',
  })
  const [searchInput, setSearchInput] = useState<string>('')

  const { data, refetch } = useQuery<PaginatedResponseDto<SparePartData>>(
    ['spare-parts', pagination],
    () => getSpareParts(pagination),
    {
      initialData: undefined,
      cacheTime: 0,
      onSuccess: (data) => {
        if (
          pagination.page != data.page ||
          pagination.pageSize != data.pageSize
        ) {
          setPagination({
            ...pagination,
            page: data.page,
            pageSize: data.pageSize,
          })
        }
      },
    }
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
      <div className='flex flex-col items-center justify-center p-6 gap-10 text-foreground'>
        <div className='w-full flex justify-around'>
          <h1 className='text-2xl font-bold text-primary w-full text-left'>
            Repuestos
          </h1>
          <Button
            onClick={() => {
              setEditingSparePart({ id: undefined, name: '', stock: 0 })
              setIsOpen(true)
            }}
          >
            Agregar repuesto
          </Button>
        </div>
        <div className='flex flex-col gap-10 w-[90%]'>
          <div className='flex flex-col sm:flex-row gap-4 sm:items-center justify-between'>
            <div className='flex items-center gap-2 w-full sm:w-1/2'>
              <Input
                placeholder='Buscar por nombre...'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className='text-foreground'
              />
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-muted-foreground'>Ordenar por</span>
              <Select
                value={pagination.orderBy}
                onValueChange={(val) => {
                  setPagination((prev) => ({ ...prev, page: 1, orderBy: val }))
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='id'>ID</SelectItem>
                  <SelectItem value='name'>Nombre</SelectItem>
                  <SelectItem value='stock'>Stock</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={pagination.orderDir}
                onValueChange={(val) => {
                  setPagination((prev) => ({ ...prev, page: 1, orderDir: val }))
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='asc'>ASC</SelectItem>
                  <SelectItem value='desc'>DESC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table className='text-foreground'>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Eliminar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data && data.data.length > 0 ? (
                data.data.map((sparePart) => (
                  <TableRow
                    className='cursor-pointer'
                    onClick={() => {
                      setIsOpen(true)
                      setEditingSparePart(sparePart)
                    }}
                    key={sparePart.id}
                  >
                    <TableCell>{sparePart.id}</TableCell>
                    <TableCell>{sparePart.name}</TableCell>
                    <TableCell>{sparePart.stock}</TableCell>
                    <TableCell>
                      <Button
                        variant={'ghost'}
                        size='icon'
                        onClick={(e) => {
                          e.stopPropagation()
                          remove(sparePart.id!).then(() => refetch())
                        }}
                      >
                        <Trash size={20} className='text-destructive' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className='text-center'>
                  <TableCell colSpan={4}>No hay repuestos</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Pagination className='flex justify-between items-center w-full text-foreground'>
            <PaginationPrevious
              onClick={goPrev}
              className={isFirstPage ? 'pointer-events-none opacity-50' : ''}
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
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      isActive={pagination.page === 2}
                      onClick={() => goToPage(2)}
                    >
                      2
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <Popover>
                      <PopoverTrigger asChild>
                        <PaginationEllipsis className='cursor-pointer' />
                      </PopoverTrigger>
                      <PopoverContent className='flex flex-col gap-2 max-h-60 overflow-y-auto w-[75px]'>
                        {Array.from({ length: totalPages - 4 }, (_, i) => i + 3).map((p) => (
                          <PaginationLink
                            key={p}
                            isActive={pagination.page === p}
                            onClick={() => goToPage(p)}
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
                    >
                      {totalPages - 1}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      isActive={pagination.page === totalPages}
                      onClick={() => goToPage(totalPages)}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
            </PaginationContent>
            <PaginationNext
              onClick={goNext}
              className={isLastPage ? 'pointer-events-none opacity-50' : ''}
              aria-disabled={isLastPage}
              tabIndex={isLastPage ? -1 : 0}
            />
          </Pagination>
        </div>
      </div>
    </Container>
  )
}
