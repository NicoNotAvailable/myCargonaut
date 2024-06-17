export class offer {
  id: number;
  user: { id: number, profilePic: string, firstName: string, lastName: string };
  carID: number;
  carPicture: string;
  name: string;
  date: string;
  price: number;
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

  constructor(
    id: number,
    user: { id: number, profilePic: string, firstName: string, lastName: string },
    carID: number,
    carPicture: string,
    name: string,
    date: string,
    price: number,
    seats: number,
    animalsAllowed: boolean,
    smokingAllowed: boolean,
    info: number,
    locations: Array<any>,
    maxCHeight: number,
    maxCLength: number,
    maxCWeight: number,
    maxCWidth: number,
    maxTHeight: number | null,
    maxTLength: number,
    maxTWeight: number,
    maxTWidth: number,
    trailerID: number
  ) {
    this.id = id;
    this.user = user;
    this.carID = carID;
    this.carPicture = carPicture;
    this.name = name;
    this.date = date;
    this.price = price;
    this.seats = seats;
    this.animalsAllowed = animalsAllowed;
    this.smokingAllowed = smokingAllowed;
    this.info = info;
    this.locations = locations;
    this.maxCHeight = maxCHeight;
    this.maxCLength = maxCLength;
    this.maxCWeight = maxCWeight;
    this.maxCWidth = maxCWidth;
    this.maxTHeight = maxTHeight;
    this.maxTLength = maxTLength;
    this.maxTWeight = maxTWeight;
    this.maxTWidth = maxTWidth;
    this.trailerID = trailerID;
  }
}
