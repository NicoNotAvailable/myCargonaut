export class StopLocation{
  stopNr: number;
  country: string;
  zipCode: number;
  city: string;
  constructor(stopNr: number, country: string, zipCode: number, city: string) {
    this.stopNr = stopNr;
    this.country = country;
    this.zipCode = zipCode;
    this.city = city;
  }
}
