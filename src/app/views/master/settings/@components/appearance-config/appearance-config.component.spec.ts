import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppearanceConfigComponent } from './appearance-config.component';

describe('AppearanceComponent', () => {
  let component: AppearanceConfigComponent;
  let fixture: ComponentFixture<AppearanceConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppearanceConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppearanceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
