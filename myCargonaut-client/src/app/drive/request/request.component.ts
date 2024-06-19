import {Component, EventEmitter, inject, Input, Output, TemplateRef, ViewEncapsulation} from "@angular/core";
import {SessionService} from "../../services/session.service";
import {NgClass, NgIf, NgOptimizedImage} from "@angular/common";
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
import {NgbActiveModal, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

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
  ],
  templateUrl: './request.component.html',
  styleUrls: [
    './request.component.css'
  ]
})
export class RequestComponent {
  public sessionService: SessionService = inject(SessionService);

  @Input() editingRequest!: number;
  @Output() changeAddCar = new EventEmitter<void>();

  requestedPrice: number | null = null;
  talkMode: number | null = null;

  seats: number | null = null;

  //Cargo
  cargoDescription: string | null = null;
  cargoLength: number | null = null;
  cargoWidth: number | null = null;
  cargoHeight: number | null = null;
  cargoWeight: number | null = null;

  name: string = "";
  date: string = "";
  time: string = "";

  startLand: string = "";
  startPLZ: string = "";
  startPlace: string = "";

  endLand: string = "";
  endPLZ: string = "";
  endPlace: string = "";

  errorMessage: string = "";

  isLoggedIn: boolean = false;
  private http: any;
  private router: any;

  constructor(private modalService: NgbModal) {
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
    this.editingRequest = 0;
    this.talkMode = 3;
  }

  openCargoModal(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
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

  createSummaryRequest(form: any): void {
    this.router.navigate(['/summary'], {queryParams: {origin: 'request'}})
  }

  changeAddCarState(): void {
    this.changeAddCar.emit();
  }

  changeRequestedPrice(num: any) {
    //TODO changing the price
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
    this.seats = Number(num);
  }

  removeErrorMessage(): void {
    setTimeout(() => {
      this.errorMessage = "";
    }, 5000);
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
}
