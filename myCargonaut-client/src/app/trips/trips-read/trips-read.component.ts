import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import { GetOffer } from '../GetOffer';
import { GetRequest } from '../GetRequest';
import { VehicleService } from '../../services/vehicle.service';
import {offer} from "../../search/offers";

@Component({
  selector: 'app-trips-read',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './trips-read.component.html',
  styleUrl: './trips-read.component.css'
})
export class TripsReadComponent implements OnInit {
  offerBool: boolean = true;
  requestBool: boolean = false;

  carModel: string = "";
  carTV: boolean = false;
  carAC: boolean = false;

  trailerCool: boolean | null = null;
  trailerEnclosed: boolean | null = null;

  @Input() offer: GetOffer | undefined;
  @Input() request: GetRequest | undefined;
  @Output() createTripRequest = new EventEmitter<void>();

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params ['type'] == "offer") {
        this.offerBool = true;
        this.getCar(this.offer?.carID);
        this.getTrailer(this.offer?.trailerID);
      } else if (params ['type'] == "request") {
        this.requestBool = true
        this.offerBool = false;
      }
    });
  }
  onSendRequestClick(): void {
    this.createTripRequest.emit();
  }

  getCar(id: number | null | undefined): void {
    if (id == undefined) {
      return;
    }
    this.vehicleService.readCar(id).subscribe( {
      next: (data: any) => {
        this.carModel = data.name;
        this.carTV = data.hasTelevision;
        this.carAC = data.hasAC;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getTrailer(id: number  | null | undefined): void {
    if (id == undefined) {
      return;
    }
    this.vehicleService.readTrailer(id).subscribe( {
      next: (data: any) => {
        this.trailerCool = data.isCooled;
        this.trailerEnclosed = data.isEnclosed;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
