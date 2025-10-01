import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Container } from "@/components/Container"
import { getServicesByMechanicId } from "@/services/services"
import type { Service } from "@/types/services.types"
import { createAppointment } from "@/services/appointments"
import { formatDateToYMD } from "@/helpers/parse-date"
import type { CreateAppointment } from "@/types/appointments.types"
import type { User } from "@/types/users.types"
import { getAllWorkshops } from "@/services/users"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/MultiSelect"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { WorkshopsMap } from "@/components/WorkshopsMap"
import { toast } from "sonner"
import { Calendar, MapPin, Wrench, Clock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const Reserve = () => {
  const [workshop, setWorkshop] = useState<string>("")
  const [workshops, setWorkshops] = useState<User[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>("")
  const [showMap, setShowMap] = useState<boolean>(false)

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
  ]

  useEffect(() => {
    const fetchWorkshops = async () => {
      const workshops = await getAllWorkshops()
      setWorkshops(workshops)
    }
    try {
      fetchWorkshops()
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    const fetchServices = async () => {
      if (!workshop) return
      const services = await getServicesByMechanicId(Number(workshop))
      setServices(services)
    }

    try {
      fetchServices()
    } catch (error) {
      console.error(error)
    }
  }, [workshop])

  const handleCreateAppointment = async () => {
    const appointment: CreateAppointment = {
      date: date ? formatDateToYMD(date) : "",
      time: time,
      serviceIds: selectedServices.map((s) => Number(s)),
      workshopId: Number(workshop),
    }
    try {
      await createAppointment(appointment)
      toast.success("Turno reservado correctamente")
      setWorkshop("")
      setSelectedServices([])
      setDate(undefined)
      setTime("")
    } catch {
      toast.error("No se pudo reservar el turno")
    }
  }

  const handleDisabled = () => {
    return !selectedServices.length || !date || !time || selectedServices.length === 0
  }

  const handleSelectWorkshop = (id: number) => {
    setWorkshop(id.toString())
    setShowMap(false)
  }

  return (
    <Container>
      <Card className="border-0 shadow-none bg-background">
        <CardHeader className="px-6 pt-6 pb-2">
          <CardTitle className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">Reservá tu turno</CardTitle>
          <CardDescription className="text-base mt-2">
            Seleccioná la fecha, horario, taller y servicios para tu próximo turno
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="flex flex-col items-start justify-start w-full gap-6">
            <div className="flex flex-col gap-3 w-full lg:w-[50%]">
              <Label htmlFor="date" className="px-1 text-lg text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Fecha y Horario
              </Label>
              <DatePicker
                hasTimePicker={true}
                date={date}
                setDate={setDate}
                setTime={setTime}
                time={time}
                availableHours={availableHours}
              />
            </div>

            <div className="flex flex-col gap-3 w-full lg:w-[50%]">
              <Label htmlFor="workshop" className="px-1 text-lg text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Taller
              </Label>
              <div className="flex gap-2">
                <Select value={workshop} onValueChange={(value) => setWorkshop(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un taller" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {workshops.map((workshop) => (
                      <SelectItem key={workshop.id} value={workshop.id.toString()}>
                        {workshop.workshopName} ({workshop.address})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={showMap} onOpenChange={setShowMap}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setShowMap(true)}>
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl text-foreground h-[60vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Ubicaciones de talleres</DialogTitle>
                    </DialogHeader>
                    <div className="w-full flex-1 min-h-0">
                      <WorkshopsMap workshops={workshops} handleSelectWorkshop={handleSelectWorkshop} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full lg:w-[50%]">
              <Label htmlFor="service" className="px-1 text-lg text-foreground flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Servicios
              </Label>
              <MultiSelect
                options={services.map((service) => ({
                  value: service.id.toString(),
                  label: `${service.name} - $${service.price ?? "Consultar"}`,
                }))}
                selected={selectedServices}
                setSelected={setSelectedServices}
                placeholder="Selecciona servicios"
              />
            </div>

            <Card className="w-full lg:w-[50%] bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Resumen del turno
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!workshop && !selectedServices.length && !date && !time ? (
                  <p className="text-sm text-muted-foreground">
                    Selecciona una fecha, horario, taller y servicios para ver el resumen.
                  </p>
                ) : (
                  <ul className="space-y-3 text-sm">
                    {date && (
                      <li className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <span className="font-medium">Fecha:</span> {date.toLocaleDateString()}
                        </div>
                      </li>
                    )}
                    {time && (
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <span className="font-medium">Horario:</span> {time}
                        </div>
                      </li>
                    )}
                    {workshop && (
                      <li className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <span className="font-medium">Taller:</span>{" "}
                          {workshops.find((w) => w.id.toString() === workshop)?.workshopName} (
                          {workshops.find((w) => w.id.toString() === workshop)?.address})
                        </div>
                      </li>
                    )}
                    {selectedServices.length > 0 && (
                      <li className="flex items-start gap-2">
                        <Wrench className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <span className="font-medium">Servicios:</span>{" "}
                          {selectedServices.map((id) => services.find((s) => s.id.toString() === id)?.name).join(", ")}
                        </div>
                      </li>
                    )}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Button
              className="px-6 py-5 text-base w-full lg:w-[50%]"
              disabled={handleDisabled()}
              onClick={handleCreateAppointment}
            >
              Confirmar reserva
            </Button>
          </div>
        </CardContent>
      </Card>
    </Container>
  )
}