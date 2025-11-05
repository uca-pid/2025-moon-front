import { get } from '@/utils/rest-api'
import type { DashboardStats } from '@/types/dashboards.types'

export const getClientDashboardStats = (): Promise<DashboardStats[]> => {
  return get(`/services/stats/user`)
}

export const getClientHistoryAppointments = () => {
  return get(`/appointments/user/history`)
}
