export class request {
  id: number;
  date: string;
  name: string;
  user: { id: number, profilePic: string, firstName: string, lastName: string };
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

  constructor(
    id: number,
  date: string,
    name: string,
    user: { id: number, profilePic: string, firstName: string, lastName: string },
    price: number,
    priceType:number,
    seats: number,
    info: number,
    smokingAllowed: boolean,
    animalsAllowed: boolean,
    cargo: Array<{
      description: string,
      weight: number,
      length: number,
      height: number,
      width: number
    }>,
    locations: Array<{
      stopNr: number,
      country: string,
      zipCode: number,
      city: string
    }>
  ) {
    this.id = id;
    this.date = date;
    this.name = name;
    this.user = user;
    this.price = price;
    this.priceType = priceType;
    this.seats = seats;
    this.info = info;
    this.smokingAllowed = smokingAllowed;
    this.animalsAllowed = animalsAllowed;
    this.cargo = cargo;
    this.locations = locations;
  }
}
