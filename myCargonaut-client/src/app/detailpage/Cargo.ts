export class Cargo{
  description: string;
  height: number;
  length: number;
  weight: number;
  width: number;
  constructor(description: string, height: number, length: number, weight: number, width: number) {
    this.description = description;
    this.height = height;
    this.length = length;
    this.weight = weight;
    this.width = width;
  }
}
