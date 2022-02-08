import { Injectable } from "@angular/core";
import { XAServices } from "@xa/lib-ui-common";
import { share } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AttachmentService {

    constructor(private xaservices: XAServices) {
        if (!environment.production) {
            console.debug('ENV: NON PROD');
            this.xaservices = ((window as any).xa as XAServices);
        }
    }

    public getFile(businessKey: string, fileName: string) {

        return this.xaservices.Http.GetBlob(`api/files/attachments?businessKey=${businessKey}&fileName=${fileName}`).pipe(
            share()
        );
    }

}
