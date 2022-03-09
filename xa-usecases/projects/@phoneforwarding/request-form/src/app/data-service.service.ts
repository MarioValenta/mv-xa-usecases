import { Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { share } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(private xaservices: XAServices) {
      if (this.xaservices === undefined || this.xaservices === null) {
        this.xaservices = ((window as any).xa as XAServices);
      }
    }

    // url comes from the ConfigPayload
    public GetDataFromEndpoint(url: string) {
        return this.xaservices.Http.Get<Array<string>>(url).pipe(
            share()
        );
    }

}
