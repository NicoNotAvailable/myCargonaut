import { Component, OnInit } from '@angular/core';
import {NgForOf, NgOptimizedImage} from "@angular/common";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trips-create',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf
  ],
  templateUrl: './trips-create.component.html',
  styleUrl: './trips-create.component.css'
})
export class TripsCreateComponent implements OnInit {
  offerBool: boolean = true;
  requestBool: boolean = false;

  constructor(
    private route: ActivatedRoute,

  ) {}

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
