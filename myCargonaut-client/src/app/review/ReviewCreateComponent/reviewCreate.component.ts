import { Component, inject } from '@angular/core';
import { faSave, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TripService } from '../../services/trip-service.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SessionService } from '../../services/session.service';



@Component({
  selector: 'app-reviewCreate',
  standalone: true,
  imports: [
    FaIconComponent,
    NgForOf,
    FormsModule,
    NgIf,

    RouterLink,
  ],
  templateUrl: './reviewCreate.component.html',
  styleUrl: './reviewCreate.component.css'
})


export class ReviewCreateComponent {
  public sessionService: SessionService = inject(SessionService);


  constructor(private http: HttpClient,    private tripService: TripService,
             private router: Router) {}

  currentUserID: number = 0
  isloggedIn: boolean = false;

  ngOnInit(): void {
    this.sessionService.checkLoginNum().then(currentUser => {
      if (currentUser != -1) {
        this.isloggedIn = true;
        this.currentUserID = currentUser;
        this.getAllTrips(); // Move getAllTrips() here
      } else {
        this.isloggedIn = false;
      }
    });

    // Subscribe to the trip ID from the service
    this.tripService.currentTripId.subscribe(id => {
      this.tripId = id;
      console.log(this.tripId + "hallo?");  // Will log the trip ID whenever it changes
    });
    this.getAllTrips()



  }



  protected readonly faSave = faSave;

  faStar = faStar;  // Filled star icon
  faStarRegular = faStarRegular;  // Empty star icon


  message: string = ""
  tripId: number | null = null;
  text: string | undefined
  averageFilledStars: number | undefined
  isUserInvolved: boolean = false;


  starsFilledOne: boolean[] = [false, false, false, false, false];
  starsFilledTwo: boolean[] = [false, false, false, false, false];
  starsFilledThree: boolean[] = [false, false, false, false, false];
  starsFilledFour: boolean[] = [false, false, false, false, false];

  averageStarsFilled: boolean[] = [false, false, false, false, false];

  /**
   * Creates a new review by sending a POST request to the server with review data,
   * then handles the server response and any errors.
   */
  createReview(){
    console.log("createReview");
    console.log(this.tripId);


    const reviewData = {
      tripId: this.tripId,
      rating: this.averageFilledStars,
      text: this.text,
    };

    this.http.post("http://localhost:8000/review",reviewData, { withCredentials: true })
      .subscribe(
        response => {
          console.log('Review added successfully', response);
          this.router.navigate(['/myOffer']);

        },
        error => {

          console.error('There was an error!', error);
          this.message = error.error.message || "Bitte überprüfen Sie die Eingabe";
          setTimeout(() => {
            this.message = '';
          }, 5000);
        }
      );

  }


  /**
   * Handles star clicks and updates the star rating for punctuality.
   * Fills stars in starsFilledOne array up to the clicked index.
   * Updates the punctuality rating based on the clicked index.
   * Updates the average star ratings across all categories.
   *
   * @param index The index of the star clicked (0-based).
   */
  handleStarClickQOne(index: number) {
    this.updateStars(this.starsFilledOne, index); // Update stars for punctuality
    this.updateAverageStars(); // Update average star ratings
  }

  /**
   * Handles star clicks and updates the star rating for reliability.
   * Fills stars in starsFilledTwo array up to the clicked index.
   * Updates the reliability rating based on the clicked index.
   * Updates the average star ratings across all categories.
   *
   * @param index The index of the star clicked (0-based).
   */
  handleStarClickQTwo(index: number) {
    this.updateStars(this.starsFilledTwo, index); // Update stars for reliability
    this.updateAverageStars(); // Update average star ratings
  }

  /**
   * Handles star clicks and updates the star rating for comfort.
   * Fills stars in starsFilledThree array up to the clicked index.
   * Updates the comfort rating based on the clicked index.
   * Updates the average star ratings across all categories.
   *
   * @param index The index of the star clicked (0-based).
   */
  handleStarClickQThree(index: number) {
    this.updateStars(this.starsFilledThree, index); // Update stars for comfort
    this.updateAverageStars(); // Update average star ratings
  }

  /**
   * Handles star clicks and updates the star rating for damage.
   * Fills stars in starsFilledFour array up to the clicked index.
   * Updates the damage rating based on the clicked index.
   * Updates the average star ratings across all categories.
   *
   * @param index The index of the star clicked (0-based).
   */
  handleStarClickQFour(index: number) {
    this.updateStars(this.starsFilledFour, index); // Update stars for damage
    this.updateAverageStars(); // Update average star ratings
  }


