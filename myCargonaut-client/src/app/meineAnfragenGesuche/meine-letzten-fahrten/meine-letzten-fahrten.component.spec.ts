import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeineLetztenFahrtenComponent } from './meine-letzten-fahrten.component';

describe('MeineLetztenFahrteComponent', () => {
  let component: MeineLetztenFahrtenComponent;
  let fixture: ComponentFixture<MeineLetztenFahrtenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeineLetztenFahrtenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeineLetztenFahrtenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
