import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AktuelleFahrtenComponent } from './aktuelle-fahrten.component';

describe('AktuelleFahrtenComponent', () => {
  let component: AktuelleFahrtenComponent;
  let fixture: ComponentFixture<AktuelleFahrtenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AktuelleFahrtenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AktuelleFahrtenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
