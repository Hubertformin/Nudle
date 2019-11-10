import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutConfigComponent } from './about-config.component';

describe('AboutComponent', () => {
  let component: AboutConfigComponent;
  let fixture: ComponentFixture<AboutConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
