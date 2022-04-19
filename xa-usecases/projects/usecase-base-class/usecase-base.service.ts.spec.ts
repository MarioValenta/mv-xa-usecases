import { TestBed } from '@angular/core/testing';

import { UseCasesBaseService } from './usecase-base.service';

describe('BaseUsecaseService', () => {
  let service: UseCasesBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UseCasesBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
