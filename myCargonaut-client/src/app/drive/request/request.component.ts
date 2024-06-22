import {Component, EventEmitter, inject, Input, Output, TemplateRef} from "@angular/core";
import {SessionService} from "../../services/session.service";
import { NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import {
  faArrowRight,
  faCircle,
  faCirclePlus,
  faDeleteLeft, faPenToSquare,
  faPlus,
  faSave,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import {FormsModule, NgForm} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {NgbActiveModal, NgbModal, NgbModalRef, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { RequestService } from '../../../drive/request.service';
import { Cargo } from '../Cargo';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    FormsModule,
    FaIconComponent,
    NgbInputDatepicker,
    NgOptimizedImage,
    NgForOf,
  ],
  templateUrl: './request.component.html',
  styleUrls: [
    './request.component.css'
  ]
})
export class RequestComponent {
  public sessionService: SessionService = inject(SessionService);
  public requestService: RequestService = inject(RequestService);
  public userService: UserService = inject(UserService);


  @Output() changeAddCar = new EventEmitter<void>();

  editedCargo: number = -1;

  message: string = "";
  textColor: string = "errorText";

  smokingAllowed = false;
  animalsAllowed = false;

  requestedPrice: number | null = null;
  talkMode: number | null = null;

  seats: number | null = null;

  //Cargo
  cargoDescription: string | null = null;
  cargoLength: number | null = null;
  cargoWidth: number | null = null;
  cargoHeight: number | null = null;
  cargoWeight: number | null = null;

  time: string = "";

  startLand: string = "";
  startPLZ: string = "";
  startPlace: string = "";

  endLand: string = "";
  endPLZ: string = "";
  endPlace: string = "";

  editModeText: string = "hinzufügen";

  errorMessage: string = "";

  isLoggedIn: boolean = false;
  private http: any;
  private cargoModalRef: NgbModalRef | undefined;


  constructor(private modalService: NgbModal, private router: Router) {
  }

  ngOnInit(): void {
    //console.log(this.sessionService.checkLogin());
    this.sessionService.checkLoginNum().then(isLoggedIn => {
      console.log('Login status:', isLoggedIn);
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      if (!this.isLoggedIn) {
        window.location.href = "/profile";
      }
    });
    this.talkMode = 3;



    this.readUser();
  }

  readUser() {
    const prePath: string = "assets/";

    this.userService.readUser().subscribe(

      response => {
        this.requestService.firstName = response.firstName;
        this.requestService.lastName = response.lastName;

        const imagePath: string = response.profilePic;
        this.requestService.profilePic = response.profilePic;
        this.requestService.pathToImage = imagePath === "empty.png" ? "assets/empty.png" : prePath.concat(imagePath);
      },
      error => {
        console.error("There was an error!", error);
      }
    );
  }

