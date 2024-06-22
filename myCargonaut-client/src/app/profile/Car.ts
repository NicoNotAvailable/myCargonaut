export class Car {
  id: number;
  name: string;
  weight: number;
  length: number;
  height: number;
  width: number;
  seats: number;
  hasAC: boolean;
  hasTelevision: boolean;
  carPicture: string;

  constructor(id: number, name: string, weight: number, length: number, height: number, width: number, seats: number, carPicture: string) {
    this.id = id;
    this.name  = name;
    this.weight = weight;
    this.length = length;
    this.height = height;
    this.width = width;
    this.seats = seats;
    this.hasAC = false;
    this.hasTelevision = false;
    this.carPicture = carPicture;
  }
}
