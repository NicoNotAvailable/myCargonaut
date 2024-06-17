import {Component, EventEmitter, inject, Input, Output, TemplateRef, ViewEncapsulation} from "@angular/core";
import {SessionService} from "../../services/session.service";
import {NgClass, NgIf, NgOptimizedImage} from "@angular/common";
import {faCirclePlus, faDeleteLeft, faPlus, faSave} from "@fortawesome/free-solid-svg-icons";
import {FormsModule, NgForm} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {NgbActiveModal, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DriveModalComponent} from '../drive-modal/drive-modal.component';

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
    './request.component.css',
    '../../../../node_modules/@angular/material/prebuilt-themes/indigo-pink.css'
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

  errorMessage: string = "";

  isLoggedIn: boolean = false;
  private http: any;
  private router: any;

  constructor(private modalService: NgbModal, public dialog: MatDialog) {
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

  openCargoDialog(): void {
    const dialogRef = this.dialog.open(DriveModalComponent, {
      width: '400px',
      data: {template: 'tripCargo'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The weight dialog was closed. Result:', result);
    });
  }

  /*open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }*/

  private getDismissReason(reason: any): string {
    if (reason === 'Cross click') {
      return 'by clicking on a cross';
    } else {
      return `with: ${reason}`;
    }
  }

  changeTalkMode(num: any) {
    if (num < 1) {
      this.errorMessage = "Unzulässiger Kommunikationswunsch";
      this.removeErrorMessage();
      return;
    }
    this.talkMode = Number(num);
  }

  saveRequest(form: any): void {
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
}
