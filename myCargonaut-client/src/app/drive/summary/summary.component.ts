import {Component, inject} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import {ActivatedRoute} from "@angular/router";
import {SessionService} from "../../services/session.service";
import { faArrowLeft, faSave, faStar } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { RequestService } from '../../../drive/request.service';


@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    FaIconComponent,
    NgForOf,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent {
  templateToLoad: string = "summaryRequest";

  public sessionService: SessionService = inject(SessionService);
  public requestService: RequestService = inject(RequestService);


  isLoggedIn: boolean = false;

  private http: any;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sessionService.checkLoginNum().then(isLoggedIn => {
      console.log('Login status:', isLoggedIn);
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      if (!this.isLoggedIn) {
        window.location.href = "/profile";
      }
    });

    this.route.queryParams.subscribe(params => {
      const origin = params['origin'];
      if (origin === 'createrequest') {
        this.templateToLoad = 'summaryRequest';
      } else if (origin === 'createoffer') {
        this.templateToLoad = 'summaryOffer';
      }
    });
  }

  get cargoDataArray() {
    return this.requestService.getCargos();
  }

  saveOffer(form: NgForm) {

  }

  saveRequest(form: NgForm) {

  }

  protected readonly faSave = faSave;
  protected readonly faStar = faStar;

  protected readonly faStarRegular = faStarRegular;
  protected readonly faArrowLeft = faArrowLeft;

  createOffer() {

  }

  createRequest() {

    //const requestData = {
    //  email: this.email,
    //  password: this.password,
    //};

    /*this.http.post("http://localhost:8000/drive/request", userData, { withCredentials: true }).subscribe(
      response =>{
        form.resetForm();
        console.log(response);
        this.textColor = "successText"
        this.message = "Anmeldung lief swaggy";
        window.location.href = "/profile";
        setTimeout(() => {
          this.message = "";
          this.textColor = "errorText"
        }, 5000);
      },
      error => {
        console.error(error);
        this.message = error.error.message || "Passwort oder Email stimmt nicht überein";
        setTimeout(()=> {
          this.message = "";
        }, 5000);
      }
    );*/
  }
}
