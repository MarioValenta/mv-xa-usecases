import { Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private xaservices: XAServices) {
    if (this.xaservices === undefined || this.xaservices === null) {
      this.xaservices = ((window as any).xa as XAServices);
    }
  }

  public GetCustomers() {
    return this.xaservices.Http.Get(environment.customerEndpointUrl);
  }

}
