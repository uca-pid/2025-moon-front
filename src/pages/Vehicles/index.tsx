import type React from "react"

import { useEffect, useState } from "react"
import { Car, Plus, Pencil, Trash2, Search, Calendar, Gauge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createVehicle, deleteVehicle, getVehiclesOfUser, updateVehicle } from "@/services/vehicles"
import type { CreateVehicle, UpdateVehicle, Vehicle } from "@/types/vehicles.types"
import { toast } from "sonner"
import { Container } from "@/components/Container"

export function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const [licensePlate, setLicensePlate] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState(2025)
  const [km, setKm] = useState(0)

  const [editLicensePlate, setEditLicensePlate] = useState("")
  const [editModel, setEditModel] = useState("")
  const [editYear, setEditYear] = useState(2025)
  const [editKm, setEditKm] = useState(0)

  const fetchVehicles = async () => {
    setIsLoading(true)
    try {
      const vehiclesData = await getVehiclesOfUser()
      setVehicles(vehiclesData)
    } catch (error) {
      console.error(error)
      toast.error("Error al cargar los vehículos")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    const regex = /^[A-Z]{3}\s?\d{3}$|^[A-Z]{2}\d{3}[A-Z]{2}$/
    if (!regex.test(licensePlate.toUpperCase())) {
      toast.error("Formato de patente inválido")
      return
    }

    const vehicle: CreateVehicle = {
      licensePlate: licensePlate.toUpperCase(),
      model,
      year,
      km,
    }

    try {
      await createVehicle(vehicle)
      await fetchVehicles()
      toast.success("Vehículo agregado correctamente")
      setOpenAdd(false)
      setLicensePlate("")
      setModel("")
      setYear(2025)
      setKm(0)
    } catch {
      toast.error("Error al agregar el vehículo")
    }
  }

  const handleEditVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVehicle) return

    const regex = /^[A-Z]{3}\s?\d{3}$|^[A-Z]{2}\d{3}[A-Z]{2}$/
    if (!regex.test(editLicensePlate.toUpperCase())) {
      toast.error("Formato de patente inválido")
      return
    }

    const vehicle: UpdateVehicle = {
      licensePlate: editLicensePlate.toUpperCase(),
      model: editModel,
      year: editYear,
      km: editKm,
    }

    try {
      await updateVehicle(selectedVehicle.id, vehicle)
      await fetchVehicles()
      toast.success("Vehículo actualizado correctamente")
      setOpenEdit(false)
    } catch {
      toast.error("Error al actualizar el vehículo")
    }
  }

  const handleDeleteVehicle = async (id: number) => {
    try {
      await deleteVehicle(id)
      await fetchVehicles()
      toast.success("Vehículo eliminado correctamente")
    } catch {
      toast.error("Error al eliminar el vehículo")
    }
  }

  const openEditDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setEditLicensePlate(vehicle.licensePlate)
    setEditModel(vehicle.model)
    setEditYear(vehicle.year)
    setEditKm(vehicle.km)
    setOpenEdit(true)
  }

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.year.toString().includes(searchQuery),
  )

  return (
    <Container>
      <div className="max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Mis Vehículos</h1>
            <p className="text-muted-foreground">Gestiona tu flota de vehículos</p>
          </div>
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-2xl shadow-sm">
                <Plus className="h-5 w-5 mr-2" />
                Agregar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleAddVehicle}>
                <DialogHeader>
                  <DialogTitle>Agregar Vehículo</DialogTitle>
                  <DialogDescription>Completa los datos de tu vehículo</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="licensePlate">Patente</Label>
                    <Input
                      id="licensePlate"
                      placeholder="ABC123"
                      value={licensePlate}
                      onChange={(e) => setLicensePlate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo</Label>
                    <Input
                      id="model"
                      placeholder="Toyota Corolla"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Año</Label>
                    <Select value={year.toString()} onValueChange={(value) => setYear(Number(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Años</SelectLabel>
                          {Array.from(
                            { length: new Date().getFullYear() - 1900 + 1 },
                            (_, i) => new Date().getFullYear() - i,
                          ).map((y) => (
                            <SelectItem key={y} value={y.toString()}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="km">Kilometraje</Label>
                    <Input
                      id="km"
                      type="number"
                      placeholder="50000"
                      value={km}
                      onChange={(e) => setKm(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Agregar Vehículo</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por modelo, patente o año..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-2xl shadow-sm"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-card rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Car className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{vehicle.model}</h3>
                        <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-xl"
                        onClick={() => openEditDialog(vehicle)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-xl text-destructive hover:text-destructive"
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Año</p>
                        <p className="font-medium text-foreground">{vehicle.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Kilometraje</p>
                        <p className="font-medium text-foreground">{vehicle.km.toLocaleString()} km</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                  <Car className="h-10 w-10 text-primary" />
                </div>
                <p className="text-lg font-medium text-foreground mb-2">
                  {searchQuery ? "No se encontraron vehículos" : "No hay vehículos registrados"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "Intenta con otra búsqueda" : "Agrega tu primer vehículo para comenzar"}
                </p>
              </div>
            )}
          </div>
        )}

        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleEditVehicle}>
              <DialogHeader>
                <DialogTitle>Editar Vehículo</DialogTitle>
                <DialogDescription>Modifica los datos de tu vehículo</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-licensePlate">Patente</Label>
                  <Input
                    id="edit-licensePlate"
                    value={editLicensePlate}
                    onChange={(e) => setEditLicensePlate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-model">Modelo</Label>
                  <Input id="edit-model" value={editModel} onChange={(e) => setEditModel(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-year">Año</Label>
                  <Select value={editYear.toString()} onValueChange={(value) => setEditYear(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Años</SelectLabel>
                        {Array.from(
                          { length: new Date().getFullYear() - 1900 + 1 },
                          (_, i) => new Date().getFullYear() - i,
                        ).map((y) => (
                          <SelectItem key={y} value={y.toString()}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-km">Kilometraje</Label>
                  <Input
                    id="edit-km"
                    type="number"
                    value={editKm}
                    onChange={(e) => setEditKm(Number(e.target.value))}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Guardar cambios</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  )
}
