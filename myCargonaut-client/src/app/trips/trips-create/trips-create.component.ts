import { Component, inject, Input, OnInit, TemplateRef } from '@angular/core';
import {NgForOf, NgOptimizedImage} from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { offer } from '../../search/offers';
import { GetOffer } from '../GetOffer';
import { GetRequest } from '../GetRequest';
import { faCircle, faCirclePlus, faPenToSquare, faSave, faX } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Cargo } from '../../drive/Cargo';
import { RequestService } from '../../../drive/request.service';
import { SessionService } from '../../services/session.service';
import { VehicleService } from '../../services/vehicle.service';
import { Car } from "../../profile/Car";
import { Trailer } from "../../profile/Trailer";
import { TripsService } from '../../services/trips.service';
import { error } from '@angular/compiler-cli/src/transformers/util';

@Component({
  selector: 'app-trips-create',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf,
    FaIconComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './trips-create.component.html',
  styleUrl: './trips-create.component.css'
})
export class TripsCreateComponent implements OnInit {
  public sessionService: SessionService = inject(SessionService);
  public requestService: RequestService = inject(RequestService);
  public tripsService: TripsService = inject(TripsService);

  offerBool: boolean = true;
  requestBool: boolean = false;
  private cargoModalRef: NgbModalRef | undefined;
  //Cargo
  cargoDescription: string | null = null;
  cargoLength: number | null = null;
  cargoWidth: number | null = null;
  cargoHeight: number | null = null;
  cargoWeight: number | null = null;

   cars: Car[] = [];
  trailers: Trailer[] = [];

  selectedCar: number | null = null;
  selectedTrailer: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private vehicleService: VehicleService,

  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params ['type'] == "offer") {
        this.offerBool = true;
      } else if (params ['type'] == "request") {
        this.requestBool = true
        this.offerBool = false;
        this.getCars();
        this.getTrailers();
      }

    });
  }

  openCargoModal(content: TemplateRef<any>) {
    this.cargoModalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  addCargoToArray(modal: any) {
    if (this.cargoDescription != null && this.cargoWeight != null &&
      this.cargoLength != null && this.cargoWidth != null &&
      this.cargoHeight != null) {
      const newCargo = new Cargo(this.cargoDescription, this.cargoWeight, this.cargoLength, this.cargoWidth, this.cargoHeight);
      this.requestService.addCargo(newCargo);
      console.log('Cargo added:', newCargo);

      this.cargoDescription = null;
      this.cargoWeight = null;
      this.cargoLength = null;
      this.cargoWidth = null;
      this.cargoHeight = null;
    } else {

    }
    // Close the modal
    if (this.cargoModalRef) {
      this.cargoModalRef.close();
    }
  }

  get cargoDataArray() {
    return this.requestService.getCargos();
  }

  getCars(): void {
    this.vehicleService.readCars().subscribe( {
      next: (data: any) => {
        this.cars = data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  getTrailers(): void {
    this.vehicleService.readTrailers().subscribe( {
      next: (data: any) => {
        this.trailers = data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  createRequestTrip(form: any): void {
    const tripData = {
      driveID: this.request?.id,
      carID: this.selectedCar,
      trailerID: this.selectedTrailer,
    };
    if (tripData.carID === 0 || tripData.carID === null) {
      console.error('Car was not found', error);
    }
    this.tripsService.createRequestTrip(tripData).subscribe(
      response => {
        setTimeout(() => {
          window.location.reload();
        }, 200);
      }, error => {
        console.error('There was an error!', error);
      },
    );
  }

  @Input() offer!: GetOffer | undefined;
  @Input() request!: GetRequest | undefined;
  protected readonly faSave = faSave;
  protected readonly faCircle = faCircle;
  protected readonly faCirclePlus = faCirclePlus;
  protected readonly faX = faX;
  protected readonly faPenToSquare = faPenToSquare;
}
