import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPassangerCreateComponent } from './review-passanger-create.component';

describe('ReviewPassangerCreateComponent', () => {
  let component: ReviewPassangerCreateComponent;
  let fixture: ComponentFixture<ReviewPassangerCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewPassangerCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewPassangerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
