export interface Address {
  text: string
  placeId: string
}

export interface AddressDetailDto {
  text: string
  placeId: string
  location: {
    latitude?: number
    longitude?: number
  } | null
  addressComponents: { types: string[]; longText: string; shortText: string }[]
}
