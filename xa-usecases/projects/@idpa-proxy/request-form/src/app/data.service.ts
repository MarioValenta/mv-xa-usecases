import { Inject, Injectable, Input } from '@angular/core';
import { ICERequestContext, XAServices } from '@xa/lib-ui-common';
import { share } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { XASERVICE_TOKEN } from 'projects/shared.functions';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }


  public getParameters(url: string){
    return this.xaservices.Http!.Get<Array<string>>(`${url}`).pipe(
      share()
    );
  }

  // Get Clusters - if specific infrastructure selection option is checked
  public getClusters(vCenter: string) {
    return this.xaservices.Http!.Get<Array<string>>(`api/vmcreate/clusters/${vCenter}/?scope=all`).pipe(
      share()
    );
  }

  
  // Check the availability of the provided hostname
  public isHostnameAvailable(hostname: string): Observable<boolean> {
    return this.xaservices.Http!.Get<any>(`api/cmdb/host/${hostname}/checkavailability`).pipe(
      share()
    );
  }


  // Get Customer's DNS subdomains if customer is not in UAN
  public getCustomerDNSSubdomains(customer: string) {
    return this.xaservices.Http!.Get<any>(`api/cmdb/dnsdomains?customer=${customer.toLowerCase()}`).pipe(
      share(),
    );
  }

  // Check the availability of the input hostname
  public getHostnameAvailability(hostname: string) {
    return this.xaservices.Http!.Get<any>(`api/cmdb/host/${hostname}/checkavailability`).pipe(
      share(),
    );
  }

 

}
