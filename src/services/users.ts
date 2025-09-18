import { post, put } from '@/utils/rest-api'

export const login = (email: string, password: string) => {
  return post('/users/login', {
    email,
    password,
  })
}

export const register = (
  email: string,
  fullName: string,
  password: string,
  userRole: string,
  workshopName?: string,
  address?: string
) => {
  return post('/users', {
    email,
    fullName,
    password,
    userRole,
    workshopName,
    address,
  })
}

export const passwordRecovery = (email: string) => {
  return post('/users/password-recovery', { email })
}

export const changePassword = (
  email: string,
  token: string,
  newPassword: string
) => {
  return post('/users/change-password', { email, token, newPassword })
}

export const updateUser = (fullName: string, token: string) => {
  return put(
    '/users',
    { fullName },
    { headers: { Authorization: `Bearer ${token}` } }
  )
}

export const updateUserPassword = (
  currentPassword: string,
  newPassword: string,
  token: string
) => {
  return put(
    '/users/password',
    { currentPassword, newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  )
}
