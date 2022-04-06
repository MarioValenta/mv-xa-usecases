import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { map, share } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }

    public GetEnvironments() {
        return this.xaservices.Http!.Get<Array<any>>(`api/cmdb/environments`).pipe(
            share()
        );
    }

    public GetCIRelations(hostid: string) {
        return this.xaservices.Http!.Get<any>(`/api/cmdb/getcirelations/HOST/${hostid}`).pipe(map(data => data));
    }


    public GetCustomers() {
        return this.xaservices.Http!.Get<Array<string>>(`/api/cmdb/customer`);
    }
}
