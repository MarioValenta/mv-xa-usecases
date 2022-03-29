import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { share } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }

    public GetStorageOfCI(hostid: string) {
        return this.xaservices.Http!.Get<Array<any>>(`/api/rmdb/storage/${hostid}`);
    }

    public GetOSofCI(hostid: string) {
        return this.xaservices.Http!.Get<any>(`/api/rmdb/os/${hostid}`);
    }

    public GetSearchAbleStatus() {
        return this.xaservices.Http!.Get<Array<string>>('/api/search/status');
    }

    public GetCustomers() {
        return this.xaservices.Http!.Get<Array<string>>(`/api/cmdb/customer`);
    }

    public GetEnvironments() {
        return this.xaservices.Http!.Get<Array<any>>(`api/cmdb/environments`).pipe(
            share()
        );
    }

}
