import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyConfigComponent } from './privacy-config.component';

describe('PrivacyComponent', () => {
  let component: PrivacyConfigComponent;
  let fixture: ComponentFixture<PrivacyConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
