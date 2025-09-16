import axios from 'axios'

export const login = (email: string, password: string) => {
  return axios.post('http://localhost:3001/users/login', {
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
  return axios.post('http://localhost:3001/users', {
    email,
    fullName,
    password,
    userRole,
    workshopName,
    address,
  })
}
