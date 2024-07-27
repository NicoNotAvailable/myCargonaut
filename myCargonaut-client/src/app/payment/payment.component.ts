import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    FaIconComponent
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {

  isLoggedIn: boolean = true;

  validInputs() {
    //TODO: Add payment Client Logic
    return true; //For test reasons to see if the html/css is working
  }

  createSummaryOffer() {
    //TODO: Add payment Client Logic
  }

  protected readonly faArrowRight = faArrowRight;
}
