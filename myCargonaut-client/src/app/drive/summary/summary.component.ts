import {Component, inject} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
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
    NgOptimizedImage,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent {
  templateToLoad: string = "";

  public sessionService: SessionService = inject(SessionService);
  public requestService: RequestService = inject(RequestService);


  isLoggedIn: boolean = false;

  private http: any;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.sessionService.checkLoginNum().then(isLoggedIn => {
      console.log('Login status:', isLoggedIn);
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      if (!this.isLoggedIn) {
        window.location.href = "/profile";
      }
    });

    console.log(this.requestService.date);

    this.route.queryParams.subscribe(params => {
      const origin = params['origin'];
      console.log('Origin:', origin); // Überprüfen, ob origin richtig gesetzt ist
      if (origin === 'createrequest') {
        this.templateToLoad = 'summaryRequest';
      } else if (origin === 'createoffer') {
        this.templateToLoad = 'summaryOffer';
      } else {
        this.templateToLoad = 'summaryRequest';
      }
      console.log('Template to load:', this.templateToLoad); // Überprüfen, welches Template geladen wird
    });
  }

  navigateBack(): void {
    if (this.templateToLoad === 'summaryOffer') {
      this.router.navigate(['/createoffer']);
    } else if (this.templateToLoad === 'summaryRequest') {
      this.router.navigate(['/createrequest']);
    }
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

  }

  protected readonly window = window;
}
