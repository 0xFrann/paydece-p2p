import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  selectOwnLocation,
  setLocation,
} from '../features/ownLocation/ownLocationSlice'

const LocationViewPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const location = useAppSelector(selectOwnLocation)
  const [currentLocation, setCurrentLocation] = useState<string>('')

  return (
    <>
      <h1>Welcome to the greatest app in the world!</h1>
      <h2>
        The current location is {` `}
        <code>{location.address}</code>
        {` `}
        and the address {currentLocation}
      </h2>
      <div>
        <input
          value={currentLocation}
          onChange={(e) => setCurrentLocation(String(e.target.value))}
        />
        <button
          onClick={() =>
            dispatch(
              setLocation({
                latLng: {
                  lat: 0,
                  lng: 0,
                },
                address: currentLocation,
              })
            )
          }
        >
          Set Location
        </button>
      </div>
    </>
  )
}

export default LocationViewPage
