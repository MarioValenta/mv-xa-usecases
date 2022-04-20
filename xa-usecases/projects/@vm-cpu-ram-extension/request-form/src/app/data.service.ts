import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { share } from 'rxjs/operators';


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
        return this.xaservices.Http!.Get<any>(`/api/cmdb/getcirelations/HOST/${hostid}`).pipe(share());
    }

    public GetCapacity(cluster: string){
        return this.xaservices.Http!.Get<any>(`api/catdb/capacity/${cluster}`).pipe(share());
    }

    public GetProperties(hostid){
        return this.xaservices.Http!.Get<any>(`api/vmcpuramextension/properties/${hostid}`).pipe(share());
    }

    public GetCustomers() {
        return this.xaservices.Http!.Get<Array<string>>(`/api/cmdb/customer`);
    }

    public GetCustomerSM9Name(shortname : string) {
        return this.xaservices.Http!.Get<Array<string>>(`/api/cmdb/customer/${shortname}`);
    }
}
