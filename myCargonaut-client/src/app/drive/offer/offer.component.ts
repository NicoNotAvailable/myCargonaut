import {Component, EventEmitter, inject, Input, Output, TemplateRef} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {NgbInputDatepicker, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {
  faArrowLeft,
  faArrowRight,
  faCircle,
  faCirclePlus,
  faPenToSquare,
  faPlus,
  faSave,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import {SessionService} from "../../services/session.service";
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {OfferService} from '../../services/drive/offer.service';
import {LocationDrive} from '../LocationDrive';
import {VehicleService} from '../../services/vehicle.service';

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgbInputDatepicker,
    NgClass,
    NgForOf,
  ],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.css'
})
export class OfferComponent {

  public sessionService: SessionService = inject(SessionService);
  public offerService: OfferService = inject(OfferService);
  public userService: UserService = inject(UserService);
  public vehicleService: VehicleService = inject(VehicleService);

  @Input() editingOffer!: number;
  @Output() changeAddCar = new EventEmitter<void>();

  hadTrailerSelection: boolean = false

  talkMode: number | null = null;
  seats: number | null = null;

  editCarWeight: number | null = null;
  editCarLength: number | null = null;
  editCarWidth: number | null = null;
  editCarHeight: number | null = null;

  editTrailerWeight: number | null = null;
  editTrailerLength: number | null = null;
  editTrailerWidth: number | null = null;
  editTrailerHeight: number | null = null;

  stopLand: string | null = null;
  stopPLZ: string | null = null;
  stopPlace: string | null = null;

  editedStop: number = -1;

  editModeText: string = "hinzufügen";

  errorMessage: string = "";

  isLoggedIn: boolean = false;
  private carModalRef: NgbModalRef | undefined;
  private trailerModalRef: NgbModalRef | undefined;
  private stopModalRef: NgbModalRef | undefined;

  constructor(private modalService: NgbModal, private router: Router) {
  }

  ngOnInit(): void {
    this.sessionService.checkLoginNum().then(isLoggedIn => {
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      if (!this.isLoggedIn) {
        window.location.href = "/profile";
      }
    });
    this.editingOffer = 0;
    this.talkMode = 3;

    this.offerService.readUser();
    this.offerService.readCars();
    this.offerService.readTrailers();
  }

  changeTalkMode(num: any) {
    if (num < 1) {
      this.removeErrorMessage();
      return;
    }
    this.offerService.info = Number(num);
  }

  changeSeatCount(num: any) {
    if (num < 0) {
      this.errorMessage = "Gültige Anzahl der Sitze angeben";
      this.removeErrorMessage();
      return;
    }
    this.offerService.seats = Number(num);
  }

  removeErrorMessage(): void {
    setTimeout(() => {
      this.errorMessage = "";
    }, 5000);
  }

  openCarModal(content: TemplateRef<any>) {
    if (!this.offerService.selectedCar) {
      this.errorMessage = "Kein Auto ausgewählt";
    } else {
      this.editCarWeight = this.offerService.maxCWeight;
      this.editCarLength = this.offerService.maxCLength;
      this.editCarWidth = this.offerService.maxCWidth;
      this.editCarHeight = this.offerService.maxCHeight;

      this.carModalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-car-title'})
    }
  }

  closeCarModal() {
    if (this.trailerModalRef) {
      this.trailerModalRef.close();
    }
  }

  openTrailerModal(content: TemplateRef<any>) {
    if (!this.offerService.selectedTrailer) {
      this.errorMessage = "Kein Anhänger ausgewählt";
    } else {
      this.editTrailerWeight = this.offerService.maxTWeight;
      this.editTrailerLength = this.offerService.maxTLength;
      this.editTrailerWidth = this.offerService.maxTWidth;
      this.editTrailerHeight = this.offerService.maxTHeight;

      this.trailerModalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-trailer-title'})
    }
  }

  openStopModal(content: TemplateRef<any>) {
    this.stopModalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-stop-title'})
  }

  changeCarProperties() {
    this.offerService.maxCWeight = this.editCarWeight;
    this.offerService.maxCLength = this.editCarLength;
    this.offerService.maxCWidth = this.editCarWidth;
    this.offerService.maxCHeight = this.editCarHeight;

    if (this.carModalRef) {
      this.carModalRef.close();
    }
  }

  changeTrailerProperties() {
    this.offerService.maxTWeight = this.editTrailerWeight;
    this.offerService.maxTLength = this.editTrailerLength;
    this.offerService.maxTWidth = this.editTrailerWidth;
    this.offerService.maxTHeight = this.editTrailerHeight;

    if (this.trailerModalRef) {
      this.trailerModalRef.close();
    }
  }