  /**
   * Helper method to update the star states in a star array up to the given index.
   * Sets stars in the array to true up to the specified index (inclusive),
   * and sets stars beyond that index to false.
   *
   * @param starsArray The array representing the star states (true for filled, false for empty).
   * @param index The index up to which stars should be filled (0-based).
   */
  updateStars(starsArray: boolean[], index: number) {
    for (let i = 0; i <= index; i++) {
      starsArray[i] = true;
    }
    for (let i = index + 1; i < starsArray.length; i++) {
      starsArray[i] = false;
    }
  }

  /**
   * Method to update the average filled stars across all star arrays.
   * Calculates the total number of filled stars from all star arrays,
   * computes the average number of filled stars, and updates the
   * averageStarsFilled array accordingly.
   */
  updateAverageStars() {
    // Array of all star arrays
    const allStarsArrays = [
      this.starsFilledOne,
      this.starsFilledTwo,
      this.starsFilledThree,
      this.starsFilledFour
    ];

    // Total number of stars across all categories
    const totalStars = allStarsArrays.length * this.starsFilledOne.length;

    // Count of filled stars across all arrays
    let filledStarsCount = 0;
    allStarsArrays.forEach(starsArray => {
      starsArray.forEach(star => {
        if (star) filledStarsCount++;
      });
    });

    // Calculate the average number of filled stars
    this.averageFilledStars = Math.round(filledStarsCount / allStarsArrays.length);

    // Update averageStarsFilled array based on the average filled stars
    for (let i = 0; i < this.averageStarsFilled.length; i++) {
      this.averageStarsFilled[i] = i < this.averageFilledStars;
    }
  }


  offerTrips: any[] = [];
  offerDriveTrips: any[] = [];
  requestTrips: any[] = [];
  requestDriveTrips: any[] = [];



  getAllTrips() {
    console.log("Fetching trips...");
    this.http.get<any>('http://localhost:8000/trip/user-trips/' + this.currentUserID, { withCredentials: true }).subscribe(
      (response) => {
        console.log('Response:', response);

        // Assign fetched trips to class properties
        this.offerTrips = response.offerTrips || [];
        console.log(this.offerTrips.length + "hallo " );
        console.log(this.offerTrips );
        this.offerDriveTrips = response.offerDriveTrips || [];
        this.requestTrips = response.requestTrips || [];
        this.requestDriveTrips = response.requestDriveTrips || [];

        this.checkUserInvolvementInOfferTrips()
        this.checkUserInvolvementInRequestTrips()
        this.checkUserInvolvementInOfferDriveTrips()
        this.checkUserInvolvementInRequestDriveTrips()

      },
      error => {
        console.error('Error fetching trips:', error);
      }
    );
  }



  // Method to check user involvement in offer trips
  checkUserInvolvementInOfferTrips(): boolean {

    for (let i = 0; i < this.offerTrips.length; i++) {
      const trip = this.offerTrips[i];

      if (trip.id === this.tripId && trip.requesting && trip.requesting.id === this.currentUserID) {
        this.isUserInvolved = true;
        console.log('OfferTrips:', this.isUserInvolved);

      }
    }

    console.log('OfferTrips:', this.isUserInvolved);
    return this.isUserInvolved;
  }

  // Method to check user involvement in request trips
  checkUserInvolvementInRequestTrips(): boolean {

    // Iterate through requestTrips

    for (let i = 0; i < this.requestTrips.length; i++) {
      const trip = this.requestTrips[i];

      if (trip.id === this.tripId && trip.requesting && trip.requesting.id === this.currentUserID) {
        this.isUserInvolved = true;
        console.log('ReqeustTrips', this.isUserInvolved);

      }
    }

    console.log('ReqeustTrips', this.isUserInvolved);

    return this.isUserInvolved;
  }

  // Method to check user involvement in offer drive trips
  checkUserInvolvementInOfferDriveTrips(): boolean {

    // Iterate through offerDriveTrips

    for (let i = 0; i < this.offerDriveTrips.length; i++) {
      const trip = this.offerDriveTrips[i];

      if (trip.id === this.tripId && trip.requesting && trip.requesting.id === this.currentUserID) {
        this.isUserInvolved = true;
        console.log('offerDriveTrips:', this.isUserInvolved);
      }
    }


    console.log('offerDriveTrips:', this.isUserInvolved);
    return this.isUserInvolved;
  }

  // Method to check user involvement in request drive trips
  checkUserInvolvementInRequestDriveTrips(): boolean {

    // Iterate through requestDriveTrips
    for (let i = 0; i < this.requestDriveTrips.length; i++) {
      const trip = this.requestDriveTrips[i];

      if (trip.id === this.tripId && trip.requesting && trip.requesting.id === this.currentUserID) {
        this.isUserInvolved = true;
        console.log('requestDriveTrips:', this.isUserInvolved);
      }
    }


    console.log('requestDriveTrips:', this.isUserInvolved);
    return this.isUserInvolved;
  }


}
