export class Trailer {
  id: number;
  name: string;
  weight: number;
  length: number;
  height: number;
  width: number;
  isCooled: boolean;
  isEnclosed: boolean;

  constructor(id: number, name: string, weight: number, length: number, height: number, width: number) {
    this.id = id;
    this.name = name;
    this.weight = weight;
    this.length = length;
    this.height = height;
    this.width = width;
    this.isCooled = false;
    this.isEnclosed = false;
  }
}
