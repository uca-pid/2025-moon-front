import type { SparePart } from "./spare-part.types"

export interface Service {
  id: number
  name: string
  price: number
  spareParts: SparePartService[]
  status: string
}

export interface SparePartService {
  serviceId: number
  sparePartId: number
  quantity: number
  sparePart: SparePart
}

export interface CreateSparePartService {
  sparePartId: number
  quantity: number
}

export interface CreateService {
  id?: number
  name: string
  price: number
  spareParts: CreateSparePartService[]
}