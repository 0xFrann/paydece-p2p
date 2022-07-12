export type TLocation = {
  latLng: {
    lat: number
    lng: number
  }
  address: string
}

export enum ECoins {
  'USDT' = 'USDT',
  'BUSD' = 'BUSD',
  'DAI' = 'DAI',
  'BTC' = 'BTC',
  'ETH' = 'ETH',
}

export enum EFiat {
  'USD' = 'USD',
  'ARS' = 'ARS',
}

export enum EPaymentMethod {
  'bank_transfer' = 'bank_transfer',
  'cash' = 'cash',
}

export type TPoint = {
  id: string
  name: string
  owner: string
  location: TLocation
  whatsappNumber?: number
  telegramUser?: string
  description?: string
  coins: ECoins[]
  fiat: EFiat[]
  exchangeMin?: number
  exchangeMax?: number
  shipping?: boolean
  paymentMethods?: EPaymentMethod[]
  created?: string
  updated?: string
}

export type TPointFormValues = {
  name: string
  address: string
  whatsappNumber: number
  telegramUser: string
  description: string
  coins: ECoins[]
  fiat: EFiat[]
  exchangeMin: number
  exchangeMax: number
  shipping: boolean
  paymentMethods: EPaymentMethod[]
}
