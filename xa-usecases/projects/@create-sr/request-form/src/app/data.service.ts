import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { share } from 'rxjs/operators';
import { CustomerDto } from './dtos/CustomerDTO';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }

    public getCustomers() {
        return this.xaservices.Http!.Get<Array<CustomerDto>>(`/api/cmdb/alpinecustomers`).pipe(
          share()
      );
    }

    public getAppSupportedBy() {
        return this.xaservices.Http!.Get<Array<any>>(`/api/cmdb/alpineassignmentgroups`).pipe(
          share()
      );
    }
}
