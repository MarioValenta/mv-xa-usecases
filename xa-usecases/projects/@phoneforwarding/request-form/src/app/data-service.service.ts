import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { share } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }

    // url comes from the ConfigPayload
    public GetDataFromEndpoint(url: string) {
        return this.xaservices.Http!.Get<Array<string>>(url).pipe(
            share()
        );
    }

}
