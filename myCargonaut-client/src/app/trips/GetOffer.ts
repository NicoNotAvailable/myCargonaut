export interface GetOffer {
  id: number;
  user: { id: number, profilePic: string, firstName: string, lastName: string, rating: number };
  carID: number;
  carPicture: string;
  name: string;
  date: string;
  price: number;
  priceType: number;
  seats: number;
  animalsAllowed: boolean;
  smokingAllowed: boolean;
  info: number;
  locations: Array<any>;
  cargo: Array<any>;
  maxCHeight: number;
  maxCLength: number;
  maxCWeight: number;
  maxCWidth: number;
  maxTHeight: number | null;
  maxTLength: number | null;
  maxTWeight: number | null;
  maxTWidth: number | null;
  trailerID: number | null;
}
