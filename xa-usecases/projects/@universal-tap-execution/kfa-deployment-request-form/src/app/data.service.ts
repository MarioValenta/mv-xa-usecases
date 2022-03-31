import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) {}

  public getCatalogDbData(endpoint: string) {
    return this.xaservices.Http!.Get(endpoint);
  }

}
