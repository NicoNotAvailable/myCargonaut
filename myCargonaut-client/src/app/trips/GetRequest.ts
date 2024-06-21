export interface GetRequest {
  id: number;
  date: string;
  name: string;
  user: { id: number, profilePic: string, firstName: string, lastName: string , rating: number};
  price: number;
  priceType: number;
  seats: number;
  info: number;
  smokingAllowed: boolean;
  animalsAllowed: boolean;
  cargo: Array<{
    description: string,
    weight: number,
    length: number,
    height: number,
    width: number
  }>;
  locations: Array<{
    stopNr: number,
    country: string,
    zipCode: number,
    city: string
  }>;
}
