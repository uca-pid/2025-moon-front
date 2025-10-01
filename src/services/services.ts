import type { PaginatedQueryDto } from "@/types/paginated.types"
import type { CreateService } from "@/types/services.types"
import { del, get, post, put } from "@/utils/rest-api"

export const getServiceById = (id: number) => {
  return get(`/services/${id}`)
}

export const getServicesByMechanicId = (mechanicId: number) => {
  return get(`/services/mechanic/${mechanicId}`)
}

export const getServices = (query: PaginatedQueryDto) => {
  return get(`/services`, { params: query })
}

export const createService = (service: CreateService) => {
  return post(`/services`, service)
}

export const updateService = (service: CreateService) => {
  return put(`/services/${service.id}`, service)
}

export const deleteService = (id: number) => {
  return del(`/services/${id}`)
}