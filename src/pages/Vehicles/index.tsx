import type React from "react";

import { Container } from "@/components/Container";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CirclePlus,
  Pencil,
  Car,
  Hash,
  Calendar,
  Gauge,
  Search,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  createVehicle,
  deleteVehicle,
  getVehiclesOfUser,
  updateVehicle,
} from "@/services/vehicles";
import type {
  CreateVehicle,
  UpdateVehicle,
  Vehicle,
} from "@/types/vehicles.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Vehicles = () => {
  const [licensePlate, setLicensePlate] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(2025);
  const [km, setKm] = useState(0);
  const [open, setOpen] = useState(false);
  const [openChange, setOpenChange] = useState(false);
  const [refreshVehiclesTick, setRefreshVehiclesTick] = useState<number>(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [licensePlateChange, setLicensePlateChange] = useState("");
  const [modelChange, setModelChange] = useState("");
  const [yearChange, setYearChange] = useState(2025);
  const [kmChange, setKmChange] = useState(0);
  const [id, setId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [originalVehicle, setOriginalVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        const vehiclesData = await getVehiclesOfUser();
        setVehicles(vehiclesData);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar los vehículos");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicles();
  }, [refreshVehiclesTick]);

  const setVehicleToBeChange = (vehicle: Vehicle) => {
    setLicensePlateChange(vehicle.licensePlate);
    setModelChange(vehicle.model);
    setYearChange(vehicle.year);
    setKmChange(vehicle.km);
    setId(vehicle.id);
    setOriginalVehicle(vehicle);
  };

  const isModified = () => {
    if (!originalVehicle) return false;
    return (
      licensePlateChange.toUpperCase() !==
        originalVehicle.licensePlate.toUpperCase() ||
      modelChange !== originalVehicle.model ||
      yearChange !== originalVehicle.year ||
      kmChange !== originalVehicle.km
    );
  };

  const handleDeleteVehicle = async (id: number) => {
    try {
      await deleteVehicle(id);
      setRefreshVehiclesTick((prev) => prev + 1);
      toast.success("Vehículo eliminado correctamente");
    } catch {
      toast.error("Error al eliminar el vehículo");
    }
  };

  const handleUpdateVehicle = async (
    e: React.FormEvent<HTMLFormElement>,
    id: number
  ) => {
    e.preventDefault();

    const regex = /^[A-Z]{3}\s?\d{3}$|^[A-Z]{2}\d{3}[A-Z]{2}$/;
    if (!regex.test(licensePlateChange.toUpperCase())) {
      toast.error("Formato de patente inválido");
      return;
    }

    if (!regex.test(licensePlateChange.toUpperCase())) {
      toast.error("Formato de patente inválido");
      return;
    }

    const vehicle: UpdateVehicle = {
      licensePlate: licensePlateChange.toUpperCase(),
      model: modelChange,
      year: yearChange,
      km: kmChange,
    };
    try {
      await updateVehicle(id, vehicle);
      setRefreshVehiclesTick((prev) => prev + 1);
      toast.success("Vehículo actualizado correctamente");
      setOpenChange(false);
    } catch {
      toast.error("Error al actualizar el vehículo");
    }
  };

  const handleAddVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const regex = /^[A-Z]{3}\s?\d{3}$|^[A-Z]{2}\d{3}[A-Z]{2}$/;
    if (!regex.test(licensePlate.toUpperCase())) {
      toast.error("Formato de patente inválido");
      return;
    }

    const vehicle: CreateVehicle = {
      licensePlate: licensePlate.toUpperCase(),
      model: model,
      year: year,
      km: km,
    };
    try {
      await createVehicle(vehicle);
      setRefreshVehiclesTick((prev) => prev + 1);
      toast.success("Vehículo agregado correctamente");
      setOpen(false);
      setKm(0);
      setLicensePlate("");
      setModel("");
      setYear(2025);
    } catch {
      toast.error("Error al agregar el vehículo");
    }
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.year.toString().includes(searchQuery)
  );

  return (
    <Container>
      <div className="flex flex-col gap-4 p-6 text-foreground">
        <div className="flex flex-col gap-4 w-full">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-6 w-6" />
                Tus Vehículos
              </CardTitle>
              <CardDescription>
                Gestiona tus vehículos registrados para reservar turnos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por modelo, patente o año..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ScrollArea className="h-[50vh] w-full border rounded-lg">
                  <div className="gap-3 flex flex-col p-4 w-full">
                    {filteredVehicles.length > 0 ? (
                      filteredVehicles.map((vehicle) => (
                        <Card key={vehicle.id} className="p-3 w-full">
                          <div className="flex items-center w-full">
                            <div className="flex flex-row p-2 items-center w-full">
                              <Accordion
                                type="single"
                                collapsible
                                className="w-full"
                                defaultValue=""
                              >
                                <AccordionItem value="item-1">
                                  <AccordionTrigger className="hover:no-underline flex flex-row justify-between items-center pr-2">
                                    <div className="flex items-center flex-col lg:flex-row gap-2">
                                      <Car className="h-4 w-4" />
                                      {vehicle.model}
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="flex flex-col gap-3 pt-2">
                                    <div className="flex items-center flex-col lg:flex-row gap-2 text-sm">
                                      <Hash className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">
                                        Patente:
                                      </span>
                                      <span>{vehicle.licensePlate}</span>
                                    </div>
                                    <div className="flex items-center flex-col lg:flex-row gap-2 text-sm">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">Año:</span>
                                      <span>{vehicle.year}</span>
                                    </div>
                                    <div className="flex items-center flex-col lg:flex-row gap-2 text-sm">
                                      <Gauge className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">
                                        Kilometraje:
                                      </span>
                                      <span>
                                        {vehicle.km.toLocaleString()} km
                                      </span>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                              <div className="flex flex-row gap-2">
                                <Sheet
                                  open={openChange}
                                  onOpenChange={setOpenChange}
                                >
                                  <SheetTrigger asChild>
                                    <Button
                                      variant="secondary"
                                      size="icon"
                                      className="size-8"
                                      onClick={() =>
                                        setVehicleToBeChange(vehicle)
                                      }
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </SheetTrigger>
                                  <SheetContent className="text-foreground">
                                    <SheetHeader>
                                      <SheetTitle>Editar Vehículo</SheetTitle>
                                      <SheetDescription>
                                        Modifica los datos de tu vehículo
                                      </SheetDescription>
                                    </SheetHeader>
                                    <form
                                      onSubmit={(e) =>
                                        handleUpdateVehicle(e, id)
                                      }
                                      className="flex flex-col gap-4 mt-4 px-3"
                                    >
                                      <div className="grid gap-3">
                                        <Label
                                          htmlFor="licensePlate"
                                          className="flex items-center gap-2"
                                        >
                                          <Hash className="h-4 w-4" />
                                          Patente
                                        </Label>
                                        <Input
                                          id="licensePlate"
                                          name="licensePlate"
                                          value={licensePlateChange}
                                          onChange={(e) =>
                                            setLicensePlateChange(
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                      <div className="grid gap-3">
                                        <Label
                                          htmlFor="model"
                                          className="flex items-center gap-2"
                                        >
                                          <Car className="h-4 w-4" />
                                          Modelo
                                        </Label>
                                        <Input
                                          id="model"
                                          name="model"
                                          value={modelChange}
                                          onChange={(e) =>
                                            setModelChange(e.target.value)
                                          }
                                        />
                                      </div>
                                      <div className="grid gap-3">
                                        <Label
                                          htmlFor="year"
                                          className="flex items-center gap-2"
                                        >
                                          <Calendar className="h-4 w-4" />
                                          Año
                                        </Label>
                                        <Select
                                          value={yearChange.toString()}
                                          onValueChange={(value) =>
                                            setYearChange(Number(value))
                                          }
                                        >
                                          <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Selecciona un año" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              <SelectLabel>Años</SelectLabel>
                                              {Array.from(
                                                {
                                                  length:
                                                    new Date().getFullYear() -
                                                    1900 +
                                                    1,
                                                },
                                                (_, i) =>
                                                  new Date().getFullYear() - i
                                              ).map((year) => (
                                                <SelectItem
                                                  key={year}
                                                  value={year.toString()}
                                                >
                                                  {year}
                                                </SelectItem>
                                              ))}
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="grid gap-3">
                                        <Label
                                          htmlFor="km"
                                          className="flex items-center gap-2"
                                        >
                                          <Gauge className="h-4 w-4" />
                                          Kilometraje
                                        </Label>
                                        <Input
                                          id="km"
                                          name="km"
                                          type="number"
                                          value={kmChange}
                                          onChange={(e) =>
                                            setKmChange(Number(e.target.value))
                                          }
                                        />
                                      </div>
                                      <SheetFooter className="gap-2">
                                        <SheetClose asChild>
                                          <Button
                                            variant="outline"
                                            type="button"
                                          >
                                            Cancelar
                                          </Button>
                                        </SheetClose>
                                        <Button
                                          type="submit"
                                          disabled={!isModified()}
                                        >
                                          Guardar cambios
                                        </Button>
                                      </SheetFooter>
                                    </form>
                                  </SheetContent>
                                </Sheet>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => setId(vehicle.id)}
                                    >
                                      Eliminar
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="text-foreground">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        ¿Eliminar vehículo?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Estás por eliminar el {vehicle.model}{" "}
                                        con patente {vehicle.licensePlate}. Esta
                                        acción no se puede deshacer.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancelar
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteVehicle(id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Eliminar
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Car className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">
                          {searchQuery
                            ? "No se encontraron vehículos"
                            : "No hay vehículos registrados"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {searchQuery
                            ? "Intenta con otra búsqueda"
                            : "Agrega tu primer vehículo para comenzar"}
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    <CirclePlus className="h-5 w-5 mr-2" />
                    Agregar Vehículo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] text-foreground">
                  <form
                    onSubmit={handleAddVehicle}
                    className="flex flex-col gap-4"
                  >
                    <DialogHeader>
                      <DialogTitle>Agregar Vehículo</DialogTitle>
                      <DialogDescription>
                        Completa los datos de tu vehículo
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div className="grid gap-3">
                        <Label
                          htmlFor="licensePlate"
                          className="flex items-center gap-2"
                        >
                          <Hash className="h-4 w-4" />
                          Patente
                        </Label>
                        <Input
                          id="licensePlate"
                          name="licensePlate"
                          placeholder="ABC123"
                          value={licensePlate}
                          onChange={(e) => setLicensePlate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label
                          htmlFor="model"
                          className="flex items-center gap-2"
                        >
                          <Car className="h-4 w-4" />
                          Modelo
                        </Label>
                        <Input
                          id="model"
                          name="model"
                          placeholder="Toyota Corolla"
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label
                          htmlFor="year"
                          className="flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Año
                        </Label>
                        <Select
                          value={year.toString()}
                          onValueChange={(value) => setYear(Number(value))}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Selecciona un año" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Años</SelectLabel>
                              {Array.from(
                                {
                                  length: new Date().getFullYear() - 1900 + 1,
                                },
                                (_, i) => new Date().getFullYear() - i
                              ).map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="km" className="flex items-center gap-2">
                          <Gauge className="h-4 w-4" />
                          Kilometraje
                        </Label>
                        <Input
                          id="km"
                          name="km"
                          type="number"
                          placeholder="50000"
                          value={km}
                          onChange={(e) => setKm(Number(e.target.value))}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter className="gap-2">
                      <DialogClose asChild>
                        <Button variant="outline" type="button">
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button type="submit">Agregar Vehículo</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};
