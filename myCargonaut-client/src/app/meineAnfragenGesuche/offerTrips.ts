export class offerTrips {
  id: number;
  requesting: { id: number, profilePic: string, firstName: string, lastName: string, languages: string, profileText: string, isSmoker: boolean };
  usedSeats: number;
  startLocation: { stopNr: number, country:string; zipCode:number; city: string };
  endLocation: { stopNr: number, country:string; zipCode:number; city: string };

  cargo: Array<{
    description: string,
    weight: number,
    length: number,
    height: number,
    width: number
  }>;


  constructor(
    id: number,
    requesting: {
      id: number;
      profilePic: string;
      firstName: string;
      lastName: string;
      languages: string;
      profileText: string;
      isSmoker: boolean;
    },
    usedSeats: number,
    startLocation: {
      stopNr: number;
      country: string;
      zipCode: number;
      city: string;
    },
    endLocation: {
      stopNr: number;
      country: string;
      zipCode: number;
      city: string;
    },
    cargo: Array<{
      description: string,
      weight: number,
      length: number,
      height: number,
      width: number
    }>,
  ) {
    this.id = id;
    this.requesting = requesting;
    this.usedSeats = usedSeats;
    this.startLocation = startLocation;
    this.endLocation = endLocation;
    this.cargo = cargo;
  }
}
