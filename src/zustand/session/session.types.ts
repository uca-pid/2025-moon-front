export const UserRoles = {
  MECHANIC: 'MECHANIC',
  USER: 'USER',
  NULL: '',
} as const

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles]

export interface User {
  id: string
  token: string
  fullName: string
  email: string
  userRole: UserRole
  workshopName: string
  address: string
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
  id: '',
  token: '',
  fullName: '',
  email: '',
  userRole: UserRoles.NULL,
  workshopName: '',
  address: '',
  exp: 0,
  expiresAt: undefined,
}

export const sessionInitialState: SessionState = {
  user: userInitialState,
}
