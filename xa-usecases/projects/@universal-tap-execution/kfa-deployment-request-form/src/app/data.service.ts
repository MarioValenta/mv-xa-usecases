import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(@Inject('xaservices') private xaservices: XAServices) {}

  public getCatalogDbData(endpoint: string) {
    return this.xaservices.Http!.Get('api/cmdb/customer');
  }

}
