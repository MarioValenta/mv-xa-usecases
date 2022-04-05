/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InputFormArrayService } from './input-form-array.service';

describe('Service: InputFormArrayTable', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputFormArrayService]
    });
  });

  it('should ...', inject([InputFormArrayService], (service: InputFormArrayService) => {
    expect(service).toBeTruthy();
  }));
});