  changePriceType(num: number) {
    if (num < 1) {
      this.errorMessage = "Bitte eine Preisart festlegen";
      this.removeErrorMessage();
      return;
    }
    this.offerService.priceType = Number(num);
  }

  addLocationStopClicked(content: TemplateRef<any>) {
    this.stopLand = null;
    this.stopPLZ = null;
    this.stopPlace = null;

    this.editModeText = "hinzufügen";

    this.openStopModal(content);
  }

  get stopsDataArray() {
    return this.offerService.getStops;
  }

  createSummaryOffer() {
    this.router.navigate(['/summary'], {queryParams: {origin: 'createoffer'}})
  }

  editLocationClicked(content: TemplateRef<any>, index: number) {
    this.stopLand = this.offerService.stops[index].country;
    this.stopPLZ = this.offerService.stops[index].zipCode;
    this.stopPlace = this.offerService.stops[index].city;

    this.editedStop = index;
    this.editModeText = "bearbeiten";

    this.openStopModal(content);
  }

  deleteStop(index: number) {
    this.offerService.stops.splice(index, 1);
  }


  addStopToArray() {
    if (this.stopLand != null && this.stopPLZ != null &&
      this.stopPlace != null) {
      if (this.editedStop < 0) {
        const newStop = new LocationDrive(this.stopLand, this.stopPLZ, this.stopPlace);
        this.offerService.addStop(newStop);

        this.stopLand = null;
        this.stopPLZ = null;
        this.stopPlace = null;
      } else if (this.editedStop >= 0) {
        this.editStop();
        this.editedStop = -1;
      }

    } else {

    }
    if (this.stopModalRef) {
      this.stopModalRef.close();
    }
  }

  editStop() {
    if (this.stopLand != null && this.stopPLZ != null &&
      this.stopPlace != null) {
      this.offerService.stops[this.editedStop].country = this.stopLand;
      this.offerService.stops[this.editedStop].zipCode = this.stopPLZ;
      this.offerService.stops[this.editedStop].city = this.stopPlace;
    }
  }

  selectCar(index: number): void {
    this.offerService.selectedCar = this.offerService.cars[index];
    this.offerService.carId = this.offerService.selectedCar.id;
    this.offerService.maxCWeight = this.offerService.selectedCar.weight;
    this.offerService.maxCLength = this.offerService.selectedCar.length;
    this.offerService.maxCWidth = this.offerService.selectedCar.width;
    this.offerService.maxCHeight = this.offerService.selectedCar.height;
  }

  selectTrailer(index: number): void {
    this.offerService.selectedTrailer = this.offerService.trailers[index];
    this.offerService.trailerId = this.offerService.selectedTrailer.id;
    this.offerService.maxTWeight = this.offerService.selectedTrailer.weight;
    this.offerService.maxTLength = this.offerService.selectedTrailer.length;
    this.offerService.maxTWidth = this.offerService.selectedTrailer.width;
    this.offerService.maxTHeight = this.offerService.selectedTrailer.height;

    this.hadTrailerSelection = true;
  }

  selectNoTrailer() {
    this.offerService.selectedTrailer = null;

    this.hadTrailerSelection = true;
  }

  private validTime() {
    if (this.offerService.time !== null) {
      const timePattern: RegExp = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
      return timePattern.test(this.offerService.time);
    }
    return false;
  }

