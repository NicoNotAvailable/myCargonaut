import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-trips-read',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './trips-read.component.html',
  styleUrl: './trips-read.component.css'
})
export class TripsReadComponent {

}
