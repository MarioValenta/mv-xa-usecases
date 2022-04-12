import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { share } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CiTableDataService {

    constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }

    public EnrichRows(hosts: Array<any>) {
        return this.xaservices.Http!.Get<Array<string>>(`api/f5/pooldata/`, {params: {hosts: JSON.stringify(hosts)}}).pipe(
            share()
        );
    }
}
