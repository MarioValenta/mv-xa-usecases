import { Inject, Injectable } from "@angular/core";
import { XAServices } from "@xa/lib-ui-common";
import { XASERVICE_TOKEN } from "projects/shared.functions";
import { share } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class AttachmentService {

    constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }

    public getFile(businessKey: string, fileName: string) {

        return this.xaservices.Http!.GetBlob(`api/files/attachments?businessKey=${businessKey}&fileName=${fileName}`).pipe(
            share()
        );
    }

}
