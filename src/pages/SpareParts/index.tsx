import { Container } from '@/components/Container'
import { create, edit, getSpareParts, remove } from '@/services/spare-parts'
import {
  type PaginatedQueryDto,
  type PaginatedResponseDto,
} from '@/types/paginated.types'
import type { SparePartData } from '@/types/spare-part.types'
import { useState } from 'react'
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
} from '@/components/ui/pagination'
import { Trash } from 'lucide-react'

import {
  TableCell,
  Table,
  TableHeader,
  TableHead,
  TableRow,
} from '@/components/ui/table'

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
    order: 'id,asc',
  })
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

  console.log(data)

  return (
    <Container>
      <SparePartDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        sparePart={editingSparePart}
        onChangeSparePart={setEditingSparePart}
        onSave={onSave}
      />
      <div className='flex flex-col items-center justify-center p-6 gap-10'>
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
          <Table className='text-foreground'>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Eliminar</TableHead>
              </TableRow>
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
                  <TableCell colSpan={5}>No hay repuestos</TableCell>
                </TableRow>
              )}
            </TableHeader>
          </Table>

          <Pagination className='flex justify-between items-center w-full text-foreground'>
            <PaginationPrevious>
              <PaginationLink>1</PaginationLink>
            </PaginationPrevious>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink>1</PaginationLink>
              </PaginationItem>
            </PaginationContent>
            <PaginationNext>
              <PaginationLink>1</PaginationLink>
            </PaginationNext>
          </Pagination>
        </div>
      </div>
    </Container>
  )
}
