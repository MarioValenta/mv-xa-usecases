import { Injectable } from '@angular/core';
import { share } from 'rxjs/operators';
import { XAServices } from '@xa/lib-ui-common';

@Injectable({
  providedIn: 'root'
})
export class CiTableDataService {

  constructor(private xaservices: XAServices) {
    if (this.xaservices === undefined || this.xaservices === null) {
      this.xaservices = ((window as any).xa as XAServices);
    }
  }

  public EnrichRows(hosts: Array<any>) {
    return this.xaservices.Http.Get<Array<string>>(`api/f5/pooldata/`, { params: { "hosts": JSON.stringify(hosts) } }).pipe(
      share()
    );
  }
}