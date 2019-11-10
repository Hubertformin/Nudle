import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemsReportsComponent } from './menu-items-reports.component';

describe('MenuItemsReportsComponent', () => {
  let component: MenuItemsReportsComponent;
  let fixture: ComponentFixture<MenuItemsReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuItemsReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuItemsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
