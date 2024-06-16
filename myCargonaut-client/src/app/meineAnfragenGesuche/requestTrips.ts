export class requestTrips {
  id: number;
  requesting: {
    id: number,
    profilePic: string,
    firstName: string,
    lastName: string,
    languages: string,
    profileText: string,
    isSmoker: boolean
  };
  car: {
    id: number,
    name: string,
    weight: number,
    length: number,
    height: number,
    width: number,
    seats: number,
    hasAC: boolean,
    hasTelevision: boolean,
    carPicture: string
  };
  trailer: {
    id: number,
    name: string,
    weight: number,
    length: number,
    height: number,
    width: number,
    isCooled: boolean,
    isEnclosed: boolean
  };

  constructor(
    id: number,
    requesting: {
      id: number,
      profilePic: string,
      firstName: string,
      lastName: string,
      languages: string,
      profileText: string,
      isSmoker: boolean
    },
    car: {
      id: number,
      name: string,
      weight: number,
      length: number,
      height: number,
      width: number,
      seats: number,
      hasAC: boolean,
      hasTelevision: boolean,
      carPicture: string
    },
    trailer: {
      id: number,
      name: string,
      weight: number,
      length: number,
      height: number,
      width: number,
      isCooled: boolean,
      isEnclosed: boolean
    }
  ) {
    this.id = id;
    this.requesting = requesting;
    this.car = car;
    this.trailer = trailer;
  }
}
