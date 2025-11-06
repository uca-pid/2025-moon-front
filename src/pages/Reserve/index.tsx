import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Container } from "@/components/Container";
import { getServicesByMechanicId } from "@/services/services";
import type { Service } from "@/types/services.types";
import { createAppointment } from "@/services/appointments";
import { formatDateToYMD } from "@/helpers/parse-date";
import type { CreateAppointment } from "@/types/appointments.types";
import type { SubCategroriesEnum, User } from "@/types/users.types";
import { toStars, getSubcategoryCounts, subLabel } from "@/helpers/reviews";
import { getAllWorkshops } from "@/services/users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/MultiSelect";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WorkshopsMap } from "@/components/WorkshopsMap";
import { toast } from "sonner";
import {
  Calendar,
  MapPin,
  Wrench,
  Clock,
  CheckCircle,
  Car,
  Sparkles,
  Star,
} from "lucide-react";
import { getVehiclesOfUser } from "@/services/vehicles";
import type { Vehicle } from "@/types/vehicles.types";
import { useNavigate } from "react-router-dom";

export function Reserve() {
  const [workshop, setWorkshop] = useState<string>("");
  const [workshops, setWorkshops] = useState<User[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [showMap, setShowMap] = useState<boolean>(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const navigate = useNavigate();
  const availableHours = [
    {
      workshop: "example",
      hours: [
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
      ],
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const workshops = await getAllWorkshops();
      setWorkshops(workshops);
      const vehicles = await getVehiclesOfUser();
      setVehicles(vehicles);
    };
    try {
      fetchData();
    } catch {
      toast.error("Error al cargar los talleres y vehículos");
    }
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      if (!workshop) return;
      const services = await getServicesByMechanicId(Number(workshop));
      setServices(services);
    };

    try {
      fetchServices();
    } catch {
      toast.error("Error al cargar los servicios");
    }
  }, [workshop]);

  const handleCreateAppointment = async () => {
    const appointment: CreateAppointment = {
      date: date ? formatDateToYMD(date) : "",
      time: time,
      serviceIds: selectedServices.map((s) => Number(s)),
      workshopId: Number(workshop),
      vehicleId: Number(selectedVehicle),
    };
    try {
      await createAppointment(appointment);
      toast.success("Turno reservado correctamente");
      setWorkshop("");
      setSelectedServices([]);
      setDate(undefined);
      setTime("");
      navigate("/appointments");
    } catch {
      toast.error("No se pudo reservar el turno");
    }
  };

  const handleDisabled = () => {
    return (
      !selectedServices.length ||
      !date ||
      !time ||
      selectedServices.length === 0 ||
      selectedVehicle === ""
    );
  };

  const handleSelectWorkshop = (id: number) => {
    setWorkshop(id.toString());
    setShowMap(false);
  };

  return (
    <Container>
      <div className="min-h-screen">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Reservá tu turno
            </h1>
          </div>
          <p className="text-lg text-foreground/60 ml-14">
            Seleccioná la fecha, horario, taller y servicios para tu próximo
            turno
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="group bg-card rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 group-hover:from-blue-500/20 group-hover:to-blue-600/20 transition-colors">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <Label className="text-lg font-semibold text-foreground">
                  Fecha y Horario
                </Label>
              </div>
              <DatePicker
                hasTimePicker={true}
                date={date}
                setDate={setDate}
                setTime={setTime}
                time={time}
                availableHours={availableHours}
              />
            </div>

            <div className="group bg-card rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 group-hover:from-green-500/20 group-hover:to-green-600/20 transition-colors">
                  <Car className="h-5 w-5 text-green-600" />
                </div>
                <Label className="text-lg font-semibold text-foreground">
                  Vehículo
                </Label>
              </div>
              {vehicles.length > 0 ? (
                <Select
                  value={selectedVehicle}
                  onValueChange={(value) => setSelectedVehicle(value)}
                >
                  <SelectTrigger
                    className="w-full rounded-xl border-gray-200 hover:border-gray-300 transition-colors"
                    style={{ padding: "25px" }}
                  >
                    <SelectValue placeholder="Selecciona un vehículo" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {vehicles.map((vehicle) => (
                      <SelectItem
                        key={vehicle.id}
                        value={vehicle.id.toString()}
                        className="rounded-lg"
                      >
                        <span className="font-medium">
                          {vehicle.licensePlate}
                        </span>
                        <span className="text-gray-500">
                          {" "}
                          - {vehicle.model}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-sm text-gray-500">
                    No tienes ningún vehículo registrado.
                  </p>
                </div>
              )}
            </div>

            <div className="group bg-card rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 group-hover:from-purple-500/20 group-hover:to-purple-600/20 transition-colors">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
                <Label className="text-lg font-semibold text-foreground">
                  Taller
                </Label>
              </div>
              <div className="flex gap-3 items-center">
                <Select
                  value={workshop}
                  onValueChange={(value) => setWorkshop(value)}
                >
                  <SelectTrigger
                    className="w-full rounded-xl border-gray-200 hover:border-gray-300 transition-colors"
                    style={{ padding: "25px" }}
                  >
                    <SelectValue placeholder="Selecciona un taller">
                      {workshop &&
                        workshops.find((w) => w.id.toString() === workshop)
                          ?.workshopName}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {workshops.map((workshop) => (
                      <SelectItem
                        key={workshop.id}
                        value={workshop.id.toString()}
                        className="rounded-lg p-3"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">
                            {workshop.workshopName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {workshop.address}
                          </span>
                          <div className="flex items-center gap-1 text-foreground/80">
                            {(() => {
                              const { avg, filled } = toStars(workshop.reviews);
                              return (
                                <>
                                  {[0, 1, 2, 3, 4].map((i) => (
                                    <Star
                                      key={i}
                                      className={`h-3.5 w-3.5 ${
                                        i < filled
                                          ? "text-yellow-500"
                                          : "text-muted-foreground/30"
                                      }`}
                                      fill={
                                        i < filled ? "currentColor" : "none"
                                      }
                                    />
                                  ))}
                                  <span className="text-[10px] ml-1">
                                    {avg.toFixed(1)}/5
                                  </span>
                                </>
                              );
                            })()}
                          </div>
                          {(() => {
                            const counts = getSubcategoryCounts(
                              workshop.subCategories
                            );
                            const entries = Object.entries(counts) as [
                              SubCategroriesEnum,
                              number
                            ][];
                            if (entries.length === 0) return null;
                            return (
                              <div className="text-[10px] text-muted-foreground flex flex-wrap gap-x-2 gap-y-0.5">
                                {entries.map(([k, v]) => (
                                  <span key={k}>
                                    {subLabel(k)}: {v}
                                  </span>
                                ))}
                              </div>
                            );
                          })()}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={showMap} onOpenChange={setShowMap}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-xl border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors bg-transparent"
                      onClick={() => setShowMap(true)}
                    >
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl h-[60vh] flex flex-col rounded-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">
                        Ubicaciones de talleres
                      </DialogTitle>
                    </DialogHeader>
                    <div className="w-full flex-1 min-h-0 rounded-2xl overflow-hidden">
                      <WorkshopsMap
                        workshops={workshops}
                        handleSelectWorkshop={handleSelectWorkshop}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="group bg-card rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 group-hover:from-orange-500/20 group-hover:to-orange-600/20 transition-colors">
                  <Wrench className="h-5 w-5 text-orange-600" />
                </div>
                <Label className="text-lg font-semibold text-foreground">
                  Servicios
                </Label>
              </div>
              {!workshop ? (
                <div className="p-4 rounded-xl bg-card border border-gray-100">
                  <p className="text-sm text-gray-500">
                    Seleccione un taller primero.
                  </p>
                </div>
              ) : services.length > 0 ? (
                <MultiSelect
                  options={services.map((service) => ({
                    value: service.id.toString(),
                    label: `${service.name} - $${service.price ?? "Consultar"}`,
                  }))}
                  selected={selectedServices}
                  setSelected={setSelectedServices}
                  placeholder="Selecciona servicios"
                />
              ) : (
                <div className="p-4 rounded-xl bg-card border border-gray-100">
                  <p className="text-sm text-gray-500">
                    Este taller no tiene servicios disponibles por el momento.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-card rounded-3xl p-8 shadow-sm text-foreground">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-card shadow-sm">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Resumen del turno
                </h3>
              </div>

              {!workshop && !selectedServices.length && !date && !time ? (
                <div className="text-center py-12 text-foreground">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-card shadow-sm flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-foreground/40" />
                  </div>
                  <p className="text-sm text-foreground">
                    Selecciona una fecha, horario, taller y servicios para ver
                    el resumen.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-foreground">
                  {date && (
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-card shadow-sm">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-foreground mb-1">
                          Fecha
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {date.toLocaleDateString("es-AR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {time && (
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-card shadow-sm">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10">
                        <Clock className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-foreground mb-1">
                          Horario
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {time}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedVehicle && (
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-card shadow-sm">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10">
                        <Car className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-foreground mb-1">
                          Vehículo
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {
                            vehicles.find(
                              (v) => v.id.toString() === selectedVehicle
                            )?.licensePlate
                          }
                        </p>
                        <p className="text-xs text-foreground">
                          {
                            vehicles.find(
                              (v) => v.id.toString() === selectedVehicle
                            )?.model
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {workshop && (
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-card shadow-sm">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/10">
                        <MapPin className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-foreground mb-1">
                          Taller
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {
                            workshops.find((w) => w.id.toString() === workshop)
                              ?.workshopName
                          }
                        </p>
                        <p className="text-xs text-foreground">
                          {
                            workshops.find((w) => w.id.toString() === workshop)
                              ?.address
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedServices.length > 0 && (
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-card shadow-sm">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-600/10">
                        <Wrench className="h-4 w-4 text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-foreground mb-1">
                          Servicios
                        </p>
                        <div className="space-y-1">
                          {selectedServices.map((id) => {
                            const service = services.find(
                              (s) => s.id.toString() === id
                            );
                            return (
                              <p
                                key={id}
                                className="text-sm font-semibold text-foreground"
                              >
                                {service?.name}
                                {service?.price && (
                                  <span className="text-foreground font-normal">
                                    {" "}
                                    - ${service.price}
                                  </span>
                                )}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Button
                className="w-full mt-8 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                disabled={handleDisabled()}
                onClick={handleCreateAppointment}
              >
                Confirmar reserva
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
