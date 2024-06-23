import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsReadComponent } from './trips-read.component';

describe('TripsReadComponent', () => {
  let component: TripsReadComponent;
  let fixture: ComponentFixture<TripsReadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripsReadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TripsReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
