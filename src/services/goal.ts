import type { CreateGoalDto } from '@/types/goal.types'
import { get, post } from '@/utils/rest-api'

export const createGoal = (dto: CreateGoalDto) => {
  return post('/goals', dto)
}

export const getGoals = () => {
  return get('/goals')
}
