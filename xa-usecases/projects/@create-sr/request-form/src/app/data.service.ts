import { Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { share } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { CustomerDto } from './dtos/CustomerDTO';


@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(private xaservices: XAServices) {
      if (!environment.production) {
        console.debug('ENV: NON PROD');
        this.xaservices = ((window as any).xa as XAServices);
      }
    }

    public getCustomers() {
        return this.xaservices.Http.Get<Array<CustomerDto>>(`/api/cmdb/alpinecustomers`).pipe(
          share()
      );
    }

    public getAppSupportedBy() {
        return this.xaservices.Http.Get<Array<any>>(`/api/cmdb/alpineassignmentgroups`).pipe(
          share()
      );
    }
}
