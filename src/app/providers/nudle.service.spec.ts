import { TestBed } from '@angular/core/testing';

import { NudleService } from './nudle.service';

describe('NudleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NudleService = TestBed.get(NudleService);
    expect(service).toBeTruthy();
  });
});
