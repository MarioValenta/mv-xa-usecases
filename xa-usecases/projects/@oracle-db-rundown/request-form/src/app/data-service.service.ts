import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { map, share } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }

    public getEnvironments() {
        return this.xaservices.Http!.Get<Array<any>>(`api/cmdb/environments`).pipe(
            share()
        );
    }

    public getServiceRelations(serviceId: string) {
        return this.xaservices.Http!.Get<any>(`api/cmdb/getcirelations/SERVICE/${serviceId}`).pipe(map(data => data));
    }

    public getCustomers() {
        return this.xaservices.Http!.Get<Array<string>>(`/api/cmdb/customer`);
    }
}
