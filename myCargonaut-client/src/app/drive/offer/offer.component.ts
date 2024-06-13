import { Component } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.css'
})
export class OfferComponent {

}
