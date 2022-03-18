import { Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { share } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private xaservices: XAServices) {
    if (!environment.production) {
      console.debug('ENV: NON PROD');
      this.xaservices = ((window as any).xa as XAServices);
    }
  }

  public getCustomers() {
    return this.xaservices.Http.Get<Array<string>>(`api/cmdb/customer`).pipe(
      share()
    );
  }

  public getWBSInstallations(customer: string) {
    return this.xaservices.Http.Get<Array<string>>(`api/cmdb/wbs/${customer}`).pipe(
      share()
    );
  }

  public getAppSupportedBy() {
    return this.xaservices.Http.Get<Array<string>>(`api/cmdb/group/appsupportedby`).pipe(
      share()
    );
  }
  public getOSSupportedBy(osType: string) {
    return this.xaservices.Http.Get<Array<string>>(`api/vmcreate/group/ossupportedby?os=${osType}`).pipe(
      share()
    );
  }

  public getServiceTimeByAPPGroup(param: string) {
    return this.xaservices.Http.Get<Array<string>>(`api/cmdb/standbyinformation/app?depvalue=${param}`).pipe(
      share()
    );
  }

  public getServiceTimeByOSGroup(param: string) {
    return this.xaservices.Http.Get<Array<string>>(`api/cmdb/standbyinformation/os?depvalue=${param}`).pipe(
      share()
    );
  }

  public getEnvironments() {
    return this.xaservices.Http.Get<Array<string>>(`api/cmdb/environments`).pipe(
      share()
    );
  }

  public getCriticality() {
    return this.xaservices.Http.Get<Array<string>>(`api/cmdb/criticality`).pipe(
      share()
    );
  }

  public getSLA(customer: string) {
    return this.xaservices.Http.Get<Array<string>>(`api/cmdb/sla?customer=${customer}`).pipe(
      share()
    );
  }
  // GET customer specific platforms
  public getPlatforms(customer: string) {
    return this.xaservices.Http.Get<Array<{ vCenter: string; platformType: string; vCenterLabel: string; }>>(`api/catdb/platforms?customer=${customer}`).pipe(
      share()
    );
  }

  // Get Clusters - if specific infrastructure selection option is checked
  public getClusters(vCenter: string) {
    return this.xaservices.Http.Get<Array<string>>(`api/vmcreate/clusters/${vCenter}`).pipe(
      share()
    );
  }

  // Get Clusters - if specific infrastructure selection option is unchecked
  public getPreferredPlatformSpecification(datacenter: string) {
    return this.xaservices.Http.Get<{ vCenter: string; cluster: string; vCenterLabel: string }>
      (`/api/catdb/preferredplatform/datacenter/${datacenter}`)
      .pipe(
        share()
      );
  }

  // Get Datastore types for a VCenter & specific customer
  public getDatastoreTypes(vCenter: string, customer: string) {
    return this.xaservices.Http.Get<Array<string>>(`/api/catdb/vmcreate/datastoretypes/${vCenter}?customer=${customer}`).pipe(
      share()
    );
  }

  // Get currently available OS list
  public getOSVersions(osType: string) {
    return this.xaservices.Http.Get<any>(`api/catdb/vmcreate/osversions?ostype=${osType}`).pipe(
      share()
    );
  }

  // Check the availability of the provided hostname
  public isHostnameAvailable(hostname: string): Observable<boolean> {
    return this.xaservices.Http.Get<any>(`api/cmdb/host/${hostname}/checkavailability`).pipe(
      share()
    );
  }

  // TODO: clarify if this ep is for either getting releases or versions
  public getOSImage(osType: string) {
    return this.xaservices.Http.Get<any>(`api/rmdb/osimages?osType=${osType}`).pipe(
      share(),
    );
  }

  // Get OS releases
  public getOSReleases(osType: string, osVersionId: string) {
    return this.xaservices.Http.Get<any>(`api/catdb/vmcreate/releases/${osType}/${osVersionId}`).pipe(
      share(),
    );
  }

  // Get the customer's domains if Windows OS was selected
  public getDomains(customer: string) {
    return this.xaservices.Http.Get<any>(`api/rmdb/domains?customer=${customer.toLowerCase()}`).pipe(
      share(),
    );
  }

  // Get customer's subdomains
  public getUANSubDomain(customer: string) {
    return this.xaservices.Http.Get<any>(`api/cmdb/uansubdomain?customer=${customer.toLowerCase()}`).pipe(
      share(),
    );
  }

  // Get Customer's DNS subdomains if customer is not in UAN
  public getCustomerDNSSubdomains(customer: string) {
    return this.xaservices.Http.Get<any>(`api/cmdb/dnsdomains?customer=${customer.toLowerCase()}`).pipe(
      share(),
    );
  }

  // Check the availability of the input hostname
  public getHostnameAvailability(hostname: string) {
    return this.xaservices.Http.Get<any>(`api/cmdb/host/${hostname}/checkavailability`).pipe(
      share(),
    );
  }

  // Get the possible patchmodes
  public getPatchModes() {
    return this.xaservices.Http.Get<any>(`api/cmdb/patchmode`).pipe(
      share(),
    );
  }

  // Get Patch time
  public getPatchTimes() {
    return this.xaservices.Http.Get<Array<string>>(`api/cmdb/patchtime`).pipe(
      share(),
    );
  }

  // Get customer LANs for the provided customer
  public getCustomerLANsFor(customer: string, ipVersion: number) {
    return this.xaservices.Http.Get<Array<any>>(`/api/cmdb/lan/${customer}/1?version=${ipVersion}&exclusive=true`).pipe(
      share()
    );
  }

  // Get admin LANs for the provided customer
  public getAdminLANsFor(customer: string, ipVersion: number) {
    return this.xaservices.Http.Get<Array<any>>(`/api/cmdb/lan/${customer}/2?version=${ipVersion}&exclusive=true`).pipe(
      share()
    );
  }

  // Get NAS LANs for the provided customer
  public getNASLANsFor(customer: string, ipVersion: number) {
    return this.xaservices.Http.Get<Array<any>>(`/api/cmdb/lan/${customer}/4?version=${ipVersion}&exclusive=true`).pipe(
      share()
    );
  }

  // Retrieving cluster capacity information
  public getClusterCapacity(cluster: string) {
    return this.xaservices.Http.Get<{ maxCPUs: number, maxMemory: number }>(`api/catdb/capacity/${cluster.toUpperCase()}`).pipe(
      share()
    );
  }

  // Get the result of MHz calculation
  public getMHzCalculation(cluster: string, unit: string, limit: number) {
    return this.xaservices.Http.Get<{ mhz: number, minCPUs: number }>(`api/catdb/mhzcalculation/${cluster.toUpperCase()}/${unit.toLowerCase()}/${limit}`).pipe(
      share(),
    );
  }

}
