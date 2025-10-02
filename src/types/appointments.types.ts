import type { Service } from './services.types'
import type { User } from './users.types'
import type { Vehicle } from './vehicles.types'

export interface CreateAppointment {
  date: string
  time: string
  serviceIds: number[]
  workshopId: number
  vehicleId: number
}

export interface Appointment {
  type: 'appointment'
  id: number
  date: string
  time: string
  services: Service[]
  workshop: User
  vehicle: Vehicle
}

export interface Shift {
  type: 'shift'
  id: number
  date: string
  time: string
  user: User
  services: Service[]
  vehicle: Vehicle
}

export type DateFilter = 'past' | 'today' | 'future'
