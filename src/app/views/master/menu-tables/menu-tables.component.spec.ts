import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuTablesComponent } from './menu-tables.component';

describe('MenuTablesComponent', () => {
  let component: MenuTablesComponent;
  let fixture: ComponentFixture<MenuTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuTablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
