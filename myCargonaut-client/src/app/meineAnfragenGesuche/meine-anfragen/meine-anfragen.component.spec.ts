import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeineAnfragenComponent } from './meine-anfragen.component';

describe('MeineAnfragenComponent', () => {
  let component: MeineAnfragenComponent;
  let fixture: ComponentFixture<MeineAnfragenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeineAnfragenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeineAnfragenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
