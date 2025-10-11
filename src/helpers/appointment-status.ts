import { AppointmentStatus } from '@/types/appointments.types'

export function isCancelable(status: AppointmentStatus) {
  return (
    status === AppointmentStatus.PENDING ||
    status === AppointmentStatus.CONFIRMED
  )
}

export function isInFinalState(status: AppointmentStatus) {
  return (
    status === AppointmentStatus.CANCELLED ||
    status === AppointmentStatus.COMPLETED
  )
}

export function nextStateOf(status: AppointmentStatus) {
  const defaultStatusFlow = [
    AppointmentStatus.PENDING,
    AppointmentStatus.CONFIRMED,
    AppointmentStatus.IN_SERVICE,
    AppointmentStatus.SERVICE_COMPLETED,
    AppointmentStatus.COMPLETED,
  ]
  const currentIndex = defaultStatusFlow.indexOf(status)
  if (currentIndex === -1) {
    throw new Error(`Unknown status: ${status}`)
  }
  return defaultStatusFlow[currentIndex + 1]
}

export const appointmentStatusToLabel: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]: 'Pendiente',
  [AppointmentStatus.CONFIRMED]: 'Confirmado',
  [AppointmentStatus.IN_SERVICE]: 'En servicio',
  [AppointmentStatus.SERVICE_COMPLETED]: 'Servicio completado',
  [AppointmentStatus.COMPLETED]: 'Completado',
  [AppointmentStatus.CANCELLED]: 'Cancelado',
}
