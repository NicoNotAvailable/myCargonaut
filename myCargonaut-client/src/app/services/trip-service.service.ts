// trip.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private tripIdSource = new BehaviorSubject<number | null>(null);
  currentTripId = this.tripIdSource.asObservable();

  changeTripId(id: number) {
    this.tripIdSource.next(id);
  }
}
