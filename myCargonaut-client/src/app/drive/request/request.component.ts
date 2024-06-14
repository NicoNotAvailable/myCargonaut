import { Component, EventEmitter, inject, Input, Output, TemplateRef } from "@angular/core";
import { SessionService } from "../../services/session.service";
import { NgClass, NgIf, NgOptimizedImage } from "@angular/common";
import { faCirclePlus, faDeleteLeft, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { FormsModule } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { NgbInputDatepicker } from "@ng-bootstrap/ng-bootstrap";
import { NgbActiveModal, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
//import { MatDialog } from '@angular/material/dialog';
import { DriveModalComponent } from '../drive-modal/drive-modal.component';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    FormsModule,
    FaIconComponent,
    NgbInputDatepicker,
    NgOptimizedImage
  ],
  templateUrl: './request.component.html',
  styleUrl: './request.component.css'
})
export class RequestComponent {
  public sessionService: SessionService = inject(SessionService);

  @Input() editingRequest!: number;
  @Output() changeAddCar = new EventEmitter<void>();

  requestedPrice: number | null = null;
  talkMode: number | null = null;

  //
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

  enableDeletion: boolean = false;
  isLoggedIn: boolean = false;
  private http: any;

  closeResult = '';

  constructor(private modalService: NgbModal, /*public dialog: MatDialog*/) {}

  /*openCargoDialog(): void {
    const dialogRef = this.dialog.open(DriveModalComponent, {
      width: '250px',
      data: { template: 'tripCargo' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The weight dialog was closed. Result:', result);
    });
  }
*/
  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === 'Cross click') {
      return 'by clicking on a cross';
    } else {
      return `with: ${reason}`;
    }
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

  changeTalkMode(num: any) {
    if (num < 1) {
      this.errorMessage = "Talk Mode ist doof";
      this.removeErrorMessage();
      return;
    }
    this.talkMode = Number(num);
  }

  saveRequest(form: any): void {
    /*if (this.editingRequest != 0) return;
    const carData = {
      name: this.model,
      weight: this.weight == null? 0 : this.weight,
      length: this.length == null ? 0 : this.length,
      height: this.height == null? 0 : this.height,
      width: this.width == null ? 0 : this.width,
      seats: this.seats == null ? 0 : this.seats,
      hasAC: this.hasAc,
      hasTelevision: this.hasTv
    };
    console.log(carData);

    this.http.post("http://localhost:8000/drive/request", carData, { withCredentials: true }).subscribe(
      response => {
        form.resetForm();
        this.changeAddCarState();
      },
      error => {
        console.error(error);
        this.errorMessage = error.error.message || "Bitte überprüfen Sie die eingabe";
        this.removeErrorMessage();
      }
    );*/
  }

  changeAddCarState(): void {
    this.changeAddCar.emit();
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

  removeErrorMessage(): void {
    setTimeout(() => {
      this.errorMessage = "";
    }, 5000);
  }

  changeSeatCount(num: any) {
    if (num < 1) {
      this.errorMessage = "Dein Auto kann nicht weniger als einen Sitz haben";
      this.removeErrorMessage();
      return;
    }
    this.seats = Number(num);
  }


  protected readonly faDeleteLeft = faDeleteLeft;
  protected readonly faSave = faSave;

  changeRequestedPrice(num: any) {
    //TODO changing the price
  }

  protected readonly faCirclePlus = faCirclePlus;
  protected readonly faPlus = faPlus;
  protected readonly window = window;
}
