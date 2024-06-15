import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeineGesucheComponent } from './meine-gesuche.component';

describe('MeineGesucheComponent', () => {
  let component: MeineGesucheComponent;
  let fixture: ComponentFixture<MeineGesucheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeineGesucheComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeineGesucheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
