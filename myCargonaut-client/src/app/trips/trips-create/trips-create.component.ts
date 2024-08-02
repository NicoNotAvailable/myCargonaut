import {Component, inject, Input, OnInit, TemplateRef} from '@angular/core';
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {ActivatedRoute} from '@angular/router';
import {GetOffer} from '../GetOffer';
import {GetRequest} from '../GetRequest';
import {faCircle, faCirclePlus, faPenToSquare, faSave, faX} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Cargo} from '../../drive/Cargo';
import {RequestService} from '../../services/drive/request.service';
import {SessionService} from '../../services/session.service';
import {VehicleService} from '../../services/vehicle.service';
import {Car} from "../../profile/Car";
import {Trailer} from "../../profile/Trailer";
import {TripsService} from '../../services/trips.service';

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

  seats: number | null = null;

  validStartLocations: Array<any> | null | undefined = null;
  validEndLocations: Array<any> | null | undefined = null;

  startLocation: number | null = null;
  endLocation: number | null = null;

  errorMessage: string = "";

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private vehicleService: VehicleService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params ['type'] == "offer") {
        this.validStartLocations = this.offer?.locations.slice(0, this.offer?.locations.length - 1);
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
    this.cargoModalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  addCargoToArray() {
    if (this.cargoDescription != null && this.cargoWeight != null &&
      this.cargoLength != null && this.cargoWidth != null &&
      this.cargoHeight != null) {
      const newCargo = new Cargo(this.cargoDescription, this.cargoWeight, this.cargoLength, this.cargoWidth, this.cargoHeight);
      this.requestService.addCargo(newCargo);

      this.cargoDescription = null;
      this.cargoWeight = null;
      this.cargoLength = null;
      this.cargoWidth = null;
      this.cargoHeight = null;
    }

    if (this.cargoModalRef) {
      this.cargoModalRef.close();
    }
  }

  get cargoDataArray() {
    return this.requestService.getCargos;
  }

  getCars(): void {
    this.vehicleService.readCars().subscribe({
      next: (data: any) => {
        this.cars = data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getTrailers(): void {
    this.vehicleService.readTrailers().subscribe({
      next: (data: any) => {
        this.trailers = data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  createRequestTrip(): void {

    let tripData: any;

    if (this.selectedTrailer) {
      tripData = {
        driveID: this.request?.id,
        carID: this.selectedCar,
        trailerID: this.selectedTrailer,
      };
    } else {
      tripData = {
        driveID: this.request?.id,
        carID: this.selectedCar,
      };
    }


    if (tripData.carID === 0 || tripData.carID === null) {
      console.error('Car was not found');
    }
    this.tripsService.createRequestTrip(tripData).subscribe(
      () => {
        setTimeout(() => {
          window.location.href = "/chats";
        }, 200);
      }, error => {
        console.error('There was an error!', error);
      },
    );
  }

  createOfferTrip(): void {
    const tripData = {
      driveID: this.offer?.id,
      seats: this.seats,
      startLocation: this.startLocation,
      endLocation: this.endLocation,
      cargo: this.cargoDataArray,
    };
    if (tripData.startLocation === 0 || tripData.startLocation === null) {
      this.errorMessage = "Bitte gebe deinen Startpunkt an";
      setTimeout(() => {
        this.errorMessage = "";
      }, 5000);
    } else if (tripData.endLocation === 0 || tripData.endLocation === null) {
      this.errorMessage = "Bitte gebe dein Ziel an";
      setTimeout(() => {
        this.errorMessage;
      }, 5000);
    } else if (tripData.seats === 0 || tripData.seats === null) {
      this.errorMessage = "Bitte lege fest, wie viele Personen mitkommen";
      setTimeout(() => {
        this.errorMessage = "";
      }, 5000);
    } else if (tripData.seats > this.offer?.seats!) {
      this.errorMessage = "Zu viele Personen für diese Fahrt";
      setTimeout(() => {
        this.errorMessage = "";
      }, 5000);
    } else {
      this.tripsService.createOfferTrip(tripData).subscribe(
        () => {
          setTimeout(() => {
            window.location.href = "/chats";
          }, 200);
        }, error => {
          console.error('There was an error!', error);
        },
      );
    }

  }

  deleteCargo(index: number) {
    this.requestService.cargos.splice(index, 1);
  }

  startpointChanged() {
    this.validEndLocations = this.offer?.locations.slice(this.startLocation!);
    this.endLocation = null;
  }


  @Input() offer!: GetOffer | undefined;
  @Input() request!: GetRequest | undefined;
  protected readonly faSave = faSave;
  protected readonly faCircle = faCircle;
  protected readonly faCirclePlus = faCirclePlus;
  protected readonly faX = faX;
  protected readonly faPenToSquare = faPenToSquare;
}
