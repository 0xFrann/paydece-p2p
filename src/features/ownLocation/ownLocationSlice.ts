import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { TLocation } from '../../types'

const initialState: TLocation = {
  latLng: {
    lat: 0,
    lng: 0,
  },
  address: '',
}

export const ownLocationSlice = createSlice({
  name: 'ownLocation',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<TLocation>) =>
      (state = action.payload),
  },
})

export const { setLocation } = ownLocationSlice.actions

export const selectOwnLocation = (state: RootState) => state.ownLocation

export default ownLocationSlice.reducer
