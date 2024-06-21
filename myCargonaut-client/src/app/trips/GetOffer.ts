export interface GetOffer {
  id: number;
  user: { id: number, profilePic: string, firstName: string, lastName: string };
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
  maxCHeight: number;
  maxCLength: number;
  maxCWeight: number;
  maxCWidth: number;
  maxTHeight: number | null;
  maxTLength: number;
  maxTWeight: number;
  maxTWidth: number;
  trailerID: number;
}
