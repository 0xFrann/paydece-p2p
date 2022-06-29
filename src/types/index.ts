export type TLocation = {
  latLng: {
    lat: number;
    lng: number;
  };
  address: string;
};

export type TPoint = {
  id: string;
  name: string;
  ownerId?: string;
  location: TLocation;
  logo?: string;
  category: string;
  contact?: {
    whatsapp?: number;
    link?: string;
  };
};
