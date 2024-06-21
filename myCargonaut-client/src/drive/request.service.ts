import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cargo } from '../app/drive/Cargo';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private cargos: Cargo[]
  //private locations: Location[]

  date: string | null = null;
  name: string | null = null;
  seats: number | null = null;
  info: number | null = null;
  smokingAllowed: boolean | null = null;
  animalsAllowed: boolean | null = null;


  constructor(private http: HttpClient) {
    this.cargos = [];
  }

  addCargo(cargo: Cargo): void {
    this.cargos.push(cargo);
  }

  getCargos() {
    return this.cargos;
  }

  addRequest() {

  }
}
