export type TLocation = {
  latLng: {
    lat: number
    lng: number
  }
  address: string
}

export type TPoint = {
  id: string
  name: string
  owner: string
  location: TLocation
  logo?: string
  contact?: {
    whatsapp?: number
    link?: string
  }
  created?: string
  updated?: string
}

export type TPointFormValues = {
  name: string
  address: string
  whatsapp: string
  link: string
}
