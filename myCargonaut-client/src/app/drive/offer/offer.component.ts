import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgbInputDatepicker, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  faArrowRight,
  faCircle,
  faCirclePlus,
  faPenToSquare,
  faPlus,
  faSave,
  faX
} from "@fortawesome/free-solid-svg-icons";
import {SessionService} from "../../services/session.service";
import {DriveModalComponent} from "../drive-modal/drive-modal.component";

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    NgbInputDatepicker,
    NgClass
  ],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.css'
})
export class OfferComponent {

  public sessionService: SessionService = inject(SessionService);

  @Input() editingOffer!: number;
  @Output() changeAddCar = new EventEmitter<void>();

  offeredPrice: number | null = null;
  offeredPriceType: number | null = null;
  talkMode: number | null = null;
  seats: number | null = null;

  //Cargo
  description: string | null = null;
  length: number | null = null;
  width: number | null = null;
  height: number | null = null;
  weight: number | null = null;

  name: string = "";
  date: string = "";
  time: string = "";
  startLand: string = "";
  startPLZ: string = "";
  startPlace: string = "";
  endLand: string = "";
  endPLZ: string = "";
  endPlace: string = "";

  stopLand: string = "Deutschland";
  stopPLZ: string = "35390";
  stopPlace: string = "Gießen";

  errorMessage: string = "";

  isLoggedIn: boolean = false;
  private http: any;
  private router: any;

  constructor(private modalService: NgbModal, public dialog: MatDialog) {}

  ngOnInit(): void {
    //console.log(this.sessionService.checkLogin());
    this.sessionService.checkLoginNum().then(isLoggedIn => {
      console.log('Login status:', isLoggedIn);
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      if (!this.isLoggedIn) {
        window.location.href = "/profile";
      }
    });
    this.editingOffer = 0;
    this.talkMode = 3;
  }

  openCarDialog() {
    const dialogRef = this.dialog.open(DriveModalComponent, {
      width: '400px',
      data: { template: 'tripCar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The weight dialog was closed. Result:', result);
    });
  }

  changeTalkMode(num: any) {
    if (num < 1) {
      this.errorMessage = "Unzulässiger Kommunikationswunsch";
      this.removeErrorMessage();
      return;
    }
    this.talkMode = Number(num);
  }

  changeOfferedPrice(value: any) {
    //TODO changing the price
  }

  changeSeatCount(num: any) {
    if (num < 1) {
      this.errorMessage = "Dein Auto kann nicht weniger als einen Sitz haben";
      this.removeErrorMessage();
      return;
    }
    this.seats = Number(num);
  }

  saveOffer(form: NgForm) {
    this.router.navigate(['/summary'], { queryParams: { origin: 'offer' } })
  }

  removeErrorMessage(): void {
    setTimeout(() => {
      this.errorMessage = "";
    }, 5000);
  }

  protected readonly faPlus = faPlus;
  protected readonly faArrowRight = faArrowRight;
  protected readonly faSave = faSave;
  protected readonly faCircle = faCircle;
  protected readonly faCirclePlus = faCirclePlus;

  openStopDialog(): void {
    const dialogRef = this.dialog.open(DriveModalComponent, {
      width: '400px',
      data: { template: 'tripStop' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The weight dialog was closed. Result:', result);
    });
  }

  changePriceType(num: number) {
    if (num < 1) {
      this.errorMessage = "Dein Auto kann nicht weniger als einen Sitz haben";
      this.removeErrorMessage();
      return;
    }
    this.offeredPriceType = Number(num);
  }

  protected readonly faPenToSquare = faPenToSquare;
  protected readonly faX = faX;

  openTrailerDialog() {
    const dialogRef = this.dialog.open(DriveModalComponent, {
      width: '400px',
      data: { template: 'tripTrailer' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The weight dialog was closed. Result:', result);
    });
  }
}
