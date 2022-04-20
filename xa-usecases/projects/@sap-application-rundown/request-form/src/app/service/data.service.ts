import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { RelationsModel } from 'projects/@sap-application-rundown/shared/models/relations.model';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) {
  }

  /**
   * Get Relations of host recursively as tree structure.
   *
   * @param hostID of the host
   */
  public getCIRelations(hostID: string): Observable<Array<RelationsModel>> {
    return this.xaservices.Http!.Get<Array<RelationsModel>>(`/api/sap/relations/HOST/${hostID}`).pipe(
      share()
    );
  }

  /**
   * Get a list of environments from CMDB.
   */
  public getEnvironments(): Observable<Array<any>> {
    return this.xaservices.Http!.Get<Array<any>>(`/api/cmdb/environments`).pipe(
      share()
    );

  }

  /**
   * Get a list of customers from CMDB.
   */
  public getCustomers(): Observable<Array<string>> {
    return this.xaservices.Http!.Get<Array<string>>(`/api/cmdb/customer`);
  }
}
