import { Component, computed, inject, signal } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { TripsCreateComponent } from './trips-create/trips-create.component';
import { TripsReadComponent } from './trips-read/trips-read.component';
import { DateUtils } from '../../../../utils/DateUtils';
import { DriveService } from '../services/drive.service';
import { SessionService } from '../services/session.service';


@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [
    NgForOf,
    TripsCreateComponent,
    TripsReadComponent,
    NgIf,
  ],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})
export class TripsComponent {
  public driveService: DriveService = inject(DriveService);
  public sessionService: SessionService = inject(SessionService);

  showTripsRead: boolean = false;
  showTripsCreate: boolean = true;

  starFillSrc: string = './assets/star-fill.svg';
  starEmptySrc: string = './assets/star.svg';

  bewertungsDummy : number = 4;
  stars: number[] = [1, 2, 3, 4, 5];

  birthday: string = "";
  pathToImage: string = "empty.png";
  profilePic: string = "";

  protected readonly window = window;
}
