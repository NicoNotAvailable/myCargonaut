import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMainGesuchtComponent } from './search-main-gesucht.component';

describe('SearchMainGesuchtComponent', () => {
  let component: SearchMainGesuchtComponent;
  let fixture: ComponentFixture<SearchMainGesuchtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchMainGesuchtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchMainGesuchtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
