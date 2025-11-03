import { Container } from "@/components/Container"
import { create, edit, getSpareParts, remove } from "@/services/spare-parts"
import type { PaginatedQueryDto, PaginatedResponseDto } from "@/types/paginated.types"
import type { SparePartData } from "@/types/spare-part.types"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { useQuery } from "react-query"
import { Package, Hash, Box, Search, Plus, Trash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CustomTable } from "@/components/CustomTable"
import { CustomDialog } from "@/components/CustomDialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export function SpareParts() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
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

  return (
    <Container>
      <CustomDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={editingSparePart?.id ? `Editando repuesto #${editingSparePart.id}` : "Creando repuesto"}
        onSave={onSave}
        saveDisabled={!editingSparePart?.name}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={editingSparePart?.name || ""}
              onChange={(e) => setEditingSparePart({ ...editingSparePart!, name: e.target.value })}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              min={0}
              value={editingSparePart?.stock || 0}
              onChange={(e) =>
                setEditingSparePart({ ...editingSparePart!, stock: Math.max(0, Number(e.target.value)) })
              }
              className="rounded-xl"
            />
          </div>
        </div>
      </CustomDialog>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Gestión de Repuestos</h1>
          <p className="text-muted-foreground">Administra el inventario de repuestos y su stock</p>
        </div>

        <div className="bg-card rounded-3xl shadow-sm border border-border/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Inventario de Repuestos</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {data?.total || 0} {data?.total === 1 ? "repuesto registrado" : "repuestos registrados"}
              </p>
            </div>

            <Button
              onClick={() => {
                setEditingSparePart({ id: undefined, name: "", stock: 0 })
                setIsOpen(true)
              }}
              className="rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Repuesto
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-6">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 rounded-xl"
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
                <SelectTrigger className="w-32 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
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
                <SelectTrigger className="w-24 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="asc">ASC</SelectItem>
                  <SelectItem value="desc">DESC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <CustomTable
            data={data?.data || []}
            columns={[
              {
                key: "id",
                label: "ID",
                icon: <Hash className="h-4 w-4" />,
                render: (item) => <span className="font-medium">{item.id}</span>,
              },
              {
                key: "name",
                label: "Nombre",
                icon: <Package className="h-4 w-4" />,
                render: (item) => item.name,
              },
              {
                key: "stock",
                label: "Stock",
                icon: <Box className="h-4 w-4" />,
                render: (item) => (
                  <Badge variant={item.stock && item.stock < 10 ? "destructive" : "secondary"} className="rounded-full">
                    {item.stock || 0}
                  </Badge>
                ),
              },
              {
                key: "actions",
                label: "Acciones",
                render: (item) => (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingSparePart(item)
                      setIsAlertDialogOpen(true)
                    }}
                    className="rounded-xl text-destructive hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                ),
              },
            ]}
            onRowClick={(item) => {
              setIsOpen(true)
              setEditingSparePart(item)
            }}
            currentPage={pagination.page}
            totalPages={totalPages}
            totalItems={data?.total || 0}
            itemsPerPage={pagination.pageSize}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            loading={isLoading}
            emptyState={{
              icon: <Package className="h-8 w-8 text-muted-foreground" />,
              title: "No hay repuestos registrados",
              description: searchInput
                ? "No se encontraron repuestos con ese criterio de búsqueda"
                : "Comienza agregando tu primer repuesto al inventario",
            }}
          />
        </div>

        <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
          <AlertDialogContent className="text-foreground rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar repuesto?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Estás por eliminar el repuesto {editingSparePart?.name} con stock {editingSparePart?.stock}. Esta acción
              no se puede deshacer.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => remove(editingSparePart!.id!).then(() => refetch())}
                className="rounded-xl"
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
