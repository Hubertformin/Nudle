import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsConfigComponent } from './reports-config.component';

describe('ReportsComponent', () => {
  let component: ReportsConfigComponent;
  let fixture: ComponentFixture<ReportsConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
