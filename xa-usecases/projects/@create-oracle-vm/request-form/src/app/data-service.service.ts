import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { share } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }

    public GetCustomers() {
        return this.xaservices.Http!.Get<Array<string>>(`/api/cmdb/customer`).pipe(
            share()
        );
    }

    public GetEnvironments() {
        return this.xaservices.Http!.Get<Array<any>>(`/api/oracle/environments`).pipe(
            share()
        );
    }

    public GetDBVersions() {
        return this.xaservices.Http!.Get<Array<any>>(`/api/oracle/dbversions`).pipe(
            share()
        );
    }

    public GetServiceTimeDetails(selectedSupportTime: any) {
        return this.xaservices.Http!.Get<Array<any>>(`/api/oracle/servicetimedetails/${selectedSupportTime}`).pipe(
            share()
        );
    }

    public GetCustomerLANsFor(customer: string) {
        return this.xaservices.Http!.Get<Array<any>>(`/api/cmdb/lan/${customer}/1`).pipe(
            share()
        );
    }

    public GetAdminLANsFor(customer: string) {
        return this.xaservices.Http!.Get<Array<any>>(`/api/cmdb/lan/${customer}/2`).pipe(
            share()
        );
    }

    public GetTsmLANsFor(customer: string) {
        return this.xaservices.Http!.Get<Array<any>>(`/api/cmdb/lan/${customer}/3`).pipe(
            share()
        );
    }

    public GetStorageLANsFor(customer: string) {
        return this.xaservices.Http!.Get<Array<any>>(`/api/cmdb/lan/${customer}/4`).pipe(
            share()
        );
    }
}
