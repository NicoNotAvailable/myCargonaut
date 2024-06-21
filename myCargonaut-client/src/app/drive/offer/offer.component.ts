import { Component, EventEmitter, inject, Input, Output, TemplateRef } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {NgbInputDatepicker, NgbModal} from "@ng-bootstrap/ng-bootstrap";
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

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
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

  carWeight:  number | null = null;
  carLength:  number | null = null;
  carWidth:  number | null = null;
  carHeight:  number | null = null;

  trailerWeight:  number | null = null;
  trailerLength:  number | null = null;
  trailerWidth:  number | null = null;
  trailerHeight:  number | null = null;

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

  constructor(private modalService: NgbModal) {}

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

  createSummaryOffer(form: NgForm) {
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

  openCarModal(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-car-title' }).result.then((result) => {
    }, (reason) => {
    });
  }

  openTrailerModal(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-trailer-title' }).result.then((result) => {
    }, (reason) => {
    });
  }

  openStopModal(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-stop-title' }).result.then((result) => {
    }, (reason) => {
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
  protected readonly faArrowLeft = faArrowLeft;
}
