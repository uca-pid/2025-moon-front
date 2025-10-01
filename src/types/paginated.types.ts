export interface PaginatedQueryDto {
  page: number
  pageSize: number
  search: string
  order: string
}

export interface PaginatedResponseDto<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  orderId: string
  orderDesc: boolean
}
