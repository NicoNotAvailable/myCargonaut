import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrailerComponent } from './add-trailer.component';

describe('AddTrailerComponent', () => {
  let component: AddTrailerComponent;
  let fixture: ComponentFixture<AddTrailerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTrailerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTrailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
