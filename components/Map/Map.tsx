import React, { useMemo, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { randomCirclePoint } from "random-location";
import PointIcon from "../../assets/point-icon.svg";
import RadiusIcon from "../../assets/radius-mark.svg";
import CloseIcon from "../../assets/close-icon.svg";
import WhatsAppIcon from "../../assets/whatsapp-icon.svg";
import LinkIcon from "../../assets/link-icon.svg";
import { TShop } from "../../types";
import {
  MarkerStyle,
  PopupContentStyle,
  PopupCloseIconStyle,
  PopupTitleStyle,
  PopupSubTitleStyle,
  AddressStyle,
  LinksStyle,
  WhatsAppIconStyle,
  LinkIconStyle,
  ShopPointStyle,
  UserPointStyle
} from "./styles";
import { MAPBOX_GL_TOKEN } from "../../constants";

interface IMapProps {
  lat?: number;
  lng?: number;
  data?: TShop[];
}

const DEFAULT_PROPS: IMapProps = {
  lat: -31.4173391,
  lng: -64.183319,
  data: [
    {
      id: "123",
      name: "Test",
      location: {
        latLng: {
          lat: -31.4271906,
          lng: -64.1824606
        },
        address: "Santiago Derqui 419, GXI, Provincia de Córdoba, Argentina"
      },
      category: "Belleza y Cuidado Personal"
    }
  ]
};

const MapComponent = ({
  lat = DEFAULT_PROPS.lat,
  lng = DEFAULT_PROPS.lng,
  data = DEFAULT_PROPS.data
}: IMapProps): React.ReactElement => {
  const [selectedShop, setSelectedShop] = useState<TShop>(null);

  const DATA_POINTS = useMemo(() => {
    return data
      ? data.map((shop: TShop) => {
          const { latitude: lat, longitude: lng } = randomCirclePoint(
            {
              latitude: shop.location.latLng.lat,
              longitude: shop.location.latLng.lng
            },
            100
          );
          return {
            ...shop,
            location: {
              ...shop.location,
              latLng: { lat, lng }
            }
          };
        })
      : [];
  }, [data]);

  const handleClickMarker = (shop: TShop): void => {
    setSelectedShop(shop);
  };

  const handleClosePopup = (): void => {
    setSelectedShop(null);
  };

  return (
    <Map
      mapboxAccessToken={MAPBOX_GL_TOKEN}
      initialViewState={{
        longitude: lng,
        latitude: lat,
        zoom: 13
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      style={{
        height: "100%",
        width: "100%"
      }}
      {...(selectedShop && {
        longitude: selectedShop?.location.latLng.lng,
        latitude: selectedShop?.location.latLng.lat
      })}
    >
      <>
        {DATA_POINTS?.length &&
          DATA_POINTS.map((shop) => {
            return (
              <Marker
                longitude={shop?.location.latLng?.lng}
                latitude={shop?.location.latLng?.lat}
                key={shop?.id}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  handleClickMarker(shop);
                }}
              >
                <div className={MarkerStyle}>
                  <RadiusIcon
                    width={75}
                    height={75}
                    className={ShopPointStyle}
                  />
                </div>
              </Marker>
            );
          })}
        <Marker longitude={lng} latitude={lat}>
          <PointIcon width={24} height={24} className={UserPointStyle} />
        </Marker>
        {selectedShop && (
          <Popup
            longitude={selectedShop?.location.latLng.lng}
            latitude={selectedShop?.location.latLng.lat}
            anchor="bottom"
            offset={[7, -20]}
            className={PopupContentStyle}
            closeButton={false}
            closeOnMove={true}
            onClose={handleClosePopup}
          >
            <CloseIcon
              width={16}
              height={16}
              onClick={handleClosePopup}
              className={PopupCloseIconStyle}
            />
            <span className={PopupTitleStyle}>{selectedShop?.name}</span>
            <span className={PopupSubTitleStyle}>{selectedShop?.category}</span>
            <a
              href={`https://maps.google.com/?q=${selectedShop?.location?.latLng.lat},${selectedShop?.location?.latLng.lng}`}
              target="_blank"
              rel="noreferrer"
              className={AddressStyle}
            >
              {selectedShop?.location?.address}
            </a>
            <span className={LinksStyle}>
              {selectedShop?.contact?.whatsapp && (
                <a
                  href={`https://wa.me/54${selectedShop.contact.whatsapp}`}
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
              {selectedShop?.contact?.link && (
                <a
                  href={
                    selectedShop.contact.link.startsWith("http")
                      ? selectedShop.contact.link
                      : `//${selectedShop.contact.link}`
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
  );
};

export default MapComponent;
