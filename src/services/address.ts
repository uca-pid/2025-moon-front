import type { Address, AddressDetailDto } from '@/types/address.types'
import { get } from '@/utils/rest-api'

export const fetchSuggestions = (input: string, signal: AbortSignal) => {
  return get<Address[]>('/addresses/autocomplete', {
    params: { input },
    signal,
  })
}

export const fetchAddressDetails = (placeId: string) => {
  return get<AddressDetailDto>(`/addresses/${placeId}`)
}
