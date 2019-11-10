import { TestBed } from '@angular/core/testing';

import { SaleDialogService } from './sale-dialog.service';

describe('SaleDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaleDialogService = TestBed.get(SaleDialogService);
    expect(service).toBeTruthy();
  });
});
