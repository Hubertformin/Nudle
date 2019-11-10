import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartUpConfigComponent } from './start-up-config.component';

describe('StartUpComponent', () => {
  let component: StartUpConfigComponent;
  let fixture: ComponentFixture<StartUpConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartUpConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartUpConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
