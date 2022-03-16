import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { VMCreateForm } from './vm-create-form';
import { VMCreateDataService } from './vm-create-data.service';
import { map, switchMap, tap, share, takeUntil } from 'rxjs/operators';
import { combineLatest, Observable, merge, of, BehaviorSubject, Subject } from 'rxjs';
import { ICERequest, ICERequestContext, FeedbackRequestPayload } from "@xa/lib-ui-common";

@Component({
    selector: 'vm-create-request-form',
    templateUrl: './vm-create-request.component.html',
    styleUrls: ['./vm-create-request.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VMCreateRequestComponent implements ICERequest, OnInit, OnDestroy {


    @Input() public Context: ICERequestContext;

    formHelper: VMCreateForm = new VMCreateForm();
    form: FormGroup;

    data: VMCreateDataService = this.dataService;

    Customers$ = this.data.GetCustomers();
    Infrastructures$ = this.data.Infrastructures$;





    OSSupportebBy$ = this.data.GetOSSupportedBy();
    AppSupportedBy$ = this.data.GetAppSupportedBy();
    Environments$ = this.data.GetEnvironments();
    Criticalities$ = this.data.GetCriticality();
    PatchModes$ = this.data.GetPatchMode();
    ServiceTime$ = this.data.ServiceTime$;

    AppSupportedBySelected$;

    SLAs$: Observable<Array<any>>;
    AvailableSlas$: Observable<string>;

    Locations$: Observable<Array<any>>;

    DataStores$;

    OSIcon$: Observable<string>;
    OSVersions$: Observable<Array<any>>;

    ShowLicenseOptions$: Observable<boolean>;
    VMDKType$: Observable<string>;

    CustomerLANs$: Observable<Array<any>>;
    AdminLANs$: Observable<Array<any>>;
    TsmLANs$: Observable<Array<any>>;

    CustomerFieldValue$: BehaviorSubject<string> = new BehaviorSubject<string>(null);


    IpSelectable = {
        CustomerLan: new BehaviorSubject<boolean>(false),
        AdminLan: new BehaviorSubject<boolean>(false),
        TSMLan: new BehaviorSubject<boolean>(false),
    };

    payloadHasOS = false;

    destroy$ = new Subject();
    constructor(private dataService: VMCreateDataService) {

    }


    private SubscribeUntilDestroyed<T>(observable: Observable<T>, next?: (value: T) => void, error?: (error: any) => void, complete?: () => void) {
        return observable.pipe(
            takeUntil(this.destroy$)
        ).subscribe(next, error, complete);
    }


    ngOnInit() {

        this.payloadHasOS = Object.keys(this.Context.Payload).map(k => k.toLocaleLowerCase()).indexOf('os') != -1;


        this.form = this.formHelper.Create();
        this.initializeFields();
        this.Context.OnSubmit(() => this.SubmitForm());
        this.Context.OnFeedback(() => this.Feedback())
        this.SubscribeUntilDestroyed(this.form.statusChanges, status => this.Context.Valid = status);

        this.SubscribeUntilDestroyed(this.form.valueChanges, value => {
            this.Context.SubTitle = value.Hostname;
        });

        this.form.patchValue(this.Context.Payload || {});

        console.log(this.Environments$)
    }

    ngOnDestroy() {
        this.formHelper.Destroy();
    }

    keyPress(event: any) {
        const pattern = /[0-9\+\-\,\ ]/;

        const inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode !== 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    initializeFields() {

        this.SubscribeUntilDestroyed(merge(of(this.form.get('Customer').value), this.form.get('Customer').valueChanges), cust => {
            this.CustomerFieldValue$.next(cust);
        });

        this.AppSupportedByField();
        this.SLAFields();
        this.PlatformFields();
        this.OSFields();
        this.VMSettingsFields();
        this.NetworkOptionsField();
    }

    AppSupportedByField() {

        this.AppSupportedBySelected$ = this.form.get('AppSupportedBy').valueChanges.pipe(
            map(val => !!val)
        );

    }

    SLAFields() {

        this.SLAs$ = this.CustomerFieldValue$.pipe(
            switchMap(customer => {
                if (customer) {
                    if (!this.Context.Payload) {
                        this.formHelper.ClearValue('SLAName');
                    }

                    return this.data.GetSlas(customer);
                }
                return [];
            }),
            share()
        );

        this.AvailableSlas$ = this.SLAs$.pipe(
            map(slas => {
                const count = slas && slas.length || 0;
                return `${count} SLA${count === 1 ? '' : 's'} available...`;
            })
        );



        this.formHelper.ChangeDisabledState('SLAName',
            combineLatest(
                this.form.get('UseSLA').valueChanges.pipe(
                    map(val => !val)
                ),
                this.CustomerFieldValue$
            ).pipe(
                map(([useSla, customer]) => {
                    return useSla && !!customer;
                })
            )
        );

        this.formHelper.ChangeDisabledState('UseSLA',
            merge(
                of(true),
                this.SLAs$.pipe(
                    map(slas => {
                        const hasSLAs = slas && slas.length > 0;
                        if (!hasSLAs) {
                            this.formHelper.PatchValue('UseSLA', false);
                        }
                        return !hasSLAs;
                    })
                )
            )
        );
    }

    PlatformFields() {

        this.formHelper.ChangeDisabledState('PlatformOptions.Infrastructure', this.CustomerFieldValue$.pipe(
            map(val => {
                return !val;
            })
        ));


        this.Locations$ = combineLatest(
            this.form.get('PlatformOptions.Infrastructure').valueChanges.pipe(
                tap(() => {
                    if (!this.Context.Payload) {
                        tap(_ => this.formHelper.ClearValue('PlatformOptions.Location')),
                            tap(_ => this.formHelper.SetDisabled('PlatformOptions.Location')),
                            tap(_ => this.formHelper.ClearValue('PlatformOptions.Datastore'));
                    }
                })

            ),
            this.CustomerFieldValue$
        ).pipe(
            switchMap(([infrastructure, customer]) => {
                return this.data.GetLocations(infrastructure, customer);
            }),
            share()
        );

        const Infra = this.form.get('PlatformOptions.Infrastructure').valueChanges.pipe(

        );

        this.formHelper.ChangeDisabledState('PlatformOptions.Location', this.Locations$.pipe(
            map(val => !(val && val.length > 0))
        ));


        this.formHelper.ChangeDisabledState('PlatformOptions.Datastore', combineLatest(Infra, this.Locations$).pipe(
            map(([infra, location]) => {
                if (infra === 'Dedicated Local Infrastructure') {
                    return true;
                }
                const infraMissing = !infra;
                const locationMissing = !location || location.length === 0;
                return infraMissing || locationMissing;
            })
        ));

        this.formHelper.ChangeDisabledState('PlatformOptions.DedicatedLocal', combineLatest(Infra, this.Locations$).pipe(
            map(([infra, location]) => {
                if (infra !== 'Dedicated Local Infrastructure') {
                    return true;
                }
                const infraMissing = !infra;
                const locationMissing = !location || location.length === 0;
                return infraMissing || locationMissing;
            })
        ));

        this.DataStores$ = merge(of(this.form.get('PlatformOptions.Infrastructure').value), this.form.get('PlatformOptions.Infrastructure').valueChanges).pipe(
            map(value => {
                switch (value) {
                    case 'Shared Local Infrastructure (DSI-L)': {
                        return {
                            template: 'DataStore',
                            items: [
                                'Local Datastore',
                                'Mirrored Datastore',
                                'Customer specific Datastore'
                            ]
                        };
                    }
                    case 'Dedicated Remote Infrastructure (DSI-R)': {
                        return {
                            template: 'DataStore',
                            items: [
                                'Datastore Standard, ds',
                                'Datastore Non-Replicated, dn'
                            ]
                        };
                    }
                    case 'Dedicated Local Infrastructure': {
                        return {
                            template: 'Details',
                            items: null
                        };
                    }
                }
                return {};
            }),
            share()
        );



    }

    OSFields() {

        this.OSIcon$ = merge(of(null), this.form.get('OS').valueChanges).pipe(
            map((os: string) => {
                return os ? os.toLowerCase() : 'question circle outline';
            })
        );

        this.OSVersions$ = this.form.get('OS').valueChanges.pipe(
            switchMap(os => {
                if (os) {
                    if (!this.Context.Payload) {
                        this.formHelper.ClearValue('OSVersion');
                    }

                    switch (os) {
                        case 'Windows': {
                            return this.data.GetOSImage('WinVM');
                        }
                        case 'Linux': {
                            return this.data.GetOSImage('LinuxVM');
                        }
                    }
                }
                return of([]);
            }),
            share()
        );

        this.ShowLicenseOptions$ = this.form.get('OS').valueChanges.pipe(
            map(os => os === 'Windows')
        );

        this.formHelper.ChangeDisabledState('OSVersion', this.form.get('OS').valueChanges.pipe(
            map(val => !val)
        ));

        this.formHelper.ChangeDisabledState('LicenseType', this.ShowLicenseOptions$.pipe(
            map(val => !val)
        ));

        this.formHelper.ChangeDisabledState('LicenseValue', this.ShowLicenseOptions$.pipe(
            map(val => !val)
        ));

    }

    private GetVMDkOptionsFromPayload() {
        return this.Context.Payload && this.Context.Payload.VMOptions && this.Context.Payload.VMOptions.VMDK;
    }
    VMSettingsFields() {


        this.VMDKType$ = this.form.get('OS').valueChanges.pipe(
            share(),
            tap(value => {
                const vmdkFromPayload = this.GetVMDkOptionsFromPayload();

                if (this.Context.Payload.OS == value) {
                    if (vmdkFromPayload) {
                        this.formHelper.PatchValue('VMOptions.VMDK', vmdkFromPayload);
                        return;
                    }
                }

                switch (value) {
                    case 'Windows': {

                        if (this.Context.Payload && this.Context.Payload.OSOptions && this.Context.Payload.OSOptions.WindowsVMDK) {
                            this.formHelper.PatchValue('VMOptions.VMDK', this.Context.Payload.OSOptions.WindowsVMDK);
                        } else {
                            this.formHelper.PatchValue('VMOptions.VMDK', []);
                        }
                        break;
                    }
                    case 'Linux': {
                        if (this.Context.Payload && this.Context.Payload.OSOptions && this.Context.Payload.OSOptions.LinuxVMDK) {
                            this.formHelper.PatchValue('VMOptions.VMDK', this.Context.Payload.OSOptions.LinuxVMDK);
                        } else {
                            this.formHelper.PatchValue('VMOptions.VMDK', []);
                        }
                        break;
                    }
                }
            })
        );


        this.formHelper.ChangeDisabledState('VMOptions.UpperLimitValue', this.form.get('VMOptions.UpperLimit').valueChanges.pipe(
            map(val => !val),
            tap(disabled => {
                if (disabled) {
                    this.formHelper.PatchValue('VMOptions.UpperLimitValue', 'Unlimited');
                } else {
                    this.formHelper.PatchValue('VMOptions.UpperLimitValue', null);
                }
            })
        ));

        this.formHelper.ChangeDisabledState('VMOptions.LowerLimitValue', this.form.get('VMOptions.PayPerUse').valueChanges.pipe(
            map(val => !val)
        ));

        this.formHelper.ChangeDisabledState('VMOptions.LimitsUnit', combineLatest(this.form.get('VMOptions.PayPerUse').valueChanges, this.form.get('VMOptions.UpperLimit').valueChanges).pipe(
            map(([ppu, upper]) => {
                return !(ppu || upper);
            })
        ));
    }

    NetworkOptionsField() {

        this.formHelper.ChangeDisabledState('NetworkOptions.CustomerLan', this.CustomerFieldValue$.pipe(
            map(val => !val)
        ));

        this.formHelper.ChangeDisabledState('NetworkOptions.AdminLan', this.CustomerFieldValue$.pipe(
            map(val => !val)
        ));

        this.formHelper.ChangeDisabledState('NetworkOptions.TSMLan', combineLatest(
            this.CustomerFieldValue$,
            merge(
                of(this.form.get('VMOptions.Backup').value),
                this.form.get('VMOptions.Backup').valueChanges
            )
        ).pipe(
            map(([customer, backup]) => {
                return !customer || backup !== 'TSM';
            })
        ));

        this.CustomerLANs$ = this.CustomerFieldValue$.pipe(
            switchMap(customer => {
                if (customer) {
                    return this.data.GetCustomerLANsFor(customer);
                }
                return of([]);
            }),
            share()
        );

        this.AdminLANs$ = this.CustomerFieldValue$.pipe(
            switchMap(customer => {
                if (customer) {
                    return this.data.GetAdminLANsFor(customer);
                }
                return of([]);
            }),
            share()
        );

        this.TsmLANs$ = this.CustomerFieldValue$.pipe(
            switchMap(customer => {
                if (customer) {
                    return this.data.GetTsmLANsFor(customer);
                }
                return of([]);
            }),
            share()
        );


        this.SubscribeUntilDestroyed(combineLatest(this.form.get('NetworkOptions.CustomerLan').valueChanges, this.CustomerLANs$), ([selected, lans]) => {
            if (selected) {
                const lan = lans.find(l => l.ID === selected);
                if (lan) {
                    this.SetLanReuestOptions('CustomerLan', lan.RequestIpVersion);
                }
            }
        });

        this.SubscribeUntilDestroyed(combineLatest(this.form.get('NetworkOptions.AdminLan').valueChanges, this.AdminLANs$), ([selected, lans]) => {
            if (selected) {
                const lan = lans.find(l => l.ID === selected);
                if (lan) {
                    this.SetLanReuestOptions('AdminLan', lan.RequestIpVersion);
                }
            }
        });


        this.SubscribeUntilDestroyed(combineLatest(this.form.get('NetworkOptions.TSMLan').valueChanges, this.TsmLANs$), ([selected, lans]) => {
            if (selected) {
                const lan = lans.find(l => l.ID === selected);
                if (lan) {
                    this.SetLanReuestOptions('TSMLan', lan.RequestIpVersion);
                }
            }
        });

    }

    private SetLanReuestOptions(lan: string, requestIpVersion: number) {
        switch (requestIpVersion) {
            case 0: {
                this.formHelper.PatchValue(`NetworkRequestOptions.${lan}.IPv4`, false);
                this.formHelper.PatchValue(`NetworkRequestOptions.${lan}.IPv6`, false);
                this.IpSelectable[lan].next(false);
                break;
            }
            case 4: {
                this.formHelper.PatchValue(`NetworkRequestOptions.${lan}.IPv4`, true);
                this.formHelper.PatchValue(`NetworkRequestOptions.${lan}.IPv6`, false);
                this.IpSelectable[lan].next(false);
                break;
            }
            case 6: {
                this.formHelper.PatchValue(`NetworkRequestOptions.${lan}.IPv4`, false);
                this.formHelper.PatchValue(`NetworkRequestOptions.${lan}.IPv6`, true);
                this.IpSelectable[lan].next(false);
                break;
            }
            case 10: {
                this.formHelper.PatchValue(`NetworkRequestOptions.${lan}.IPv4`, false);
                this.formHelper.PatchValue(`NetworkRequestOptions.${lan}.IPv6`, false);
                this.IpSelectable[lan].next(true);
                break;
            }
        }

    }

    UpdateView() {

    }

    Feedback(): FeedbackRequestPayload {

        return this.form.value;
    }

    public SubmitForm() {

        if (this.form.valid) {
            console.debug(this.form.value);


        } else {
            console.error('Form is not valid', this.form);
        }

        const model = this.form.value;

        return {
            value: model,
            identifier: model.Hostname
        };

    }
}
