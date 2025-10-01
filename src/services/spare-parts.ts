import type { PaginatedQueryDto } from '@/types/paginated.types'
import type { SparePartData } from '@/types/spare-part.types'
import { get, post, put, del } from '@/utils/rest-api'

export const getSpareParts = (query: PaginatedQueryDto) => {
  return get('/spare-parts', { params: query })
}

export const getById = (id: number) => {
  return get(`/spare-parts/${id}`)
}

export const create = (data: SparePartData) => {
  return post('/spare-parts', data)
}

export const edit = (id: number, data: SparePartData) => {
  return put(`/spare-parts/${id}`, data)
}

export const remove = (id: number) => {
  return del(`/spare-parts/${id}`)
}
