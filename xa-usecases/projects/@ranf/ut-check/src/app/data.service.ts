import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { share } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }

    // Service function to fetch data for Customer dropdown box
    public getCustomers(customer) {
        return this.xaservices.Http!.Get<Array<string>>(`api/cmdb/getdebitor/${customer}`).pipe(
            share()
        );
    }

    // Service function to fetch data for Settlement dropdown box
    public getSettlements() {
        return this.xaservices.Http!.Get<Array<string>>(`api/ranf/gettypeofsettlement`).pipe(
            share()
        );
    }

    // Service function to fetch data for Addresses dropdown box
    public getAddresses(customer) {
        return this.xaservices.Http!.Get<Array<string>>(`api/ranf/getaddress/${customer}`).pipe(
            share()
        );
    }

    // Service function to fetch data for Accounts number dropdown box
    public getAccountsNumbers(customer) {
        return this.xaservices.Http!.Get<Array<string>>(`api/ranf/accountnumbers/${customer}`).pipe(
            share()
        );
    }

}
