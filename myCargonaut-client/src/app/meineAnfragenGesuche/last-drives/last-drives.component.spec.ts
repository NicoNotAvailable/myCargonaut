import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastDrivesComponent } from './last-drives.component';

describe('LastDrivesComponent', () => {
  let component: LastDrivesComponent;
  let fixture: ComponentFixture<LastDrivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastDrivesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LastDrivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
