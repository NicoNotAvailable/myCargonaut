import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopAuswahlComponent } from './top-auswahl.component';

describe('TopAuswahlComponent', () => {
  let component: TopAuswahlComponent;
  let fixture: ComponentFixture<TopAuswahlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopAuswahlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopAuswahlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
