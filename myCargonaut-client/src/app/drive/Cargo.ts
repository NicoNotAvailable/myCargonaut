
export class Cargo {
  listId: number
  description: string;
  weight: number;
  length: number;
  width: number;
  height: number;

  private static curListId: number = 0;

  constructor(description: string, weight: number, length: number, width: number, height: number) {
    this.listId = Cargo.curListId++;
    this.description = description;
    this.weight = weight;
    this.length = length;
    this.width = width;
    this.height = height;
  }
}
