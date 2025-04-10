export interface IAddress {
  id: string; // lng_lat || random
  location: {
    type: string;
    coordinates: number[];
  };
  address: {
    countryCode: string;
    country: string;
    postCode: string;
    city: string;
    city_district: string;
    suburb: string;
    road: string;
    street: string;
    building: string;
    number: string;
    other: string;
  };
  short: string;
}
