import { Component, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { SearchFilter } from '../../SearchFilter';
import { faCirclePlus, faSort } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [
    FormsModule,
    NgbDatepicker,
    FaIconComponent,
  ],
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent {
  currentRoute: string = '';
  topText: string = '';
  placeholderInput: string = '';

  filter: SearchFilter = {
    startLocation: '',
    endLocation: '',
    date: '',
    height:'',
    width: '',
    length: '',
    weight: '',
    seats: '',
    minRating: '',
    sort: '',
  }


  @Output() offerSearchTriggered = new EventEmitter<SearchFilter>();
  @Output() requestSearchTriggered = new EventEmitter<SearchFilter>();


  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateCurrentRoute();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateCurrentRoute();
    });
  }

  private updateCurrentRoute(): void {
    const route = this.router.url.split('/').pop();
    this.currentRoute = route ? route : '';
    if (this.currentRoute === 'searchRequest') {
      this.topText = 'Dein passendes Gesuch finden';
      this.placeholderInput = 'benötigte Plätze';
    } else if (this.currentRoute === 'searchOffer') {
      this.topText = 'Deine passende Fahrt finden';
      this.placeholderInput = 'verfügbare Plätze';
    }
  }

  onSearchButtonClick(): void {
    if (this.currentRoute === 'searchRequest') {
      this.requestSearchTriggered.emit(this.filter);
    } else if (this.currentRoute === 'searchOffer') {
      this.offerSearchTriggered.emit(this.filter);
    }
  }

  protected readonly faCirclePlus = faCirclePlus;
  protected readonly faSort = faSort;
}
