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
        return this.xaservices.Http!.Get<Array<string>>(`/api/cmdb/alpinecustomers`);
    }

    public GetAppDetailsFor(app: object) {
        return this.xaservices.Http!.Get<any>(`api/cmdb/appselection?${Object.entries(app)
            .filter(element => element[1] != null ? true : false)
            .map(element => element[0] + '=' + element[1])
            .join('&')}`);
    }

    public GetAssignmentGroups(){
        return this.xaservices.Http!.Get<Array<any>>(`/api/cmdb/alpineassignmentgroups`).pipe(
            share()
        );
    }


}
