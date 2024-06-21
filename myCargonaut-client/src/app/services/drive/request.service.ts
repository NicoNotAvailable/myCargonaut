import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cargo } from '../../drive/Cargo';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private cargos: Cargo[]

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
