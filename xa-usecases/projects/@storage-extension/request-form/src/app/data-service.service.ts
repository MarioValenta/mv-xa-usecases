import { Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { map, tap, share } from 'rxjs/operators';
import { environment } from '../environments/environment';




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

    public GetStorageOfCI(hostid: string) {
        return this.xaservices.Http.Get<Array<any>>(`/api/rmdb/storage/${hostid}`);
    }

    public GetOSofCI(hostid: string) {
        return this.xaservices.Http.Get<any>(`/api/rmdb/os/${hostid}`);
    }

    public GetSearchAbleStatus() {
        return this.xaservices.Http.Get<Array<string>>('/api/search/status');
    }

    public GetCustomers() {
        return this.xaservices.Http.Get<Array<string>>(`/api/cmdb/customer`);
    }

    public GetEnvironments() {
        return this.xaservices.Http.Get<Array<any>>(`api/cmdb/environments`).pipe(
            share()
        );
    }

}
