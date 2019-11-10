import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionConfigComponent } from './subscription-config.component';

describe('SubscriptionComponent', () => {
  let component: SubscriptionConfigComponent;
  let fixture: ComponentFixture<SubscriptionConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
