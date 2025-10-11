import { get, put } from '@/utils/rest-api'

export const getNotifications = () => {
  return get('/notifications')
}

export const markNotificationAsRead = (id: number) => {
  return put(`/notifications/${id}/read`)
}
