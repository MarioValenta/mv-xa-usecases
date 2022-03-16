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

  public getCustomers() {
    return this.xaservices.Http.Get<Array<string>>(`api/cmdb/customer`).pipe(
      share()
    );
  }

  public getWBSInstallations(customer: string) {
    return this.xaservices.Http.Get<Array<string>>(`api/cmdb/wbs/${customer}`).pipe(
        share()
    );
}

  public getLANsByCustomer(customer: string) {
    return this.xaservices.Http.Get<Array<any>>(`api/f5/lan/${customer}`).pipe(
      share()
    );
  }

  public getEnvironments() {
    return this.xaservices.Http.Get<Array<any>>(`api/cmdb/environments`).pipe(
      share()
    );
  }
}
