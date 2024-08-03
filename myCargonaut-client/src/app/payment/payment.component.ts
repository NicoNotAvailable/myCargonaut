import {Component, inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CurrencyPipe, formatCurrency, NgIf} from "@angular/common";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {SessionService} from "../services/session.service";
import {PaymentService} from "../services/payment.service";

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    FaIconComponent,
    CurrencyPipe
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {

  isLoggedIn: boolean = true;

  public sessionService: SessionService = inject(SessionService);
  public paymentService: PaymentService = inject(PaymentService);

  constructor(private route: ActivatedRoute, private http: HttpClient,  private router: Router) { }

  ngOnInit() {

    this.sessionService.checkLoginNum().then(isLoggedIn => {
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      if (!this.isLoggedIn && typeof window !== undefined) {
        this.router.navigate(['login'])
        return;
      }
      this.updateCurrentRoute()

    });

    this.paymentService.id = Number(this.route.snapshot.paramMap.get('id'));    // Jetzt kannst du mit der ID arbeiten
  }

  private updateCurrentRoute(): void {
    const route = this.router.url.split('/');
    console.log(route)

    if (route.length > 1 && route[1]) {
      this.paymentService.currentRoute = route[1];
    } else {
      this.paymentService.currentRoute = '';
    }

    if (this.paymentService.currentRoute === "offer") {
      this.paymentService.loadOfferPayment()
    } else if (this.paymentService.currentRoute === "request") {
      this.paymentService.loadRequestPayment()
    }
  }

  validInputs() {
    //TODO: Add payment Client Logic
    return true; //For test reasons to see if the html/css is working
  }

  createSummaryOffer() {
    //TODO: Add payment Client Logic
  }

  protected readonly faArrowRight = faArrowRight;
  protected readonly formatCurrency = formatCurrency;
}
