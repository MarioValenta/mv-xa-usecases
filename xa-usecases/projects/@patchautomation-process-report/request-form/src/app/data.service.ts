import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';


@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }

    public GetCustomers(customerscope: string) {
        return this.xaservices.Http!.Get<Array<any>>(`api/cmdb/alpinecustomers?customerscope=${customerscope}`);
    }
}
