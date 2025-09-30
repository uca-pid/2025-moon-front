import type { Service } from './services.types'
import type { User } from './users.types'

export interface CreateAppointment {
  date: string
  time: string
  serviceIds: number[]
  workshopId: number
}

export interface Appointment {
  type: 'appointment'
  id: number
  date: string
  time: string
  services: Service[]
  workshop: User
}

export interface Shift {
  type: 'shift'
  id: number
  date: string
  time: string
  user: User
  services: Service[]
}
