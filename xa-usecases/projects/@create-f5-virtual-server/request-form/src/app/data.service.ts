import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }

  public getCustomers() {
    return this.xaservices.Http!.Get<Array<string>>(`api/cmdb/customer`).pipe(
      share()
    );
  }

  public getWBSInstallations(customer: string) {
    return this.xaservices.Http!.Get<Array<string>>(`api/cmdb/wbs/${customer}`).pipe(
        share()
    );
}

  public getLANsByCustomer(customer: string) {
    return this.xaservices.Http!.Get<Array<any>>(`api/f5/lan/${customer}`).pipe(
      share()
    );
  }

  public getEnvironments() {
    return this.xaservices.Http!.Get<Array<any>>(`api/cmdb/environments`).pipe(
      share()
    );
  }
}
