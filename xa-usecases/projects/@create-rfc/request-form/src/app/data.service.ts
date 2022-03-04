import { Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { share } from 'rxjs/operators';
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

    public GetCustomers() {
        return this.xaservices.Http.Get<Array<string>>(`/api/cmdb/alpinecustomers`);
    }

    public GetAppDetailsFor(app: object) {
        return this.xaservices.Http.Get<any>(`api/cmdb/appselection?${Object.entries(app)
            .filter(element => element[1] != null ? true : false)
            .map(element => element[0] + '=' + element[1])
            .join('&')}`);
    }

    public GetAssignmentGroups(){
        return this.xaservices.Http.Get<Array<any>>(`/api/cmdb/alpineassignmentgroups`).pipe(
            share()
        );
    }


}
