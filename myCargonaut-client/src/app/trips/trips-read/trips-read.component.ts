import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";

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
export class TripsReadComponent implements OnInit {
  offerBool: boolean = true;
  requestBool: boolean = false;

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params ['type'] == "offer") {
        this.offerBool = true;
      } else if (params ['type'] == "request") {
        this.requestBool = true
        this.offerBool = false;
      }
    });
  }
}
