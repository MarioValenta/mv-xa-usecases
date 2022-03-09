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

  public getRetentionTime(mode: string, hostId?: string, storageenvironment?: string) {
    return this.xaservices.Http.Get<Array<string>>(`api/createvolume/getretentiontime/${mode}/${hostId}/${storageenvironment}`).pipe(
      share()
    );
  }

  public getProtocol(mode: string, hostId?: string, storageenvironment?: string) {
    return this.xaservices.Http.Get<Array<string>>(`api/createvolume/getprotocol/${mode}/${hostId}/${storageenvironment}`).pipe(
      share()
    );
  }

  public getSnapshotPolicy(mode: string, hostId?: string, storageenvironment?: string) {
    return this.xaservices.Http.Get<Array<string>>(`api/createvolume/getsnapshotpolicy/${mode}/${hostId}/${storageenvironment}`).pipe(
      share()
    );
  }

  public getStorageClass(mode: string, hostId?: string, storageenvironment?: string) {
    return this.xaservices.Http.Get<Array<string>>(`api/createvolume/getstorageclass/${mode}/${hostId}/${storageenvironment}`).pipe(
      share()
    );
  }

  public getHostDetails(hostId: string) {
    return this.xaservices.Http.Get<Array<string>>(`api/volumecreate/gethostdetails/${hostId}`).pipe(
      share()
    );
  }

  public getStorageEnvironment() {
    return this.xaservices.Http.Get<Array<string>>(`api/createvolume/getstorageenvironment`).pipe(
      share()
    );
  }

  public getPercentSnapshotSpace(snapvaultbackup: string, localSnapshotPolicy: string) {
    return this.xaservices.Http.Get<{defaultValue: string, values: Array<string>}>(`api/createvolume/getpercentsnapshotspace/${snapvaultbackup}/${localSnapshotPolicy}`).pipe(
      share()
    );
  }

  public getStorageCluster(storageenvironment: string) {
    return this.xaservices.Http.Get<Array<string>>(`api/createvolume/getstoragecluster/${storageenvironment}`).pipe(
      share()
    );
  }

  public getSVMs(storagecluster: string) {
    return this.xaservices.Http.Get<Array<string>>(`api/createvolume/getsvm/${storagecluster}`).pipe(
      share()
    );
  }

  public getCustomerShortname(mode: string, host: string) {
    return this.xaservices.Http.Get<{customerprefix: string, customer: string}>(`api/createvolume/getcustomerprefix/${mode}/${host}`).pipe(
      share()
    );
  }


}
