import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookBookComponent } from './cook-book.component';

describe('CookBookComponent', () => {
  let component: CookBookComponent;
  let fixture: ComponentFixture<CookBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
