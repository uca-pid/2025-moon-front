import { get } from "@/utils/rest-api"

export const getAllServices = () => {
  return get('/service/all')
}

export const getServiceById = (id: number) => {
  return get(`/service/${id}`)
}