  openCargoModal(content: TemplateRef<any>) {
      this.cargoModalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  changeTalkMode(num: any) {
    if (num < 1) {
      this.removeErrorMessage();
      return;
    }
    this.requestService.info = Number(num);
  }

  createSummaryRequest(form: any): void {
    this.router.navigate(['/summary'], { queryParams: { origin: 'createrequest' } });
  }

  changeAddCarState(): void {
    this.changeAddCar.emit();
  }

  changeRequestedPrice(num: any) {
    //TODO changing the price
  }

  setSmokingAllowed(value: boolean) {
    this.requestService.setSmokingAllowed(value);
  }

  setAnimalsAllowed(value: boolean) {
    this.requestService.setAnimalsAllowed(value);
  }

  deleteRequest(id: number) {
    /*this.http.delete("http://localhost:8000/drive/" + id, { withCredentials: true }).subscribe(
      response => {
        this.changeAddCarState();
      },
      error => {
        console.error(error);
      }
    );*/
  }

  changeSeatCount(num: any) {
    if (num < 1) {
      this.errorMessage = "Dein Auto kann nicht weniger als einen Sitz haben";
      this.removeErrorMessage();
      return;
    }
    this.requestService.seats = Number(num);
  }


  removeErrorMessage(): void {
    setTimeout(() => {
      this.errorMessage = "";
    }, 5000);
  }

  addCargoClicked(content: TemplateRef<any>) {
    this.cargoDescription = null
    this.cargoWeight = null
    this.cargoLength = null
    this.cargoWidth = null
    this.cargoHeight = null

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

  addCargoToArray(modal: any) {
    if (this.cargoDescription != null && this.cargoWeight != null &&
      this.cargoLength != null && this.cargoWidth != null &&
      this.cargoHeight != null) {
      if (this.editedCargo < 0) {
        const newCargo = new Cargo(this.cargoDescription, this.cargoWeight, this.cargoLength, this.cargoWidth, this.cargoHeight);
        this.requestService.addCargo(newCargo);
        console.log('Cargo added:', newCargo);

        this.cargoDescription = null;
        this.cargoWeight = null;
        this.cargoLength = null;
        this.cargoWidth = null;
        this.cargoHeight = null;

        console.log(this.requestService.cargos);
      } else if (this.editedCargo >= 0) {
        this.editCargo();
        this.editedCargo = -1;
      }

    } else {

    }
    // Close the modal
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
    return this.requestService.getCargos();
  }

  deleteCargo(index: number) {
    this.requestService.cargos.splice(index, 1);
  }

  private validTime() {
    if (this.requestService.time !== null) {
      const timePattern: RegExp = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
      return timePattern.test(this.requestService.time);
    }
    return false;
  }

  validInputs(): boolean {
    const errors = [];

    if (!this.requestService.name?.trim()) errors.push('Bitte Namen für den Trip angeben');
    if (!this.requestService.price) errors.push('Bitte einen Preisvorschlag festlegen');
    if (this.requestService.seats !== undefined && this.requestService.seats !== null && this.requestService.seats > 10)
      errors.push('Bitte eine gültige Anzahl der Sitze bis 10 angeben');

    if (!this.requestService.date) errors.push('Bitte ein Datum festlegen');
    if (!this.requestService.time || !this.validTime()) errors.push('Bitte eine Uhrzeit festlegen');

    if (this.requestService.smokingAllowed === undefined)
      errors.push('Bitte angeben, ob sie Raucher mitnehmen möchten');
    if (this.requestService.animalsAllowed === undefined)
      errors.push('Bitte angeben, ob sie Haustierbesitzer mitnehmen möchte');

    if (!this.requestService.info || this.requestService.info < 1 || this.requestService.info > 3 ) errors.push('Bitte ihren Kommunikationswunsch angeben');

    if (this.requestService.locations[0].country === undefined || this.requestService.locations[0].country.trim() === "")
      errors.push('Bitte einen gültiges Land als Startpunkt angeben');
    if (this.requestService.locations[0].zipCode === undefined || this.requestService.locations[0].zipCode.trim() === "")
      errors.push('Bitte eine gültige PLZ als Startpunkt angeben');
    if (this.requestService.locations[0].city === undefined || this.requestService.locations[0].city.trim() === "")
      errors.push('Bitte einen gültigen Ort als Startpunkt angeben');

    if (this.requestService.locations[1].country === undefined || this.requestService.locations[1].country.trim() === "")
      errors.push('Bitte einen gültiges Land als Zielort angeben');
    if (this.requestService.locations[1].zipCode === undefined || this.requestService.locations[1].zipCode.trim() === "")
      errors.push('Bitte eine gültige PLZ als Zielort angeben');
    if (this.requestService.locations[1].city === undefined || this.requestService.locations[1].city.trim() === "")
      errors.push('Bitte einen gültigen Ort als Zielort angeben');

    this.requestService.cargos.forEach((cargo) => {
      if (!cargo.description?.trim())
        errors.push('Bitte Name des Cargos angeben');
      if (cargo.weight < 1 || cargo.weight > 1000)
        errors.push('Cargogewicht von ' + cargo.description + ' muss zwischen 1 und 1000 sein');
      if (cargo.length < 1 || cargo.length > 1000)
        errors.push('Cargolänge von ' + cargo.description + ' muss zwischen 1 und 1000 sein');
      if (cargo.height < 1 || cargo.height > 1000)
        errors.push('Cargobreite von ' + cargo.description + ' muss zwischen 1 und 1000 sein');
      if (cargo.width < 1 || cargo.width > 1000)
        errors.push('Cargohöhe von ' + cargo.description + ' muss zwischen 1 und 1000 sein');
    });

    if (errors.length) {
      if (errors.length > 2) {
        errors.splice(2)
        this.errorMessage= errors.join(', ');
        this.errorMessage += " und weitere Fehler."
      } else {
        this.errorMessage= errors.join(', ');
      }
      return false;
    }
    return true;

  }

  protected readonly faDeleteLeft = faDeleteLeft;
  protected readonly faSave = faSave;
  protected readonly faCirclePlus = faCirclePlus;
  protected readonly faPlus = faPlus;
  protected readonly window = window;
  protected readonly faArrowRight = faArrowRight;
  protected readonly faCircle = faCircle;
  protected readonly faX = faX;
  protected readonly faPenToSquare = faPenToSquare;
  protected readonly console = console;
}
