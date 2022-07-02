import { TLocation } from '../../types'
import PlacesAutocomplete from '../PlacesAutocomplete'

type Props = {
  onChange: (latLng: TLocation['latLng']) => void
}

const AddressBar = ({ onChange }: Props) => {
  return (
    <div className="m-2 bg-white border-2 border-[color:var(--primary)] rounded-full address-bar">
      <PlacesAutocomplete
        className="border-0 -m-2 focus:shadow-none"
        onSelect={(data) => onChange(data.latLng)}
      />
    </div>
  )
}

export default AddressBar
