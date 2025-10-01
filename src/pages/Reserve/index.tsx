import { DatePicker } from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Container } from '@/components/Container'
import { getAllServices } from '@/services/services'
import type { Service } from '@/types/services.types'
import {
  createAppointment,
} from '@/services/appointments'
import { formatDateToYMD } from '@/helpers/parse-date'
import type { CreateAppointment } from '@/types/appointments.types'
import type { User } from '@/types/users.types'
import { getAllWorkshops } from '@/services/users'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MultiSelect } from '@/components/MultiSelect'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { WorkshopsMap } from '@/components/WorkshopsMap'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export const Reserve = () => {
  const [workshop, setWorkshop] = useState<string>('')
  const [workshops, setWorkshops] = useState<User[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>('')
  const navigate = useNavigate()

  const availableHours = [
    {
      workshop: 'example',
      hours: [
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
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
      const services = await getAllServices()
      setServices(services)
    }

    try {
      fetchServices()
    } catch (error) {
      console.error(error)
    }
  }, [])

  const handleCreateAppointment = async () => {
    const appointment: CreateAppointment = {
      date: date ? formatDateToYMD(date) : '',
      time: time,
      serviceIds: selectedServices.map((s) => Number(s)),
      workshopId: Number(workshop),
    }
    try {
      await createAppointment(appointment)
      toast.success('Turno reservado correctamente')
    } catch {
      toast.error('No se pudo reservar el turno')
    } finally {
      navigate('/appointments')
    }
  }

  const handleDisabled = () => {
    return !selectedServices.length || !date || !time || selectedServices.length === 0
  }

  return (
    <Container>
      <div className='flex flex-col gap-4 p-6'>
        <h1 className='text-primary text-4xl md:text-5xl font-extrabold tracking-tight mb-8'>
          Reservá tu turno
        </h1>
        <div className='flex flex-col items-start justify-start w-full text-foreground gap-8 lg:gap-6'>
          <DatePicker
            hasTimePicker={true}
            date={date}
            setDate={setDate}
            setTime={setTime}
            time={time}
            availableHours={availableHours}
          />
          <div className='flex flex-col gap-3 w-full lg:w-[50%] cursor-pointer'>
            <Label htmlFor='workshop' className='px-1 text-lg text-foreground'>
              Taller
            </Label>
            <Select
              value={workshop}
              onValueChange={(value) => setWorkshop(value)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Selecciona un taller' />
              </SelectTrigger>
              <SelectContent className='w-full'>
              {workshops.map((workshop) => (
                <SelectItem key={workshop.id} value={workshop.id.toString()}>
                  {workshop.workshopName} ({workshop.address})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Ver en mapa</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl text-foreground h-[50vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Ubicaciones de talleres</DialogTitle>
              </DialogHeader>
              <div className="w-full flex-1 min-h-0">
                <WorkshopsMap workshops={workshops} />
              </div>
            </DialogContent>
          </Dialog>
          <div className="flex flex-col gap-3 w-full lg:w-[50%] cursor-pointer">
            <Label htmlFor="service" className="px-1 text-lg text-foreground">
              Servicios
            </Label>
            <MultiSelect
              options={services.map((service) => ({
                value: service.id.toString(),
                label: `${service.name} - $${service.price ?? 'Consultar'}`
              }))}
              selected={selectedServices}
              setSelected={setSelectedServices}
              placeholder="Selecciona servicios"
            />
          </div>
          <div className="border border-muted rounded-lg p-4 w-full lg:w-[50%]">
            <h2 className="text-lg font-semibold mb-2">Resumen del turno</h2>
            {!workshop && !selectedServices.length && !date && !time ? (
              <p className="text-sm text-muted-foreground">
                Selecciona una fecha, horario, taller y servicios para ver el resumen.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {date && (
                  <li>
                    <span className="font-medium">Fecha:</span>{" "}
                    {date.toLocaleDateString()}
                  </li>
                )}
                {time && (
                  <li>
                    <span className="font-medium">Horario:</span> {time}
                  </li>
                )}
                {workshop && (
                  <li>
                    <span className="font-medium">Taller:</span>{" "}
                    {
                      workshops.find((w) => w.id.toString() === workshop)
                        ?.workshopName
                    }{" "}
                    ({workshops.find((w) => w.id.toString() === workshop)?.address})
                  </li>
                )}
                {selectedServices.length > 0 && (
                  <li>
                    <span className="font-medium">Servicios:</span>{" "}
                    {selectedServices
                      .map(
                        (id) =>
                          services.find((s) => s.id.toString() === id)?.name
                      )
                      .join(", ")}
                  </li>
                )}
              </ul>
            )}
          </div>

          <Button
            variant='outline'
            className='px-6 py-5 text-base w-full lg:w-[50%]'
            disabled={handleDisabled()}
            onClick={handleCreateAppointment}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </Container>
  )
}
