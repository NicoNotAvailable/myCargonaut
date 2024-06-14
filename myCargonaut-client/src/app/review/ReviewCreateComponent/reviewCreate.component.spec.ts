import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewCreateComponent } from './reviewCreate.component';

describe('ReviewComponent', () => {
  let component: ReviewCreateComponent;
  let fixture: ComponentFixture<ReviewCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
