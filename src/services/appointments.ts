import type { CreateAppointment, DateFilter } from '@/types/appointments.types'
import { get, post } from '@/utils/rest-api'

export const getNextAppointmentsOfUser = () => {
  return get(`/appointments/user`)
}

export const getNextAppointmentsOfMechanic = (dateFilter: DateFilter) => {
  return get(`/appointments`, { params: { dateFilter } })
}

export const createAppointment = (appointment: CreateAppointment) => {
  return post(`/appointments`, appointment)
}
