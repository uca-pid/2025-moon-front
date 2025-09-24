import type { CreateAppointment } from '@/types/appointments.types'
import { get, post } from '@/utils/rest-api'

export const getNextAppointmentsOfUser = () => {
  return get(`/appointments/user`)
}

export const getNextAppointmentsOfMechanic = () => {
  return get(`/appointments`)
}

export const createAppointment = (appointment: CreateAppointment) => {
  return post(`/appointments`, appointment)
}
