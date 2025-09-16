import { post } from '@/utils/rest-api'

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
