export class LocationDrive {
  stopNr: number;
  country: string;
  zipCode: string;
  city: string;

  constructor(stopNr: number, country: string, zipCode: string, city: string) {
    this.stopNr = stopNr;
    this.country = country;
    this.zipCode = zipCode;
    this.city = city;
  }
}
