import { Component } from '@angular/core';
import { AktuelleFahrtenComponent } from "../frontpage/aktuelle-fahrten/aktuelle-fahrten.component";
import { OfferDetailsComponent } from "./offer-details/offer-details.component";
import { RequestDetailsComponent } from "./request-details/request-details.component";
import { NgIf } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-detailpage',
  standalone: true,
  imports: [
    AktuelleFahrtenComponent,
    OfferDetailsComponent,
    RequestDetailsComponent,
    NgIf
  ],
  templateUrl: './detailpage.component.html',
  styleUrl: './detailpage.component.css'
})
export class DetailpageComponent {
  isOffer: boolean = false;
  isRequest: boolean = false;
  offerID: number = 0;
  requestID: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.checkUrl();
  }

  checkUrl(): void {
    const url: string = this.router.url;
    if (url.includes('request')){
      this.isRequest = true;
      this.isOffer = false;
      this.requestID = Number(this.route.snapshot.paramMap.get('id'));
    } else if (url.includes('offer')){
      this.isOffer = true;
      this.isRequest = false;
      this.offerID = Number(this.route.snapshot.paramMap.get('id'));
    }
  }

  sendToOverview(): void {
    if (this.isOffer && !this.isRequest){
      window.location.href =  "/searchOffer";
    } else if (!this.isOffer && this.isRequest){
      window.location.href = "/searchRequest";
    }
  }

}
