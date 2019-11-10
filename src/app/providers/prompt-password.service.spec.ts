import { TestBed } from '@angular/core/testing';

import { PromptPasswordService } from './prompt-password.service';

describe('PromptPasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PromptPasswordService = TestBed.get(PromptPasswordService);
    expect(service).toBeTruthy();
  });
});