  validInputs(): boolean {
    const errors = [];

    if (!this.offerService.name?.trim()) errors.push('Bitte Namen für den Trip angeben');
    if (!this.offerService.price) errors.push('Bitte einen Preisvorschlag festlegen');
    if (this.offerService.seats !== undefined && this.offerService.seats !== null && this.offerService.seats > this.offerService.selectedCar?.seats! - 1)
      errors.push('Bitte eine gültige Anzahl der Autositze');

    if (this.offerService.date) {
      const selectedDate = new Date(
        this.offerService.date.year,
        this.offerService.date.month - 1,
        this.offerService.date.day
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.push('Bitte ein Datum in der Zukunft festlegen');
      }
    } else {
      errors.push('Bitte ein Datum festlegen');
    }

    if (!this.offerService.time || !this.validTime()) errors.push('Bitte eine Uhrzeit festlegen');

    if (this.offerService.smokingAllowed === undefined)
      errors.push('Bitte angeben, ob sie Raucher mitnehmen möchten');
    if (this.offerService.animalsAllowed === undefined)
      errors.push('Bitte angeben, ob sie Haustierbesitzer mitnehmen möchte');

    if (!this.offerService.info || this.offerService.info < 1 || this.offerService.info > 3) errors.push('Bitte ihren Kommunikationswunsch angeben');
    if (!this.offerService.priceType || this.offerService.priceType < 1 || this.offerService.priceType > 3) errors.push('Bitte eine Preisart festlegen');

    if (this.offerService.profilePic == "empty.png") errors.push('Bitte ein Profilbild hochladen vor dem Erstellen ihres Angebots');

    if (!this.offerService.selectedCar) {
      errors.push('Bitte ein Auto für die Fahrt auswählen');
    } else {
      if (this.offerService.maxCWeight! < 1 || this.offerService.maxCWeight! > 1000)
        errors.push('Autogewicht muss zwischen 1 und 1000kg sein');
      if (this.offerService.maxCLength! < 1 || this.offerService.maxCLength! > 1000)
        errors.push('Autolänge muss zwischen 1 und 1000cm sein');
      if (this.offerService.maxCWidth! < 1 || this.offerService.maxCWidth! > 1000)
        errors.push('Autobreite muss zwischen 1 und 1000cm sein');
      if (this.offerService.maxCHeight! < 1 || this.offerService.maxCHeight! > 1000)
        errors.push('Autohöhe muss zwischen 1 und 1000cm sein');
    }

    if (this.offerService.selectedTrailer) {
      if (this.offerService.maxTWeight! < 1 || this.offerService.maxTWeight! > 1000)
        errors.push('Anhängergewicht muss zwischen 1 und 1000kg sein');
      if (this.offerService.maxTLength! < 1 || this.offerService.maxTLength! > 1000)
        errors.push('Anhängerlänge muss zwischen 1 und 1000cm sein');
      if (this.offerService.maxTWidth! < 1 || this.offerService.maxTWidth! > 1000)
        errors.push('Anhängerbreite muss zwischen 1 und 1000cm sein');
      if (this.offerService.maxTHeight! < 1 || this.offerService.maxTHeight! > 1000)
        errors.push('Anhängerhöhe muss zwischen 1 und 1000cm sein');
    }

    if (this.offerService.startLocation.country === undefined || this.offerService.startLocation.country.trim() === "")
      errors.push('Bitte ein gültiges Land als Startpunkt angeben');
    if (this.offerService.startLocation.zipCode === undefined || this.offerService.startLocation.zipCode.trim() === "")
      errors.push('Bitte eine gültige PLZ als Startpunkt angeben');
    if (this.offerService.startLocation.city === undefined || this.offerService.startLocation.city.trim() === "")
      errors.push('Bitte einen gültigen Ort als Startpunkt angeben');

    if (this.offerService.endLocation.country === undefined || this.offerService.endLocation.country.trim() === "")
      errors.push('Bitte ein gültiges Land als Zielort angeben');
    if (this.offerService.endLocation.zipCode === undefined || this.offerService.endLocation.zipCode.trim() === "")
      errors.push('Bitte eine gültige PLZ als Zielort angeben');
    if (this.offerService.endLocation.city === undefined || this.offerService.endLocation.city.trim() === "")
      errors.push('Bitte einen gültigen Ort als Zielort angeben');

    this.offerService.stops.forEach((stop) => {
      if (stop.country === undefined || stop.country === "")
        errors.push('Bitte gebe ein gültigen Wert für das Land im Zwischenstopp an');
      if (stop.zipCode === undefined || stop.zipCode === "")
        errors.push('Bitte gebe ein gültigen Wert für die PLZ im Zwischenstopp an');
      if (stop.city === undefined || stop.city === "")
        errors.push('Bitte gebe ein gültigen Wert für die Stadt im Zwischenstopp an');
    });

    if (!errors.length) {
      return true;
    }
    if (errors.length > 2) {
      errors.splice(2)
      this.errorMessage = errors.join(', ');
      this.errorMessage += " und weitere Fehler."
    } else {
      this.errorMessage = errors.join(', ');
    }
    this.removeErrorMessage();
    return false;
  }

  protected readonly faPenToSquare = faPenToSquare;
  protected readonly faX = faX;
  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faPlus = faPlus;
  protected readonly faArrowRight = faArrowRight;
  protected readonly faSave = faSave;
  protected readonly faCircle = faCircle;
  protected readonly faCirclePlus = faCirclePlus;
}
