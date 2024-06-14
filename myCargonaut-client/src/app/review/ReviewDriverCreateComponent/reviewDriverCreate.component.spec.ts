import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDriverCreateComponent } from './reviewDriverCreate.component';

describe('ReviewComponent', () => {
  let component: ReviewDriverCreateComponent;
  let fixture: ComponentFixture<ReviewDriverCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewDriverCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewDriverCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
