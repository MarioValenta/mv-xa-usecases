import { Inject, Injectable } from '@angular/core';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { share } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DataService {


    constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }

    public GetCustomers() {
        return this.xaservices.Http!.Get<Array<string>>(`/api/cmdb/customer`).pipe(
            share()
        );
    }

    public GetHostname(customer : string) {
        return this.xaservices.Http!.Get<Array<string>>(`api/oracle/gethostname/${customer}`).pipe(
            share()
        );
    }

    public GetSiteBlock(hostid : string) {
        return this.xaservices.Http!.Get<Array<string>>(`api/oracle/getsiteandblock/${hostid}`).pipe(
            share()
        );
    }

    public GetChangeImplementationWBS(customer: string){
        return this.xaservices.Http!.Get<Array<string>>(`api/cmdb/wbs/${customer}`).pipe(
            share()
        );

    }
    public GetReasonForDBOrder(){
        return this.xaservices.Http!.Get<Array<string>>(`api/oracle/reasonfororder`).pipe(
            share()
        );

    }

    public GetCMBServices(customer: string){
        return this.xaservices.Http!.Get<Array<string>>(`api/oracle/getcmdbservices/${customer}`).pipe(
            share()
        );

    }
   public GetEnvironments(hostid : string, olddatabase : string) {
        return this.xaservices.Http!.Get<Array<string>>(`api/oracle/serviceenvironments/${hostid}/${olddatabase}`).pipe(
            share()
        );
    }

    public GetListenerServiceName(hostid : string, olddatabase : string) {
        return this.xaservices.Http!.Get<Array<string>>(`api/oracle/getlistenerservicename/${hostid}/${olddatabase}`).pipe(
            share()
        );
    }

    public GetServiceListenerIP(hostid: string, reasonfordborder:string, olddatabase: string){
        return this.xaservices.Http!.Get<Array<string>>(`api/oracle/getservicelistenerip/${hostid}/${reasonfordborder}/${olddatabase}`).pipe(
            share()
        );

    }

    public GetDBOptions(dbversion : string, edition : string, hostid: string, olddatabase : string) {
        return this.xaservices.Http!.Get<Array<string>>(`api/oracle/getdboptions/${dbversion}/${edition}/${hostid}/${olddatabase}`).pipe(
            share()
        );
    }


    public GetDBServiceTypes(dbversion : string, edition : string, hostid: string, olddatabase : string) {
        return this.xaservices.Http!.Get<Array<string>>(`api/oracle/dbservicetypes/${dbversion}/${edition}/${hostid}/${olddatabase}`).pipe(
            share()
        );
    }

    public GetDBVersions(hostid : string, olddatabase : string) {
        return this.xaservices.Http!.Get<Array<string>>(`api/oracle/dbversions/${hostid}/${olddatabase}`).pipe(
            share()
        );
    }

    public GetBuildVersions(dbversion : string, hostid: string, olddatabase : string) {
        return this.xaservices.Http!.Get<Array<string>>(`api/oracle/buildversions/${dbversion}/${hostid}/${olddatabase}`).pipe(
            share()
        );
    }

    public GetCharacterSet(hostid: string, olddatabase : string) {
        return this.xaservices.Http!.Get<Array<string>>(`api/oracle/characterset/${hostid}/${olddatabase}`).pipe(
            share()
        );
    }

    public GetDBEdition(dbversion : string, hostid: string, ReasonForDBOrder: string,  olddatabase : string ) {
        return this.xaservices.Http!.Get<Array<string>>(`api/oracle/edition/${dbversion}/${hostid}/${ReasonForDBOrder}/${olddatabase}`).pipe(
            share()
        );
    }
    public GetEnvironmentMapping(environment: string) {
        return this.xaservices.Http!.Get<Array<string>>(`/api/oracle/envmapping/${environment}`).pipe(
            share()
        );
    }
    public GetServiceTimeDetails(selectedSupportTime: string) {
        return this.xaservices.Http!.Get<Array<string>>(`/api/oracle/servicetimedetails/${selectedSupportTime}`).pipe(
            share()
        );
    }

    public IsBackupInterface(host: string) {
        return this.xaservices.Http!.Get<Array<string>>(`/api/oracle/backup/${host}`).pipe(
            share()
        );
    }

    public GetCompatibleDBVersion(dbversion : string, hostid: string, olddatabase : string) {
        return this.xaservices.Http!.Get<Array<string>>(`api/oracle/getcompatibledatabaseversion/${dbversion}/${hostid}/${olddatabase}`).pipe(
            share()
        );
    }

    public GetControlManagementPack(dbversion : string, edition : string, hostid: string, olddatabase : string) {
        return this.xaservices.Http!.Get<Array<string>>(`api/oracle/managementpack/${dbversion}/${edition}/${hostid}/${olddatabase}`).pipe(
            share()
        );
    }

    public GetDBBlockSize (hostid: string, olddatabase : string) {
        return this.xaservices.Http!.Get<Array<string>>(`api/oracle/blocksize/${hostid}/${olddatabase}`).pipe(
            share()
        );
    }

    public GetOracleIds (hostid : string) {
        return this.xaservices.Http!.Get<Array<string>>(`api/oracle/getoracleids/${hostid}`).pipe(
            share()
        );
    }

    public GetFEE (hostid : string) {
        return this.xaservices.Http!.Get<Array<string>>(`api/oracle/getfee/${hostid}`).pipe(
            share()
        );
    }

    public GetIPRange (hostid : string, olddatabase : string) {
        return this.xaservices.Http!.Get<Array<string>>(`api/oracle/getiprange/${hostid}/${olddatabase}`).pipe(
            share()
        );
    }

}
