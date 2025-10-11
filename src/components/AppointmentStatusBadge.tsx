import { AppointmentStatus } from '@/types/appointments.types'
import { Badge } from './ui/badge'
import { appointmentStatusToLabel } from '@/helpers/appointment-status'

export const AppointmentStatusBadge = ({
  value,
}: {
  value: AppointmentStatus
}) => {
  const appointmentStatusToVariant: Record<
    AppointmentStatus,
    'default' | 'destructive' | 'outline' | 'secondary' | 'success' | 'warning'
  > = {
    [AppointmentStatus.PENDING]: 'warning',
    [AppointmentStatus.CONFIRMED]: 'outline',
    [AppointmentStatus.IN_SERVICE]: 'outline',
    [AppointmentStatus.SERVICE_COMPLETED]: 'outline',
    [AppointmentStatus.COMPLETED]: 'success',
    [AppointmentStatus.CANCELLED]: 'destructive',
  }
  const variant = appointmentStatusToVariant[value] || 'default'
  const label = appointmentStatusToLabel[value] || 'Desconocido'
  return <Badge variant={variant}>{label}</Badge>
}
