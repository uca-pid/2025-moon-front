export interface Service {
  id: number
  name: string
  price: number
  spareParts: SparePartService[]
}

export interface SparePartService {
  id?: number
  sparePartId: number
  quantity: number
}

export interface CreateService {
  id?: number
  name: string
  price: number
  spareParts: SparePartService[]
}