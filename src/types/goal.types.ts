export enum GoalType {
  SERVICE = 'SERVICE',
  APPOINTMENTS = 'APPOINTMENTS',
}

export interface CreateGoalDto {
  label: string
  quantity: number
  type: GoalType
  serviceId: number
  startDate: string
  endDate: string
}

export interface GoalDto {
  id: number
  label: string
  type: GoalType
  quantity: number
  actual: number
  startDate: string
  endDate: string
}
