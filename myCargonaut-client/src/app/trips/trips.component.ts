import { Component, Input, OnInit } from '@angular/core';
import { DriveService } from '../services/drive.service';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../services/session.service';
import { TripsReadComponent } from './trips-read/trips-read.component';
import { TripsCreateComponent } from './trips-create/trips-create.component';
import { GetOffer } from './GetOffer';
import { GetRequest } from './GetRequest';
import { DateFormatPipe } from '../search/date-format.pipe';
import { NgIf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  standalone: true,
  imports: [
    TripsReadComponent,
    TripsCreateComponent,
    DateFormatPipe,
    NgOptimizedImage,
    NgIf,
  ],
  styleUrls: ['./trips.component.css'],
})
export class TripsComponent implements OnInit {

  @Input() pathToImageArray!: string[];

  driveId: number = 0;
  offer: GetOffer | undefined = undefined;
  request: GetRequest | undefined = undefined;
  rating: number = 0;

  showTripsRead: boolean = false;
  showTripsCreate: boolean = true;

  birthday: string = '';
  pathToImage: string = 'empty.png';
  profilePic: string = '';

  protected readonly window = window;

  constructor(
    private route: ActivatedRoute,
    private driveService: DriveService,
    private sessionService: SessionService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.driveId = params['id'];
      if (params ['type'] == "offer") {
        this.getOfferDetails(this.driveId);
      } else if (params ['type'] == "request") {
        this.getRequestDetails(this.driveId);
      }
    });
  }

  getOfferDetails(id: number): void {
    this.driveService.readOffer(id).subscribe({
      next: (data: GetOffer) => {
        this.offer = data;
        this.rating = this.offer.user.rating;
        console.log('Offer Details:', this.offer);
      },
      error: (error) => {
        console.error('Error fetching offer details:', error);
      },
    });
  }
  getRequestDetails(id: number): void {
    this.driveService.readRequest(id).subscribe({
      next: (data: GetRequest) => {
        this.request = data;
        this.rating = this.request.user.rating;
        console.log('Offer Details:', this.request);
        console.log( this.request.user.rating + "hurensohn")
      },
      error: (error) => {
        console.error('Error fetching offer details:', error);
      },
    });
  }
  starFillSrc: string = './assets/star-fill.svg';
  starEmptySrc: string = './assets/star.svg';
  stars: number[] = [1, 2, 3, 4, 5];

}
