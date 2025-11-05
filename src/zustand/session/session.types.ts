export const UserRoles = {
  MECHANIC: 'MECHANIC',
  USER: 'USER',
  NULL: '',
} as const

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles]

export interface User {
  id: number
  token: string
  fullName: string
  email: string
  userRole: UserRole
  workshopName: string
  address: string
  addressLatitude: number
  addressLongitude: number
  exp: number
  expiresAt?: {
    date: Date
    iso: string
    local: string
  }
}

export interface SessionState {
  user: User
}

export const userInitialState: User = {
  id: 0,
  token: '',
  fullName: '',
  email: '',
  userRole: UserRoles.NULL,
  workshopName: '',
  address: '',
  addressLatitude: 0,
  addressLongitude: 0,
  exp: 0,
  expiresAt: undefined,
}

export const sessionInitialState: SessionState = {
  user: userInitialState,
}
