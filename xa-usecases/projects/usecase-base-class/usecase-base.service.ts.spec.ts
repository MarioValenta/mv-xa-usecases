import { TestBed } from '@angular/core/testing';

import { UseCaseBaseService } from './usecase-base.service';

describe('BaseUsecaseService', () => {
  let service: UseCaseBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UseCaseBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
