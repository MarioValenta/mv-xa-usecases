import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }


    public GetAlpineCustomers(shortname:string) {
        return this.xaservices.Http!.Get<Array<string>>(`api/cmdb/alpinecustomers/${shortname}`);
    }

    public GetLocationsByCustomer(customer:string){
        return this.xaservices.Http!.Get<Array<any>>(`/api/cmdb/getesxclusterbycustomer?customer=${customer}`).pipe(
            map(data => data.map(d => ({
                ...d,
                label: d.entry
            })))
        );

    }
}
