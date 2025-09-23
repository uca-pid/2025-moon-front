export interface User {
  id: number
  fullName: string
  email: string
  workshopName?: string
  address?: string
  addressLatitude?: number
  addressLongitude?: number
}

export interface UpdateUser {
  fullName: string
  workshopName?: string
  address?: string
  addressLatitude?: number
  addressLongitude?: number
}
