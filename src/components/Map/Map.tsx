import 'mapbox-gl/dist/mapbox-gl.css'
import { randomCirclePoint } from 'random-location'
import { useEffect, useMemo, useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl'
import CloseIcon from '../../assets/close-icon.svg'
import LinkIcon from '../../assets/link-icon.svg'
import PointIcon from '../../assets/point-icon.svg'
import RadiusIcon from '../../assets/radius-mark.svg'
import WhatsAppIcon from '../../assets/whatsapp-icon.svg'
import { MAPBOX_GL_TOKEN } from '../../constants'
import { TLocation, TPoint } from '../../types'
import {
  LinkIconStyle,
  LinksStyle,
  MarkerStyle,
  PointStyle,
  PopupCloseIconStyle,
  PopupContentStyle,
  PopupSubTitleStyle,
  PopupTitleStyle,
  UserPointStyle,
  WhatsAppIconStyle,
} from './styles'

interface IMapProps {
  lat?: number
  lng?: number
  data?: TPoint[]
}

const DEFAULT_PROPS: IMapProps = {
  lat: -31.4173391,
  lng: -64.183319,
  data: [],
}

const MapComponent = ({
  lat = DEFAULT_PROPS.lat,
  lng = DEFAULT_PROPS.lng,
  data = DEFAULT_PROPS.data,
}: IMapProps): JSX.Element => {
  const [selectedPoint, setSelectedPoint] = useState<TPoint>(null)
  const [currentZoom, setCurrentZoom] = useState<number>(13)
  const [currentCenter, setCurrentCenter] = useState<TLocation['latLng']>({
    lat,
    lng,
  })

  const DATA_POINTS = useMemo(() => {
    return data
      ? data.map((point: TPoint) => {
          const { latitude: lat, longitude: lng } = randomCirclePoint(
            {
              latitude: point.location.latLng.lat,
              longitude: point.location.latLng.lng,
            },
            100
          )
          return {
            ...point,
            location: {
              ...point.location,
              latLng: { lat, lng },
            },
          }
        })
      : []
  }, [data])

  const handleClickMarker = (point: TPoint): void => {
    setSelectedPoint(point)
  }

  const handleClosePopup = (): void => {
    setSelectedPoint(null)
  }

  useEffect(() => {
    setCurrentCenter({ lat, lng })
  }, [lat, lng])

  return (
    <Map
      mapboxAccessToken={MAPBOX_GL_TOKEN}
      initialViewState={{
        longitude: lng,
        latitude: lat,
        zoom: 13,
      }}
      latitude={currentCenter.lat}
      longitude={currentCenter.lng}
      onZoom={(data) => setCurrentZoom(data.viewState.zoom)}
      onMove={(data) =>
        setCurrentCenter({
          lat: data.viewState.latitude,
          lng: data.viewState.longitude,
        })
      }
      mapStyle="mapbox://styles/mapbox/streets-v9"
      style={{
        height: '100%',
        width: '100%',
      }}
      {...(selectedPoint && {
        longitude: selectedPoint?.location.latLng.lng,
        latitude: selectedPoint?.location.latLng.lat,
      })}
    >
      <>
        {DATA_POINTS?.length &&
          DATA_POINTS.map((point) => {
            return (
              <Marker
                longitude={point?.location.latLng?.lng}
                latitude={point?.location.latLng?.lat}
                key={point?.id}
                onClick={(e) => {
                  e.originalEvent.stopPropagation()
                  handleClickMarker(point)
                }}
              >
                <div className={MarkerStyle}>
                  <RadiusIcon
                    width={Math.round(0.01 * 2 ** currentZoom)}
                    height={Math.round(0.01 * 2 ** currentZoom)}
                    className={`${PointStyle} ${
                      selectedPoint?.id === point.id
                        ? 'opacity-100'
                        : 'opacity-70'
                    }`}
                  />
                </div>
              </Marker>
            )
          })}
        <Marker longitude={lng} latitude={lat}>
          <PointIcon width={32} height={64} className={UserPointStyle} />
        </Marker>
        {selectedPoint && (
          <Popup
            longitude={selectedPoint?.location.latLng.lng}
            latitude={selectedPoint?.location.latLng.lat}
            anchor="bottom"
            offset={[7, -20]}
            className={PopupContentStyle}
            closeButton={false}
            closeOnMove
            onClose={handleClosePopup}
          >
            <CloseIcon
              width={16}
              height={16}
              onClick={handleClosePopup}
              className={PopupCloseIconStyle}
            />
            <span className={PopupTitleStyle}>{selectedPoint?.name}</span>
            <span className={PopupSubTitleStyle}>F2F</span>
            <span className={LinksStyle}>
              {selectedPoint?.contact?.whatsapp && (
                <a
                  href={`https://wa.me/54${selectedPoint.contact.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon
                    width={16}
                    height={16}
                    className={WhatsAppIconStyle}
                  />
                </a>
              )}
              {selectedPoint?.contact?.link && (
                <a
                  href={
                    selectedPoint.contact.link.startsWith('http')
                      ? selectedPoint.contact.link
                      : `//${selectedPoint.contact.link}`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <LinkIcon width={20} height={20} className={LinkIconStyle} />
                </a>
              )}
            </span>
          </Popup>
        )}
      </>
    </Map>
  )
}

export default MapComponent
