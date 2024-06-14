import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveModalComponent } from './drive-modal.component';

describe('DriveModalComponent', () => {
  let component: DriveModalComponent;
  let fixture: ComponentFixture<DriveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriveModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DriveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
