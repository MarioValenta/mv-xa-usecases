import { Injectable } from "@angular/core";
import { HttpService } from './shared/services';
import { XAServices } from '@xa/lib-ui-common';

declare let window: any;

@Injectable({
    'providedIn': 'root'
})
export class GlobalScopeService {


    constructor(private httpService: HttpService) {

        if (!window.xa) {
            window.xa = this.BuildXAServices();
        }

    }

    private BuildXAServices() {

        const xaservices = new XAServices();
        xaservices.Http = <any>this.httpService;

        return xaservices;
    }
}
