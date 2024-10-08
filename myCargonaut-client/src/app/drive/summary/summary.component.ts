import {Component, inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CurrencyPipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import { faArrowLeft, faSave, faStar } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { RequestService } from '../../services/drive/request.service';
import { OfferService } from '../../services/drive/offer.service';

import {LOCALE_ID} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';


@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    FaIconComponent,
    NgForOf,
    NgOptimizedImage,
    CurrencyPipe,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent {
  templateToLoad: string = "";

  public sessionService: SessionService = inject(SessionService);
  public requestService: RequestService = inject(RequestService);
  public offerService: OfferService = inject(OfferService);


  isLoggedIn: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.sessionService.checkLoginNum().then(isLoggedIn => {
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
      } else {
        this.templateToLoad = 'summaryRequest';
      }
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
    return this.requestService.getCargos;
  }

  protected readonly faSave = faSave;
  protected readonly faStar = faStar;
  protected readonly faStarRegular = faStarRegular;
  protected readonly faArrowLeft = faArrowLeft;

  protected readonly window = window;
}
