import { of } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { XAServices } from '@xa/lib-ui-common';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class VMCreateDataService {


    ServiceTime$ = of(['None', 'Office', 'Fulltime']);

    Infrastructures$ = of([
        'Shared Local Infrastructure (DSI-L)',
        'Dedicated Remote Infrastructure (DSI-R)',
        'Dedicated Local Infrastructure']
    );

    TimeZones$ = of([
        '(GMT-12:00) International Date Line West',
        '(GMT-11:00) Midway Island, Samoa',
        '(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
        '(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',
        '(GMT+01:00) Brussels, Copenhagen, Madrid, Paris'
    ]);

    // PatchModes$ = this.store.pipe(
    //     select(state => state.shareddata.cmdb.PatchModes)
    // );

    cpuRangeOptions = {
        step: 1,
        pips: {
            mode: 'values',
            density: 2,
            values: [1, 4, 8, 12, 16, 20, 24, 28, 32],
            stepped: true
        },
        range: {
            min: 1,
            max: 32,
        },
        behaviour: 'snap',
        connect: [true, false]
    };

    memoryRangeOptions = {
        step: 4,
        padding: [4, 0],
        pips: {
            mode: 'values',
            density: 2,
            values: [8, 16, 32, 64, 128, 256]
        },
        range: {
            min: 0,
            max: 256
        },
        behaviour: 'snap',
        connect: [true, false]
    };

    constructor(private xaservices: XAServices) {
      if (this.xaservices === undefined || this.xaservices === null) {
        this.xaservices = ((window as any).xa as XAServices);
      }
    }


    public GetSlas(customer: string) {
        return this.xaservices.Http.Get<any>(`api/cmdb/sla?customer=${customer}`).pipe(
            share(),
            //map(res => res.Data as Array<any>)
        );
    }

    public GetLocations(infrastructure: string, customer: string) {

        if (infrastructure === 'Shared Local Infrastructure (DSI-L)') {
            return of([
                {
                    cmdbKey: 'To be determined by ESX-Team',
                    label: 'To be determined by ESX-Team'
                },
                {
                    cmdbKey: 'T-Center',
                    label: 'T-Center'
                },
                {
                    cmdbKey: 'ODC',
                    label: 'ODC'
                }
            ]);
        }

        if (infrastructure === 'Dedicated Local Infrastructure') {
            return this.xaservices.Http.Get<Array<any>>(`/api/cmdb/getesxcluster?customer=${customer}&location=local`).pipe(
                map(data => data.map(d => ({
                    ...d,
                    label: d.entry
                })))
            );
        }


        if (infrastructure === 'Dedicated Remote Infrastructure (DSI-R)') {
            return this.xaservices.Http.Get<Array<any>>(`/api/cmdb/getesxcluster?customer=${customer}&location=remote`).pipe(
                map(data => data.map(d => ({
                    ...d,
                    label: d.entry
                })))
            );
        }

        return of([]);
    }

    public GetOSImage(osType: string) {
        return this.xaservices.Http.Get<any>(`/api/rmdb/osimages?osType=${osType}`).pipe(
            share(),
            //map(data => data.Data)
        );
    }

    public GetCustomerLANsFor(customer: string) {
        return this.xaservices.Http.Get<Array<any>>(`/api/cmdb/lan/${customer}/1`).pipe(
            share()
        );
    }

    public GetAdminLANsFor(customer: string) {
        return this.xaservices.Http.Get<Array<any>>(`/api/cmdb/lan/${customer}/2`).pipe(
            share()
        );
    }

    public GetTsmLANsFor(customer: string) {
        return this.xaservices.Http.Get<Array<any>>(`/api/cmdb/lan/${customer}/3`).pipe(
            share()
        );
    }

    public GetCustomers() {
        return this.xaservices.Http.Get<Array<any>>(`/api/cmdb/customer`).pipe(
            share()
        );
    }

    public GetOSSupportedBy() {
        return this.xaservices.Http.Get<Array<any>>(`/api/cmdb/group/ossupportedby`).pipe(
            share()
        );
    }

    public GetAppSupportedBy() {
        return this.xaservices.Http.Get<Array<any>>(`/api/cmdb/group/appsupportedby`).pipe(
            share()
        );
    }

    public GetEnvironments() {
        return this.xaservices.Http.Get<Array<any>>(`api/cmdb/environments`).pipe(
            share()
        );
    }

    public GetCriticality() {
        return this.xaservices.Http.Get<Array<any>>(`api/cmdb/criticality`).pipe(
            share()
        );
    }

    public GetPatchMode() {
        return this.xaservices.Http.Get<any>(`api/cmdb/patchmode`).pipe(
            share(),
        );
    }

    public GetBasicData() {
        return this.xaservices.Http.Get<any>(`/api/dataproxy/startup/basic`).pipe(
            share(),
            map(res => res.Data as {
                Criticality: Array<string>,
                Environment: Array<string>,
                PatchMode: Array<string>
            })
        );

    }
}
