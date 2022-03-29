import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }

  public GetF5Cluster(customer: string) {
    return this.xaservices.Http!.Get<Array<any>>(`api/f5/clusters/${customer}`).pipe(
      share()
    );
  }
}
