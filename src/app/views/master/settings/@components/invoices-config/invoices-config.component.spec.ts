import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesConfigComponent } from './invoices-config.component';

describe('InvoicesComponent', () => {
  let component: InvoicesConfigComponent;
  let fixture: ComponentFixture<InvoicesConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicesConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
