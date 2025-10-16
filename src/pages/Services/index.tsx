import { Container } from '@/components/Container'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Hash, Package, Box, Trash, Plus } from 'lucide-react'
import { CustomPagination } from '@/components/CustomPagination'
import { useEffect, useMemo, useState } from 'react'
import type { CreateService, Service } from '@/types/services.types'
import { useQuery } from 'react-query'
import type {
  PaginatedQueryDto,
  PaginatedResponseDto,
} from '@/types/paginated.types'
import {
  createService,
  deleteService,
  getServices,
  updateService,
} from '@/services/services'
import { ServiceDialog } from './modal'
import type { SparePart } from '@/types/spare-part.types'
import { Badge } from '@/components/ui/badge'
import { getServiceStatus, ServiceStatusEnum } from '@/helpers/service-status'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const Services = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<CreateService | null>(
    null
  )
  const [pagination, setPagination] = useState<PaginatedQueryDto>({
    page: 1,
    pageSize: 10,
    search: '',
    orderBy: 'id',
    orderDir: 'asc',
  })
  const [searchInput, setSearchInput] = useState<string>('')

  const mapToCreateService = (service: Service): CreateService => {
    const rawSpareParts = (service?.spareParts as SparePart[]) ?? []
    const mappedSpareParts = rawSpareParts
      .map((sp) => {
        const spRec = (sp ?? {}) as Record<string, unknown>
        const nested = (spRec.sparePart as Record<string, unknown>) || undefined
        const sparePartId = ((): number | null => {
          if (typeof spRec.sparePartId !== 'undefined')
            return Number(spRec.sparePartId)
          if (nested && typeof nested.id !== 'undefined')
            return Number(nested.id)
          return null
        })()
        let quantity = Number(spRec.quantity)
        if (!quantity || quantity < 1) quantity = 1
        if (sparePartId == null || !Number.isFinite(sparePartId)) return null
        return { sparePartId, quantity, serviceId: service.id, sparePart: sp }
      })
      .filter(
        (
          v
        ): v is {
          sparePartId: number
          quantity: number
          serviceId: number
          sparePart: SparePart
        } => v !== null
      )

    return {
      id: typeof service.id !== 'undefined' ? Number(service.id) : undefined,
      name: (service.name as string) ?? '',
      price: Number(service.price),
      spareParts: mappedSpareParts,
    }
  }

  const onSave = async () => {
    const isCreating = !editingService?.id
    if (isCreating) {
      const payload = mapToCreateService(editingService as Service)
      await createService(payload)
    } else {
      const payload = mapToCreateService(editingService as Service)
      await updateService(payload)
    }
    setIsOpen(false)
    setEditingService(null)
    refetch()
  }

  const { data, refetch, isLoading } = useQuery<PaginatedResponseDto<Service>>(
    ['services', pagination],
    () => getServices(pagination),
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPagination((prev) => ({ ...prev, page: 1, search: searchInput }))
    }, 1000)
    return () => clearTimeout(timeout)
  }, [searchInput])

  return (
    <Container>
      <ServiceDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        service={editingService as Service}
        onChangeService={setEditingService}
        onSave={onSave}
      />
      <div className='flex flex-col gap-6 p-6'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-bold text-primary'>
            Gestión de Servicios
          </h1>
          <p className='text-muted-foreground'>
            Administra el inventario de servicios y su precio
          </p>
        </div>
        <Card>
          <CardHeader>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div>
                <CardTitle>Inventario de Servicios</CardTitle>
                <CardDescription>
                  {data?.total || 0}{' '}
                  {data?.total === 1
                    ? 'servicio registrado'
                    : 'servicios registrados'}
                </CardDescription>
              </div>

              <Button
                onClick={() => {
                  setEditingService({ name: '', price: 0, spareParts: [] })
                  setIsOpen(true)
                }}
              >
                <Plus className='h-4 w-4 mr-2' />
                Agregar Servicio
              </Button>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 sm:items-center justify-between mt-4'>
              <div className='relative w-full sm:w-96'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Buscar por nombre...'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className='pl-10'
                />
              </div>
              {/* <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Ordenar por</span>
                <Select
                  value={orderBy}
                  onValueChange={(val) => {
                    setOrderBy(val)
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">ID</SelectItem>
                    <SelectItem value="name">Nombre</SelectItem>
                    <SelectItem value="price">Precio</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={orderDir}
                  onValueChange={(val) => {
                    setOrderDir(val)
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
              </div> */}
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className='flex items-center justify-center py-12'>
                <div className='flex flex-col items-center gap-2'>
                  <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
                  <p className='text-sm text-muted-foreground'>
                    Cargando servicios...
                  </p>
                </div>
              </div>
            ) : data?.data && data.data.length > 0 ? (
              <>
                <div className='rounded-md border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <div className='flex items-center gap-2'>
                            <Hash className='h-4 w-4' />
                            ID
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className='flex items-center gap-2'>
                            <Package className='h-4 w-4' />
                            Nombre
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className='flex items-center gap-2'>
                            <Box className='h-4 w-4' />
                            Precio
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className='flex items-center gap-2'>
                            <Check className='h-4 w-4' />
                            Estado
                          </div>
                        </TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.data.map((service) => (
                        <TableRow
                          className='cursor-pointer hover:bg-muted/50'
                          onClick={() => {
                            setIsOpen(true)
                            setEditingService(
                              mapToCreateService(service as Service)
                            )
                          }}
                          key={service.id}
                        >
                          <TableCell className='font-medium'>
                            {service.id}
                          </TableCell>
                          <TableCell>{service.name}</TableCell>
                          <TableCell>
                            <span>{service.price}</span>
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge
                                  variant={
                                    getServiceStatus(service) ===
                                    ServiceStatusEnum.ACTIVO
                                      ? 'success'
                                      : getServiceStatus(service) ===
                                        ServiceStatusEnum.FALTA_STOCK
                                      ? 'warning'
                                      : 'destructive'
                                  }
                                >
                                  {getServiceStatus(service)}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent
                                className={
                                  getServiceStatus(service) !==
                                  ServiceStatusEnum.BLOQUEADO
                                    ? 'hidden'
                                    : ''
                                }
                              >
                                <p>
                                  El servicio está bloqueado hasta que se vuelva
                                  a guardar, ya que previamente se eliminó un
                                  repuesto requerido para el servicio.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={'ghost'}
                              size='icon'
                              onClick={(e) => {
                                e.stopPropagation()
                                setIsAlertDialogOpen(true)
                                setEditingService(service)
                              }}
                            >
                              <Trash size={20} className='text-destructive' />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className='flex items-center justify-between mt-4'>
                  <p className='text-sm text-muted-foreground'>
                    Mostrando {(pagination.page - 1) * pagination.pageSize + 1}{' '}
                    a{' '}
                    {Math.min(
                      pagination.page * pagination.pageSize,
                      data.total
                    )}{' '}
                    de {data.total} servicios
                  </p>
                  <CustomPagination
                    goPrev={goPrev}
                    isFirstPage={isFirstPage}
                    totalPages={totalPages}
                    pagination={pagination}
                    goToPage={goToPage}
                    goNext={goNext}
                    isLastPage={isLastPage}
                  />
                </div>
              </>
            ) : (
              <div className='flex flex-col items-center justify-center py-12 gap-4'>
                <div className='rounded-full bg-muted p-4'>
                  <Package className='h-8 w-8 text-muted-foreground' />
                </div>
                <div className='text-center'>
                  <h3 className='font-semibold text-lg'>
                    No hay servicios registrados
                  </h3>
                  <p className='text-sm text-muted-foreground mt-1'>
                    {searchInput
                      ? 'No se encontraron servicios con ese criterio de búsqueda'
                      : 'Comienza agregando tu primer servicio'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <AlertDialog
          open={isAlertDialogOpen}
          onOpenChange={setIsAlertDialogOpen}
        >
          <AlertDialogContent className='text-foreground'>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Estás por eliminar el servicio {editingService?.name}. Esta acción
              no se puede deshacer.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  deleteService(editingService!.id!).then(() => refetch())
                }
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Container>
  )
}
