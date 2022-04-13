import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackRequestPayload, ICERequest, ICERequestContext, XAServices } from '@xa/lib-ui-common';
import { SearchField } from '@xa/search';
import { ValidationService } from '@xa/validation';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DataService } from './data.service';


@Component({
    selector: 'create-snapshot-request-form',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements ICERequest, OnInit, OnDestroy {

    @Input() public Context!: ICERequestContext;

    form!: FormGroup;
    HostId!: string;
    hplatform = 'SRV_X86_VM';
    hinweis = false;
    info = { HostID: '', Hostname: '', Environment: '', Customer: '', Status: '', WBS: '' };
    destroy$ = new Subject<any>();
    CustomerName$ = new Observable<string[]>();
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

    nosnapshot = false;
    EntriesService!: [];
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
startdateidentifier
    startOptions: FlatpickrOptions = {
        enableTime: true,
        mode: 'single',
        time_24hr: true,
        weekNumbers: true,
        minuteIncrement: 5,
        altInput: true,
        altFormat: 'l j.F Y, H:i',
        minDate: this.MinGetDate(5),
        maxDate: this.MaxGetDate(14),
        onChange: (date)=>{
        this.form.get('Startdate').patchValue(new Date(Date.parse(date)).toISOString());
        }
        }

    public MaxGetDate(addDate) {

        const dt = new Date();
        return new Date(dt.setDate(dt.getDate() + addDate));
    }

    public MinGetDate(addMinutes) {
        const dt = new Date();
        return new Date(dt.setHours(dt.getHours(), dt.getMinutes() + addMinutes, 0, 0));
    }


    onSearchChanged(hostParameter) {

        if (!hostParameter) {
            return;
        }

        if (hostParameter.HostID) {
            this.nosnapshot = false;
            this.dataService.GetCIRelations(hostParameter.HostID).pipe(
                takeUntil(this.destroy$)).subscribe(datas => {

                    if (datas && datas.Category) {
                        for (let category of datas.Category) {

                            if (category.CATEGORY == 'NO-SNAPSHOT') {
                                this.nosnapshot = true;

                            } if (this.nosnapshot) {
                                this.form.get('NoSnapshot').setValue(null);
                                this.cref.markForCheck();
                            }

                        }
                    } else {
                        this.nosnapshot = false;
                        this.form.get('NoSnapshot').setValue(false);
                        this.cref.markForCheck();

                    }

                });
        }

        //this.form.reset();
        this.form.get('Hostid').setValue(hostParameter.HostID);
        this.form.get('Hostname').setValue(hostParameter.Hostname);
        this.form.get('Customer').setValue(hostParameter.Customer);

        this.form.get('NoSnapshot').setValue(false);

        this.HostId = hostParameter.HostID;
        this.info = hostParameter;

    }

    ngOnDestroy() {
        this.destroy$.next();
    }


    // TODO: update ContactInfo => use shared InfoMailSharedModule
    // TODO: update ng2-flatpickr => use shared Module
    private BuildForm() {

        this.form = this.fb.group({
            Hostid: ['', Validators.required],
            Hostname: ['', Validators.required],
            Startdate: ['', Validators.required],
            Customer: ['', Validators.required],
            CustomerName: ['', Validators.required],
            Agree: ['', Validators.required],
            Confirm: ['', Validators.required],
            ContactInfo: ['', Validators.required],
            NoSnapshot: [false, Validators.required],
            withMemoryValue:[true, Validators.required]

        });

        this.formControlValueChanges(this.form);

    }

    isFormElementRequired(elementName: string) {
        return this.validationService.validatorConfigList.get(elementName)
            ? (this.validationService.validatorConfigList.get(elementName).required || this.validationService.validatorConfigList.get(elementName).requiredTrue)
            : false;
    }
    formControlValueChanges(fg: FormGroup) {

        this.form.get('Customer').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(customer => {

            if (customer) {
                this.CustomerName$ = this.dataService.GetCustomerSM9Name(customer);
                this.CustomerName$.pipe(takeUntil(this.destroy$)).subscribe(res => {
                    if (res) {
                        this.form.get('CustomerName').patchValue(res['sm9name'])
                    } else {
                        this.form.get('CustomerName').patchValue('')
                    }
                })

            }
        })

        this.form.get('Startdate').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(val => {
            if(val){

                this.startdateidentifier = new Date(Date.parse(val)).toLocaleString()

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
        console.log(httpParams);
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
            identifier: `${model.Hostname} - ${this.startdateidentifier}`
        };
    }

    Feedback(): FeedbackRequestPayload {

        return this.form.value;
    }


}

