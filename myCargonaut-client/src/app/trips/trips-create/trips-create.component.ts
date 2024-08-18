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

  editedCargo: number = -1;

  offerBool: boolean = true;
  requestBool: boolean = false;
  private cargoModalRef: NgbModalRef | undefined;
  //Cargo
  cargoDescription: string | null = null;
  cargoLength: number | null = null;
  cargoWidth: number | null = null;
  cargoHeight: number | null = null;
  cargoWeight: number | null = null;

  editModeText: string = "hinzufügen";

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

  addCargoClicked(content: TemplateRef<any>) {
    this.cargoDescription = null
    this.cargoWeight = null
    this.cargoLength = null
    this.cargoWidth = null
    this.cargoHeight = null

    this.editedCargo = -1;

    this.editModeText = "hinzufügen";

    this.openCargoModal(content);
  }

  editCargoClicked(content: TemplateRef<any>,  index: number) {
    this.cargoDescription = this.requestService.cargos[index].description;
    this.cargoWeight = this.requestService.cargos[index].weight;
    this.cargoLength = this.requestService.cargos[index].length;
    this.cargoWidth = this.requestService.cargos[index].width;
    this.cargoHeight = this.requestService.cargos[index].height;

    this.editedCargo = index;
    this.editModeText = "bearbeiten";

    this.openCargoModal(content);
  }

  addCargoToArray() {
    if (this.cargoDescription != null && this.cargoWeight != null &&
      this.cargoLength != null && this.cargoWidth != null &&
      this.cargoHeight != null) {
      if (this.editedCargo < 0) {
        const newCargo = new Cargo(this.cargoDescription, this.cargoWeight, this.cargoLength, this.cargoWidth, this.cargoHeight);
        this.requestService.addCargo(newCargo);

        this.cargoDescription = null;
        this.cargoWeight = null;
        this.cargoLength = null;
        this.cargoWidth = null;
        this.cargoHeight = null;

      } else if (this.editedCargo >= 0) {
        this.editCargo();
        this.editedCargo = -1;
      }
    }

    if (this.cargoModalRef) {
      this.cargoModalRef.close();
    }
  }

  editCargo() {
    if (this.cargoDescription != null && this.cargoWeight != null &&
      this.cargoLength != null && this.cargoWidth != null &&
      this.cargoHeight != null) {
      this.requestService.cargos[this.editedCargo].description = this.cargoDescription;
      this.requestService.cargos[this.editedCargo].weight = this.cargoWeight;
      this.requestService.cargos[this.editedCargo].length = this.cargoLength;
      this.requestService.cargos[this.editedCargo].width = this.cargoWidth;
      this.requestService.cargos[this.editedCargo].height = this.cargoHeight;
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
        trailerID: null,
      };
    }

    if (tripData.carID === 0 || tripData.carID === null) {
      this.errorMessage = "Wähle ein Auto aus"
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
      return;
    }
    this.tripsService.createRequestTrip(tripData).subscribe(
      () => {
        setTimeout(() => {
          window.location.href = "/chats";
        }, 200);
      }, error => {
        this.errorMessage = "Du musst eingeloggt sein und ein Profilbild/Telefonnummer hinterlegt haben!";
        console.error('There was an error!', error);
      },
    );
  }

  createOfferTrip(): void {
    const tripData = {
      driveID: this.offer?.id,
      usedSeats: this.seats,
      startLocationID: this.startLocation,
      endLocationID: this.endLocation,
      cargo: this.cargoDataArray,
    };

    if (tripData.startLocationID === 0 || tripData.startLocationID === null) {
      this.errorMessage = "Bitte gebe deinen Startpunkt an";
      setTimeout(() => {
        this.errorMessage = "";
      }, 5000);
    } else if (tripData.endLocationID === 0 || tripData.endLocationID === null) {
      this.errorMessage = "Bitte gebe dein Ziel an";
      setTimeout(() => {
        this.errorMessage;
      }, 5000);
    } else if (tripData.usedSeats === 0 || tripData.usedSeats === null) {
      this.errorMessage = "Bitte lege fest, wie viele Personen mitkommen";
      setTimeout(() => {
        this.errorMessage = "";
      }, 5000);
    } else if (tripData.usedSeats > this.offer?.seats!) {
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
          this.errorMessage = "Du musst eingeloggt sein und ein Profilbild/Telefonnummer hinterlegt haben!";
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
