import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAufAnfrageOSucheComponent } from './request-auf-anfrage-osuche.component';

describe('RequestAufAnfrageOSucheComponent', () => {
  let component: RequestAufAnfrageOSucheComponent;
  let fixture: ComponentFixture<RequestAufAnfrageOSucheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestAufAnfrageOSucheComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestAufAnfrageOSucheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
