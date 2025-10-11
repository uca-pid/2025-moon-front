import { Container } from '@/components/Container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { sortAppointments } from '@/helpers/sort-appointments'
import { AppointmentStatus, type Appointment } from '@/types/appointments.types'
import {
  changeAppointmentStatus,
  getNextAppointmentsOfUser,
} from '@/services/appointments'
import { Car, CheckCircle, Clock, Wrench, CircleDot } from 'lucide-react'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuery } from 'react-query'
import { AppointmentStatusBadge } from '@/components/AppointmentStatusBadge'
import { isCancelable } from '@/helpers/appointment-status'

export const AppointmentsReserved = () => {
  const { data: appointments, refetch } = useQuery(
    'appointments',
    () => getNextAppointmentsOfUser(),
    { initialData: [] }
  )

  return (
    <Container>
      <div className='flex flex-col justify-center items-center p-6 text-foreground'>
        <h1 className='text-primary text-4xl md:text-5xl font-extrabold tracking-tight mb-8 text-left w-full'>
          Turnos reservados
        </h1>
        <div className='flex flex-col gap-4 text-foreground w-full'>
          <div className='flex flex-col gap-4'>
            {appointments.length > 0 ? (
              sortAppointments(appointments).map((app) => {
                return (
                  <Card
                    className='border border-border hover:border-primary/50 transition-colors'
                    key={app.id}
                  >
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-xl flex items-center gap-2'>
                        <CheckCircle className='h-5 w-5 text-primary' />
                        Turno #{app.id}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='flex flex-col sm:flex-row gap-3 sm:gap-6'>
                        <div className='flex items-center gap-2 text-foreground'>
                          <Calendar className='h-4 w-4 text-muted-foreground' />
                          <span className='font-medium'>{app.date}</span>
                        </div>
                        <div className='flex items-center gap-2 text-foreground'>
                          <Clock className='h-4 w-4 text-muted-foreground' />
                          <span className='font-medium'>{app.time}</span>
                        </div>
                      </div>

                      <div className='flex items-start gap-2'>
                        <Car className='h-4 w-4 text-muted-foreground mt-0.5' />
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            Vehículo
                          </p>
                          <p className='font-medium text-foreground'>
                            {(app as Appointment).vehicle?.licensePlate}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-start gap-2'>
                        <Wrench className='h-4 w-4 text-muted-foreground mt-0.5' />
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            Taller
                          </p>
                          <p className='font-medium text-foreground'>
                            {(app as Appointment).workshop.workshopName}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-start gap-2'>
                        <CircleDot className='h-4 w-4 text-muted-foreground mt-0.5' />
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            Estado
                          </p>
                          <p className='font-medium text-foreground'>
                            <AppointmentStatusBadge
                              value={(app as Appointment).status}
                            />
                          </p>
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <p className='text-sm text-muted-foreground'>
                          Servicios
                        </p>
                        <div className='flex flex-wrap gap-2'>
                          {app.services?.length > 0 ? (
                            app.services.map((service, index) => (
                              <Badge
                                key={index}
                                variant='secondary'
                                className='text-sm'
                              >
                                {service.name}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant='outline' className='text-sm'>
                              Sin servicios
                            </Badge>
                          )}
                        </div>
                        {isCancelable((app as Appointment).status) && (
                          <Button
                            variant='destructive'
                            onClick={async () => {
                              await changeAppointmentStatus(
                                app.id,
                                AppointmentStatus.CANCELLED
                              )
                              await refetch()
                            }}
                          >
                            Cancelar turno
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className='flex justify-center items-center h-full w-full py-12'>
                <p className='text-center text-muted-foreground'>
                  No hay turnos agendados
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}
