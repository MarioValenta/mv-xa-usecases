import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { FeedbackRequestPayload, ICERequest, ICERequestContext, XAServices } from '@xa/lib-ui-common';
import { SearchField } from '@xa/search';
import { ValidationService } from '@xa/validation';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { DataService } from './data.service';


@Component({
    selector: 'vm-cpu-ram-extension-request-form',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements ICERequest, OnInit, OnDestroy {

    @Input() public Context: ICERequestContext;

    form: FormGroup;
    HostId: string;
    hplatform = 'SRV_X86_VM';
    hinweis = false;

    info = { HostID: '', Hostname: '', Environment: '', Customer: '', Status: '', WBS: '' };
    destroy$ = new Subject<any>();
    CustomerName$ = new Observable<string[]>();
    Customer$ = new Observable<string[]>();
    customernickname: string;
    customerfullname: string;
    domlayout = 'autoHeight';
    hostfields = {
        1: { header: 'Hostid', fields: 'HOSTID' },
        2: { header: 'Hostname', fields: 'HOSTNAME' },
        3: { header: 'Hostmodel', fields: 'HMODEL' },
        4: { header: 'Hostmodelnr', fields: 'HMODELNR' },
        5: { header: 'Predlabel', fields: 'PREDLABEL' },
        6: { header: 'Status', fields: 'HSTATUS' },
        7: { header: 'Support', fields: 'HSUP' },

    };

    EntriesService: [];
    servicefields = {

        1: { header: 'ID', fields: 'ID' },
        2: { header: 'Name', fields: 'Name' },
        3: { header: 'predicate', fields: 'predicate' },
        4: { header: 'Class', fields: 'Class' },
        5: { header: 'Type', fields: 'Type' },
        6: { header: 'Status', fields: 'Status' },
        7: { header: 'Support', fields: 'Support' },
        8: { header: 'Environment', fields: 'Environment' },

    };

    SearchFields: Array<SearchField> = [
        {
            Name: 'HOSTID',
            Label: 'HostID'
        },
        {
            Name: 'HOSTNAME',
            Label: 'Hostname',
            FormatValue: (value) => {

                if (value.startsWith('!'))
                    return value.substring(1);

                if (value.includes('*') || value.includes('%')) {
                    return value;
                }
                return `*${value}*`;
            }
        },
        {
            Name: 'HENVIRONMENT',
            Label: 'Environment',
            Type: 'select',
            Options: this.dataService.GetEnvironments(),
            Placeholder: 'Environment',
            Width: '15em',
        },
        {
            Name: 'HCUST',
            Label: 'Customer',
            Type: 'select',
            Options: this.dataService.GetCustomers(),
            SelectConfig: {
                ViewValue: 'label',
                OptionsValue: 'CUSTOMERNICKNAME'
            },
            Width: '30em',
            Placeholder: 'Select Customer'
        },
        {
            Name: 'HSTATUS',
            Label: 'Status',
            Type: 'select',
            Options: () => (this.Context && this.Context.ConfigPayload.AllowedStatus) || this.allowedStatus,
            Placeholder: 'Status',
            Width: '15em',
            HideInput: false
        },
        {
            Name: 'HKTR',
            Label: 'WBS',
            HideInput: true
        },
        {
            Name: 'HPLATFORM',
            Label: 'Platform',
            Type: 'select',
            Options: () => (this.Context && this.Context.ConfigPayload.AllowedPlatforms) || this.allowedPlatforms,
            HideResult: true,
            HideTable: true,

        }
    ];

    allowedStatus = [
        'RUNDOWN',
        'ACTIVE',
        'BASE_INSTALLED',
        'READY_FOR_SERVICE',
        'EXPERIMENTAL',
        'INFOALERTING',
        'MAINTENANCE'
    ];

    allowedPlatforms = [
        'SRV_X86_VM',
        'SRV_APPLIANCE_VM'
    ];

    constructor(private fb: FormBuilder,
        private dataService: DataService,
        @Inject(XASERVICE_TOKEN) private xaservices: XAServices,
        private cref: ChangeDetectorRef,
        private validationService: ValidationService) { }

    public GetFormControl(name: string): AbstractControl {
        const control = this.form.get(name);
        return control;
    }


    ngOnInit() {
        this.BuildForm();


        if (this.Context.Validation.requestForm) {
            this.validationService.setValidatorsFromConfig(this.form, this.Context.Validation.requestForm);
        }
        this.form.statusChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe(status => {
            this.Context.Valid = status;
        });

        this.Context.OnSubmit(() => this.Submit());
        this.Context.OnFeedback(() => this.Feedback());

        if (this.Context.Payload) {
            this.form.patchValue(this.Context.Payload);
        }

    }


    onSearchChanged(hostParameter) {


        if (!hostParameter) {
            return;
        }


        if (hostParameter.HostID) {

            this.form.get('extendCPUby').patchValue('');
            this.form.get('CPUnew').patchValue('');

            this.form.get('extendCPUReservationBy').patchValue('');
            this.form.get('CPUReservationNew').patchValue('');

            this.form.get('extendCPULimitBy').patchValue('');
            this.form.get('CPULimitNew').patchValue('');

            this.form.get('extendRAMby').patchValue('');
            this.form.get('RAMnew').patchValue('');

            this.dataService.GetProperties(hostParameter.HostID).pipe(
                takeUntil(this.destroy$)).subscribe(properties => {

                    if (properties) {
                        this.form.get('ClusterName').setValue(properties.clusterName);
                        const ram = properties.memoryMb / 1024

                        this.form.get('RAM').setValue(ram);
                        this.form.get('CPU').setValue(properties.numVcpus);
                        this.form.get('vmname').setValue(properties.vmname);
                        this.form.get('vmhostid').setValue(properties.vmhostid);
                        this.form.get('vcenter').setValue(properties.vcenter);
                        this.form.get('memoryHotAddEnabled').setValue(properties.memoryHotAddEnabled);
                        this.form.get('cpuHotAddEnabled').setValue(properties.cpuHotAddEnabled);
                        this.form.get('vmtoolsStatus').setValue(properties.vmtoolsStatus);
                        this.form.get('os').setValue(properties.os);

                        this.form.get('CPUSockets').setValue(properties.cpuSockets);
                        this.form.get('coresPerCPU').setValue(properties.coresPerCpu);


                        if (properties.cpuReservation == 0) {

                            this.cpuReservation = 0;
                            this.form.get('CPUReservation').setValue(' ');
                            this.form.get('extendCPUReservationBy').patchValue('');
                            this.form.get('extendCPUReservationBy').disable();
                            this.form.get('CPUReservationNew').patchValue('');
                            this.form.get('CPUReservationNew').disable();
                        }
                        else {
                            this.cpuReservation = properties.cpuReservation;
                            this.form.get('CPUReservation').setValue(properties.cpuReservation);
                            this.form.get('extendCPUReservationBy').enable();
                            this.form.get('CPUReservationNew').enable();

                        }

                        if (properties.cpuAllocationLimit == -1) {

                            this.cpuAllocationLimit = 0;
                            this.form.get('CPULimit').setValue(' ');
                            this.form.get('extendCPULimitBy').patchValue('');
                            this.form.get('extendCPULimitBy').disable();
                            this.form.get('CPULimitNew').patchValue('');
                            this.form.get('CPULimitNew').disable();
                            this.form.get('extendCPUbyChbx').reset();
                            this.form.get('extendCPUbyChbx').disable();
                        }
                        else {
                            this.cpuAllocationLimit = properties.cpuAllocationLimit;
                            this.form.get('CPULimit').setValue(properties.cpuAllocationLimit);
                            this.form.get('extendCPULimitBy').enable();
                            this.form.get('CPULimitNew').enable();

                        }



                    }

                });




        }

        //this.form.reset();
        this.form.get('hostid').setValue(hostParameter.HostID);
        this.form.get('hostname').setValue(hostParameter.Hostname);
        this.form.get('customernickname').setValue(hostParameter.Customer);


        this.HostId = hostParameter.HostID;
        this.info = hostParameter;

    }

    ngOnDestroy() {
        this.destroy$.next();
    }


    recalculateCPUExtension() {
        const extensionBy: number = Number(this.form.get('extendCPUby').value);
        if (extensionBy && extensionBy > 0) {
            this.form.get('CPUnew').setValue(this.form.get('CPU').value + extensionBy);

        } else {
            this.form.get('CPUnew').setValue('');
        }
    }

    recalculateRAMExtension() {
        const extensionBy: number = Number(this.form.get('extendRAMby').value);
        if (extensionBy && extensionBy > 0) {
            this.form.get('RAMnew').setValue(this.form.get('RAM').value + extensionBy);

        } else {
            this.form.get('RAMnew').setValue('');
        }
    }

    recalculateCPUreservation() {

        const extensionBy: number = Number(this.form.get('extendCPUReservationBy').value);
        if (extensionBy && extensionBy > 0) {
            this.form.get('CPUReservationNew').setValue(this.cpuReservation + extensionBy);

        } else {
            this.form.get('CPUReservationNew').setValue('');
        }
    }

    recalculateCPUlimitation() {

        const extensionBy: number = Number(this.form.get('extendCPULimitBy').value);
        if (extensionBy && extensionBy > 0) {
            this.form.get('CPULimitNew').setValue(this.cpuAllocationLimit + extensionBy);

        } else {
            this.form.get('CPULimitNew').setValue('');
        }
    }

    maxExtensionCpu = 0;
    extentionSelect = [];
    extensionSelection;

    maxCPU = 0;
    maxRAM = 0;
    vmname = '';
    vmhostid = '';
    vcenter = '';
    memoryHotAddEnabled = '';
    cpuHotAddEnabled = '';
    vmtoolsStatus = '';
    os = '';

    cpuReservation = 0;
    cpuSockets = 0;
    coresPerCpu = 0;
    cpuAllocationLimit = 0;

    private BuildForm() {

        this.form = this.fb.group({
            hostid: [''],
            hostname: [''],
            customernickname: [''],
            Customer: [''],
            CustomerName: [''],


            Agree: [''],
            //Confirm: ['', Validators.required],
            ContactInfo: [''],


            ClusterName: [''],
            CPU: [''],
            extendCPUbyChbx: [''],
            extendCPUby: [''],
            CPUnew: [''],
            RAM: [''],
            extendRAMby: [''],
            RAMnew: [''],

            maxCPU: [''],
            maxRAM: [''],

            vmname: [''],
            vmhostid: [''],
            vcenter: [''],
            memoryHotAddEnabled: [''],
            cpuHotAddEnabled: [''],
            vmtoolsStatus: [''],
            os: [''],

            CPUSockets: [''],
            coresPerCPU: [''],
            CPUReservation: [''],
            extendCPUReservationBy: [''],
            CPUReservationNew: [''],
            CPULimit: [''],
            extendCPULimitBy: [''],
            CPULimitNew: [''],

            //extendCPUreservation: [''],
            //extendCPUlimitatation: [''],

        });

        this.formControlValueChanges(this.form);

    }


    isFormElementRequired(elementName: string) {
        return this.validationService.validatorConfigList.get(elementName)
            ? (this.validationService.validatorConfigList.get(elementName).required || this.validationService.validatorConfigList.get(elementName).requiredTrue)
            : false;
    }

    customername: string
    formControlValueChanges(fg: FormGroup) {

        this.form.get('extendCPUbyChbx').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(val => {
            if(val == true){
                this.form.get('extendCPULimitBy').patchValue('-1');
                this.form.get('extendCPULimitBy').disable();
                this.form.get('CPULimitNew').patchValue('');
                this.form.get('CPULimitNew').disable();
            }
            if(val == false){
                this.form.get('extendCPULimitBy').patchValue('');
                this.form.get('extendCPULimitBy').enable();
                this.form.get('CPULimitNew').enable();
            }
        })

        this.form.get('customernickname').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(customer => {

            if (customer) {

                this.CustomerName$ = this.dataService.GetCustomerSM9Name(customer);
                this.CustomerName$.pipe(takeUntil(this.destroy$)).subscribe(res => {
                    if (res) {

                        this.form.get('CustomerName').patchValue(res['sm9name']);
                        this.customernickname = res['CUSTOMERNICKNAME'];
                        this.customerfullname = res['CUSTOMERFULLNAME']
                        this.form.get('Customer').patchValue(this.customernickname + '/' + this.customerfullname)
                        this.cref.markForCheck();

                    } else {
                        this.form.get('CustomerName').patchValue('');


                    }

                })


            }

        });

        this.form.get('ClusterName').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(clustername => {
            if (clustername) {
                this.dataService.GetCapacity(clustername).pipe(
                    takeUntil(this.destroy$)).subscribe(capacity => {
                        this.extentionSelect = [];

                        if (capacity) {
                            this.maxCPU = capacity.maxCPUs;
                            this.maxRAM = capacity.maxMemory;
                            this.form.get('maxCPU').setValue(this.maxCPU);
                            this.form.get('maxRAM').setValue(this.maxRAM);
                            this.cref.markForCheck();

                        }

                        this.maxExtensionCpu = this.form.get('maxCPU').value - this.form.get('CPU').value


                        if (this.maxExtensionCpu) {

                            if (this.form.get('coresPerCPU').value) {
                                this.coresPerCpu = this.form.get('coresPerCPU').value
                                var b = 0
                                for (var i = 1; b <= this.maxExtensionCpu; i++) {

                                    this.extentionSelect.push(b)
                                    b = this.coresPerCpu * i

                                }

                                this.extensionSelection = of(this.extentionSelect);

                            }

                        }

                    })
            }



        })


    }



    filter = (data: any) => {
        return (this.Context.ConfigPayload.AllowedStatus || this.allowedStatus).includes(data.HSTATUS && data.HSTATUS.toUpperCase()) &&
            (this.Context.ConfigPayload.AllowedPlatforms || this.allowedPlatforms).includes(data.HPLATFORM && data.HPLATFORM.toUpperCase());
    }

    searchFunction = (data: any) => {

        const httpParams = Object.keys(data).reduce((curr, next) => {
            const val = data[next] as string;
            if (val && val.trim()) {
                curr[next] = val;
            }
            return curr;
        }, {});

        const showFields = this.SearchFields.filter(f => f && !f.HideResult).map(f => f.Name).join(',');
        httpParams['fields'] = showFields;
        return this.xaservices.Http.Get<Array<any>>('api/feature/cmdbsearch/host', { params: httpParams });
    }



    Submit() {

        if (this.form.valid) {
            console.log(this.form.value);
        } else {
            console.error('Form is not valid', this.form);
        }

        const model = this.form.getRawValue();
        model['ContactInfo'] = this.form.get('ContactInfo').value.replace(/\s*,\s*/g, ",");

        console.log(model)

        return {
            value: model,
            identifier: `${model.hostname} _ ${model.hostid}`
        };
    }

    Feedback(): FeedbackRequestPayload {
        console.log(this.form.status)
        return this.form.value;
    }


}



