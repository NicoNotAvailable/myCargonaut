import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerOverviewComponent } from './trailer-overview.component';

describe('TrailerOverviewComponent', () => {
  let component: TrailerOverviewComponent;
  let fixture: ComponentFixture<TrailerOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrailerOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrailerOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
