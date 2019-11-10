import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteEventsComponent } from './waste-events.component';

describe('WasteEventsComponent', () => {
  let component: WasteEventsComponent;
  let fixture: ComponentFixture<WasteEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WasteEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WasteEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
