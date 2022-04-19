import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';

@Injectable({
  providedIn: 'root'
})
export class UseCasesBaseService {

  customOnInit?(): void;

  constructor(@Inject(XASERVICE_TOKEN) protected xaservices: XAServices) {
    this.customOnInit && this.customOnInit();
  }
}
