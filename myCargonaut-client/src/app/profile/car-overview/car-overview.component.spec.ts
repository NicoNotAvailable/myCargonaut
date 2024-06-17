import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarOverviewComponent } from './car-overview.component';

describe('CarOverviewComponent', () => {
  let component: CarOverviewComponent;
  let fixture: ComponentFixture<CarOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
