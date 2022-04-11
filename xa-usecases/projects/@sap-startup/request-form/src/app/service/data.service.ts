import { HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { CMDBCustomerModel } from '../model/cmdb-customer.model';
import { CmdbModel } from '../model/cmdb.model';
import { DomainUANModel } from '../model/domain-uan.model';
import { NetworkZoneDescriptionsModel, NetworkZoneModel } from '../model/network-zone.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }

  getCustomers() {
    return this.xaservices.Http!.Get<Array<string>>(`/api/sap/customerlist`).pipe(share());
  }

  getCustomerAbbreviation(customerName: string): Observable<CMDBCustomerModel> {
    return this.xaservices.Http!.Get<CMDBCustomerModel>(`/api/cmdb/customer/${customerName}`).pipe(share());
  }

  getDefaultWBS(customer: string): Observable<Array<string>> {
    return this.xaservices.Http!.Get<Array<string>>(`/api/sap/wbs/${customer}`).pipe(share());
  }

  getDefaultServiceTime(customer: string, environment: string) {
    return this.xaservices.Http!.Get<Array<string>>(`/api/sap/getservicetime/${customer}/${environment}`).pipe(share());
  }

  getDefaultAttendedOperationTime(customer: string, environment: string): Observable<Array<string>> {
    return this.xaservices.Http!
      .Get<Array<string>>(`/api/sap/getattendedoperationtime/${customer}/${environment}`)
      .pipe(share())
      ;
  }

  getDefaultBestshored(customer: string): Observable<Array<string>> {
    return this.xaservices.Http!.Get<Array<string>>(`/api/sap/bestshored/${customer}`).pipe(share());
  }

  getDefaultDomainCustomerLAN(customer: string): Observable<Array<string>> {
    return this.xaservices.Http!.Get<Array<string>>(`/api/sap/domaincustomerlan/${customer}`).pipe(share());
  }

  getDefaultDomainUAN(customer: string): Observable<DomainUANModel> {
    return this.xaservices.Http!.Get<DomainUANModel>(`api/sap/domainuan/${customer}`).pipe(share());
  }

  getNetworkZones(customer: string): Observable<Array<NetworkZoneModel>> {
    return this.xaservices.Http!.Get<Array<NetworkZoneModel>>(`/api/sap/getnetworkzones/${customer}`).pipe(share());
  }

  getLANDesc(customer: string, cust: string, nas: string): Observable<NetworkZoneDescriptionsModel> {
    return this.xaservices.Http!.Get<NetworkZoneDescriptionsModel>(`/api/sap/getlandesc/${customer}?cust=${cust}&nas=${nas}`).pipe(share());
  }

  getDefaultDSIBlock(vCenter: string, dbType: string, environment: string, dataCenter: string): any {
    return this.xaservices.Http!.Get<any>(`/api/sap/dsiblock/${vCenter}/${dbType}/${environment}/${dataCenter}`).pipe(share());
  }

  getServiceTimes(depValue: string): Observable<Array<string>> {
    return this.xaservices.Http!.Get<Array<string>>(`/api/cmdb/servicetime?depvalue=${depValue.trim()}`).pipe(share());
  }

  getAssignmentGroup(os: string, bestshored: string): Observable<Array<string>> {
    return this.xaservices.Http!.Get<Array<string>>(`/api/sap/getsvcsupgroup/${os}/${bestshored}`).pipe(share());
  }

  getHostAssignmentGroup(os: string): Observable<Array<string>> {
    return this.xaservices.Http!.Get<Array<string>>(`/api/sap/gethsup/${os}/`).pipe(share());
  }

  getCustomerSLAs(customer: string): Observable<Array<CmdbModel>> {
    return this.xaservices.Http!.Get<Array<CmdbModel>>(`/api/cmdb/sla`, { params: { customer } }).pipe(share());
  }

  getEnvironments(): Observable<Array<string>> {
    return this.xaservices.Http!.Get<Array<string>>(`/api/cmdb/environments`).pipe(share());
  }

  getDBTypeByOS(os: string): Observable<Array<string>> {
    return this.xaservices.Http!.Get<Array<string>>(`/api/sap/getdbbyos/${os}`).pipe(share());
  }

  getVCenterNames(platformType: string): Observable<Array<string>> {
    return this.xaservices.Http!.Get<Array<string>>(`/api/sap/getvcentername/${platformType}`).pipe(share());
  }

  getDSIBlocks(vCenter: string, dataCenter: string, dbType: string, env: string): Observable<Array<string>> {
    return this.xaservices.Http!.Get<Array<string>>(
      `/api/sap/getblocklist?vcenter=${vCenter}&dc=${dataCenter}&dbtype=${dbType}&env=${env}`
    ).pipe(share());
  }

  getDefaultDRLevel(customer: string, environment: string): Observable<Array<string>> {
    return this.xaservices.Http!.Get<Array<string>>(`/api/sap/getdrlevel/${customer}/${environment}`).pipe(share());
  }

  getCriticality(): Observable<Array<string>> {
    return this.xaservices.Http!.Get<Array<string>>(`/api/cmdb/criticality`).pipe(share());
  }

  getTimezones(): Observable<Array<string>> {
    return this.xaservices.Http!.Get<Array<string>>(`/api/other/timezones`).pipe(share());
  }

  getVersions(osType: string, dbType: string): Observable<Array<string>> {
    return this.xaservices.Http!.Get<Array<string>>(`/api/sap/getosversionlist/${osType}/${dbType}`).pipe(share());
  }

  getPatchModes(): Observable<Array<CmdbModel>> {
    return this.xaservices.Http!.Get<Array<CmdbModel>>(`/api/cmdb/patchmode`).pipe(share());
  }

  public getPatchTimes(): Observable<Array<CmdbModel>> {
    return this.xaservices.Http!.Get<Array<CmdbModel>>(`api/cmdb/patchtime`).pipe(share());
  }

  getFilledSAPTemplateData<T>(
    osType: string,
    dbType: string,
    servicesType: string,
    templateParams: HttpParams
  ): Observable<Array<T>> {

    return this.xaservices.Http!
      .Get<Array<T>>(
        `/api/sap/fillservicestemplate/${osType}/${dbType}/${servicesType}?${templateParams.toString()}`
      )
      .pipe(share());
  }
}
