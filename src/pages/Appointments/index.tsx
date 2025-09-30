import { DatePicker } from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Container } from '@/components/Container'
import { getAllServices } from '@/services/services'
import type { Service } from '@/types/services.types'
import {
  createAppointment,
  getNextAppointmentsOfUser,
} from '@/services/appointments'
import { formatDateToYMD } from '@/helpers/parse-date'
import type { Appointment, CreateAppointment } from '@/types/appointments.types'
import { sortAppointments } from '@/helpers/sort-appointments'
import type { User } from '@/types/users.types'
import { getAllWorkshops } from '@/services/users'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MultiSelect } from '@/components/MultiSelect'

export const Appointments = () => {
  const [workshop, setWorkshop] = useState<string>('')
  const [workshops, setWorkshops] = useState<User[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>('')
  const [refreshAppointmentsTick, setRefreshAppointmentsTick] =
    useState<number>(0)

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
    console.log(workshop)
    const appointment: CreateAppointment = {
      date: date ? formatDateToYMD(date) : '',
      time: time,
      serviceIds: selectedServices.map((s) => Number(s)),
      workshopId: Number(workshop),
    }
    await createAppointment(appointment)
    setRefreshAppointmentsTick((prev) => prev + 1)
  }

  useEffect(() => {
    const fetchNextAppointments = async () => {
      const appointments = await getNextAppointmentsOfUser()
      setAppointments(appointments)
    }
    try {
      fetchNextAppointments()
    } catch (error) {
      console.error(error)
    }
  }, [refreshAppointmentsTick])

  const handleDisabled = () => {
    return !selectedServices.length || !date || !time || selectedServices.length === 0
  }

  return (
    <Container>
      <div className='flex flex-col gap-4 p-6'>
        <h1 className='text-primary text-4xl md:text-5xl font-extrabold tracking-tight mb-8'>
          Agendar turno
        </h1>
        <div className='flex flex-col lg:flex-row items-start justify-start w-full text-foreground gap-8 lg:gap-0'>
          <div className='flex flex-col gap-8 w-full lg:w-[50%]'>
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
            <Button
              variant='outline'
              className='px-6 py-5 text-base'
              disabled={handleDisabled()}
              onClick={handleCreateAppointment}
            >
              Confirmar
            </Button>
          </div>
          <div className='flex flex-col gap-4 w-full lg:w-[50%]'>
            <Label htmlFor='appointments' className='px-1 text-lg'>
              Turnos agendados
            </Label>
            <ScrollArea className='h-[70vh] w-full border rounded-xl overflow-y-auto'>
              {
                appointments.length > 0 ? (
                sortAppointments(appointments).map((app) => {
                  return (
                    <Card className='flex  ' key={app.id}>
                      <CardHeader>
                        <CardTitle>Turno #{app.id}</CardTitle>
                        <CardDescription>
                          Tienes un turno agendado en{' '}
                          {(app as Appointment).workshop.workshopName} el dia{' '}
                          {app.date} a las {app.time} para realizar el servicio{' '}
                          {app.services?.length > 0? app.services.map((s) => s.name).join(', ') : 'Sin servicios'}.
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )
                })
                ) : (
                  <div className='flex justify-center items-center h-full w-full'>
                    <p className='text-center'>No hay turnos agendados</p>
                  </div>
                )
              }
            </ScrollArea>
            </div>
          </div>
      </div>
    </Container>
  )
}
