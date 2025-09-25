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

export const Appointments = () => {
  const [workshop, setWorkshop] = useState<string>('')
  const [workshops, setWorkshops] = useState<User[]>([])
  const [service, setService] = useState<string>('')
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
      serviceId: services.find((s) => s.name === service)?.id ?? 0,
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
    return !service || !date || !time || service === ''
  }

  return (
    <Container>
      <div className='flex flex-col gap-4 p-6'>
        <h1 className='text-primary text-4xl md:text-5xl font-extrabold tracking-tight mb-8'>
          Agendar turno
        </h1>
        <div className='flex flex-col lg:flex-row items-start lg:items-center justify-start w-full text-foreground gap-8 lg:gap-0'>
          <div className='flex flex-col gap-8 w-full lg:w-[50%]'>
            <DatePicker
              hasTimePicker={true}
              date={date}
              setDate={setDate}
              setTime={setTime}
              availableHours={availableHours}
            />
            <div className='flex flex-col gap-3 w-full lg:w-[50%] cursor-pointer'>
              <Label htmlFor='workshop' className='px-1'>
                Taller
              </Label>
              <select
                id='workshop'
                className='h-10 rounded-md border bg-background px-3 text-sm shadow-xs focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none cursor-pointer'
                value={workshop ?? ''}
                onChange={(e) => setWorkshop(e.target.value)}
              >
                <option value='' disabled>
                  Selecciona un taller
                </option>
                {workshops.map((workshop) => (
                  <option key={workshop.id} value={workshop.id}>
                    {workshop.workshopName} ({workshop.address})
                  </option>
                ))}
              </select>
            </div>
            <div className='flex flex-col gap-3 w-full lg:w-[50%] cursor-pointer'>
              <Label htmlFor='service' className='px-1'>
                Servicio
              </Label>
              <select
                id='service'
                className='h-10 rounded-md border bg-background px-3 text-sm shadow-xs focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none cursor-pointer'
                defaultValue={service}
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                <option value='' disabled>
                  Selecciona un servicio
                </option>
                {services.map((service) => (
                  <option key={service.name} value={service.name}>
                    {service.name} - ${service.price ?? 'Consultar'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Button
                variant='outline'
                className='px-6 py-5 text-base'
                disabled={handleDisabled()}
                onClick={handleCreateAppointment}
              >
                Confirmar
              </Button>
            </div>
          </div>
          <div className='flex flex-col gap-4 w-full lg:w-[50%]'>
            <Label htmlFor='appointments' className='px-1'>
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
                          {app.service.name}.
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
