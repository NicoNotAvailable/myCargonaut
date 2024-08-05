import {Component, inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CurrencyPipe, formatCurrency, NgClass, NgIf} from "@angular/common";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {SessionService} from "../services/session.service";
import {PaymentService} from "../services/payment.service";
import {LOCALE_ID} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';

// Registriere die Locale-Daten
registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    FaIconComponent,
    CurrencyPipe,
    NgClass
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'de-DE'}
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {

  public sessionService: SessionService = inject(SessionService);
  public paymentService: PaymentService = inject(PaymentService);

  isLoggedIn: boolean = true;
  errorMessage: string | null = null;
  textColor: string = "errorText";

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
  }

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

  validInputs() {
    if (this.paymentService.paymentMethod !== 1 && this.paymentService.paymentMethod !== 2) {
      this.errorMessage = "Du musst eine Zahlungsmethode auswählen";
      this.removeErrorMessage();
      return false;
    }
    return true;
  }

  finishPayment() {

    let paymentName = "";

    if (this.paymentService.paymentMethod == 1) {
      paymentName = "PayPal"
    } else if (this.paymentService.paymentMethod == 2) {
      paymentName = "SEPA"
    }

    this.textColor = "successText";
    this.textAnimationThreeDots("Das " + paymentName + "-Fenster wird geöffnet", 3, 0, 1000);
    this.changeTextAfterTime("Geben sie ihre Daten im " + paymentName + "-Fenster ein", 3000);
    this.textAnimationThreeDots("Ihre Zahlung wird verarbeitet", 3, 5000, 1000);
    this.changeTextAfterTime("Zahlung erfolgreich, danke für Ihre Buchung!", 9000);

    setTimeout(() => {
      this.paymentService.setDriveStatusPaid()
    }, 10000)
  }

  private updateCurrentRoute(): void {
    const route = this.router.url.split('/');

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

  private removeErrorMessage(): void {
    setTimeout(() => {
      this.errorMessage = "";
    }, 5000);
  }

  private changeTextAfterTime(message: string, waitingTime: number): void {
    setTimeout(() => {
      this.errorMessage = message;
    }, waitingTime);
  }

  private textAnimationThreeDots(message: string, cycles: number, waitingTime?: number, cycleTime?: number): void {
    cycleTime = cycleTime ?? 900 //If cycleTime is null, default cycleTime is 900
    setTimeout(() => {
      for (let i = 0; i < cycles; i++) {
        const waitingTime = i * cycleTime;
        this.changeTextAfterTime(message + ".", waitingTime);
        this.changeTextAfterTime(message + "..", waitingTime + (cycleTime / 3));
        this.changeTextAfterTime(message + "...", waitingTime + (cycleTime / 3) * 2);
      }
    }, waitingTime);
  }

  protected readonly faArrowRight = faArrowRight;
  protected readonly formatCurrency = formatCurrency;

}
