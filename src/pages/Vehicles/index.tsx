// agregar toast
// mostrar los vehiculos
// hacer BM

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

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
import { CirclePlus, Pencil } from "lucide-react";
import { useState } from "react";
import { createVehicle } from "@/services/vehicles";
import type { CreateVehicle } from "@/types/vehicles.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

export const Vehicles = () => {
  const [licensePlate, setlicensePlate] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(0);
  const [km, setKm] = useState(0);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [open, setOpen] = useState(false);

  const vehicles = [
    {
      licensePlate: "AG129QZ",
      model: "Peugeot 208",
      year: 2023,
      km: 36000,
    },
    {
      licensePlate: "AH108SA",
      model: "Scania Serie H",
      year: 2024,
      km: 73000,
    },
  ];

  const handleAddVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("entre");
    e.preventDefault();
    const vehicle: CreateVehicle = {
      licensePlate: licensePlate,
      model: model,
      year: year,
      km: km,
    };
    console.log(vehicle);
    try {
      await createVehicle(vehicle);
      setStatus("success");
      toast.success("Vehiculo agregado correctamente.");
      setOpen(false);
    } catch (error) {
      console.log(error);
      setStatus("error");
      toast.error(
        "El vehiculo no pudo ser agregado, revise los datos de ingreso."
      );
    }
  };
  return (
    <Container>
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-4 w-full lg:w-[50%]">
          <h1 className="text-primary text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
            Tus vehiculos
          </h1>
          <ScrollArea className="h-[70vh] w-full border rounded-xl overflow-y-auto">
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => {
                return (
                  <Card className="gap-3 p-3">
                    <div className="flex items-center">
                      <div className="flex flex-row p-2 space-x-3 items-center w-full">
                        <Accordion
                          type="single"
                          collapsible
                          className="w-full"
                          defaultValue="item-1"
                        >
                          <AccordionItem value="item-1">
                            <AccordionTrigger>{vehicle.model}</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                              <p className="text-sm">
                                Patente: {vehicle.licensePlate}
                              </p>
                              <p className="text-sm">año: {vehicle.year} </p>
                              <p className="text-sm">
                                kilometros: {vehicle.km}{" "}
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                        <div className="flex flex-row gap-2">
                          <Sheet>
                            <SheetTrigger asChild className="text-foreground">
                              <Button
                                variant="secondary"
                                size="icon"
                                className="size-8"
                              >
                                <Pencil />
                              </Button>
                            </SheetTrigger>
                            <SheetContent className="text-foreground">
                              <SheetHeader>
                                <SheetTitle>
                                  Modifica los datos de tu Vehiculo
                                </SheetTitle>
                                <SheetDescription>
                                  Aca podes editar los datos de tu vehiculo.
                                  Cuando hayas cambiado lo que querias cambiar
                                  no olvides guardar los cambios.
                                </SheetDescription>
                              </SheetHeader>
                              <div className="grid auto-rows-min gap-4 px-4">
                                <div className="grid gap-3">
                                  <Label htmlFor="licensePlate">Patente</Label>
                                  <Input
                                    id="licensePlate"
                                    name="licensePlate"
                                    defaultValue={vehicle.licensePlate}
                                  />
                                </div>
                              </div>
                              <div className="grid auto-rows-min gap-4 px-4">
                                <div className="grid gap-3">
                                  <Label htmlFor="model">Modelo</Label>
                                  <Input
                                    id="model"
                                    name="model"
                                    defaultValue={vehicle.model}
                                  />
                                </div>
                              </div>
                              <div className="grid auto-rows-min gap-4 px-4">
                                <div className="grid gap-3">
                                  <Label htmlFor="year">Año</Label>
                                  <Input
                                    id="year"
                                    name="year"
                                    defaultValue={vehicle.year}
                                  />
                                </div>
                              </div>
                              <div className="grid auto-rows-min gap-4 px-4">
                                <div className="grid gap-3">
                                  <Label htmlFor="km">Kilometraje</Label>
                                  <Input
                                    id="km"
                                    name="km"
                                    defaultValue={vehicle.km}
                                  />
                                </div>
                              </div>
                              <SheetFooter>
                                <Button type="submit">Guardar cambios</Button>
                                <SheetClose asChild>
                                  <Button variant="outline">Salir</Button>
                                </SheetClose>
                              </SheetFooter>
                            </SheetContent>
                          </Sheet>

                          <AlertDialog>
                            <AlertDialogTrigger
                              asChild
                              className="text-foreground"
                            >
                              <Button variant="destructive">Eliminar</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="text-foreground">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Estas seguro de querer eliminar este vehiculo?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  El vehiculo que estas intentando eliminar es
                                  el {vehicle.model} con patente{" "}
                                  {vehicle.licensePlate}. Si eliminas este
                                  vehiculo ya no estara disponible y deberas
                                  ingresarlo nuevamente para sacar un turno para
                                  el.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction>Eliminar</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="flex justify-center items-center h-full w-full text-foreground">
                <p className="text-center">No hay vehiculos actualmente</p>
              </div>
            )}
          </ScrollArea>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <CirclePlus /> Agregar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] text-foreground">
              <form onSubmit={handleAddVehicle} className="flex flex-col gap-4">
                <DialogHeader>
                  <DialogTitle>Agrega tu vehiculo</DialogTitle>
                  <DialogDescription>
                    Carga los datos de tu vehiculo y cuando este listo, Guarda
                    los cambios.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="licensePlate">Patente</Label>
                    <Input
                      id="licensePlate"
                      name="licensePlate"
                      value={licensePlate}
                      onChange={(e) => setlicensePlate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="model">Modelo</Label>
                    <Input
                      id="model"
                      name="model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="year">Año</Label>
                    <Input
                      id="year"
                      name="year"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="km">Kilometraje</Label>
                    <Input
                      id="km"
                      name="km"
                      value={km}
                      onChange={(e) => setKm(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Salir sin guardar</Button>
                  </DialogClose>
                </DialogFooter>
                <Button type="submit">Agregar Vehiculo</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Container>
  );
};
