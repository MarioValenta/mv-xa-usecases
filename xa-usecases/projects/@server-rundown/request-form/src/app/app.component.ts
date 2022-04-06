import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackRequestPayload, ICERequest, ICERequestContext, XAServices } from '@xa/lib-ui-common';
import { SearchField } from '@xa/search';
import { XANotifyService } from '@xa/ui';
import { ValidationService } from '@xa/validation';
import Lightpick from 'lightpick';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DataService } from './data.service';


@Component({
    selector: 'server-rundown-request-form',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements ICERequest, OnInit, OnDestroy {

    @Input() public Context!: ICERequestContext;

    form!: FormGroup;
    HostId!: string;
    info = { HostID: '', Hostname: '', Environment: '', Customer: '', Status: '', WBS: '' };
    StartDateMin = new Date();
    destroy$ = new Subject<any>();
    domlayout = 'autoHeight';
    EntriesHost!: [];
    hostfields = {
        1: { header: 'Hostid', fields: 'HOSTID' },
        2: { header: 'Hostname', fields: 'HOSTNAME' },
        3: { header: 'Hostmodel', fields: 'HMODEL' },
        4: { header: 'Hostmodelnr', fields: 'HMODELNR' },
        5: { header: 'Predlabel', fields: 'PREDLABEL' },
        6: { header: 'Status', fields: 'HSTATUS' },
        7: { header: 'Support', fields: 'HSUP' }
    };

    EntriesService!: [];
    servicefields = {
        1: { header: 'ID', fields: 'ID' },
        2: { header: 'Name', fields: 'Name' },
        3: { header: 'predicate', fields: 'predicate' },
        4: { header: 'Class', fields: 'Class' },
        5: { header: 'Type', fields: 'Type' },
        6: { header: 'Status', fields: 'Status' },
        7: { header: 'Support', fields: 'Support' },
        8: { header: 'Environment', fields: 'Environment' }
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
            HideTable: true
        }
    ];

    allowedStatus = [
        'RUNDOWN',
        'ACTIVE',
        'BASE_INSTALLED',
        'READY_FOR_SERVICE',
        'EXPERIMENTAL',
        'INFOALERTING',
        'HOSTING'
    ];

    allowedPlatforms = [
        'SRV_X86_VM',
        'SRV_APPLIANCE_VM'
    ];


    constructor(private fb: FormBuilder,
        private dataService: DataService,
        @Inject(XASERVICE_TOKEN) private xaservices: XAServices,
        private cref: ChangeDetectorRef,
        private validationService: ValidationService,
        private notifyService: XANotifyService) {
    }

    public GetFormControl(name: string): AbstractControl | null {
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

        //  format: 'YYYY-MM-DDTHH:mm:ss.sssZ',

        const picker = new Lightpick({
            field: document.getElementById('datepicker'),
            format: 'DD.MM.YYYY',
            singleDate: true,
            onSelect: (date) => {
                this.form.get('RUNDOWN_DATE')!.patchValue(`${date.format('DD.MM.YYYY')}`);
                this.cref.markForCheck();
            }

        });
    }

    onSearchChanged(hostParameter: any) {

        this.EntriesHost = [];
        this.EntriesService = [];
        this.notifyService.clear();

        if (!hostParameter) {
            return;
        } else {

            this.form.reset();
            this.form.get('Id')!.setValue(hostParameter.HostID);
            this.form.get('Hostname')!.setValue(hostParameter.Hostname);
            this.form.get('Customer')!.setValue(hostParameter.Customer);
            this.HostId = hostParameter.HostID;
            this.info = hostParameter;


            if (this.HostId) {

                const successAction = new Observable((observer) => {

                    this.dataService.GetCIRelations(this.HostId).pipe(
                        map(data => {
                            this.EntriesHost = data.Host || [];
                            this.EntriesService = data.Service || [];
                        }),
                        takeUntil(this.destroy$)).subscribe(() => {
                            this.form.get('IsRollback')!.setValue(false);
                            this.form.get('ObjectType')!.setValue('HOST');
                            this.form.get('Backup')!.reset();
                            this.form.get('Reason')!.disable();
                            this.form.get('DaystoKeep')!.setValue('10');
                            this.form.get('DaystoKeep')!.disable();

                            observer.next({
                                title: 'Success',
                                body: this.EntriesHost.length + ' Host and ' + this.EntriesService.length + ' Service Relations data loaded!',
                                config: {
                                    closeOnClick: true,
                                    timeout: 5000,
                                    showProgressBar: true
                                }

                            });

                            observer.complete();
                        });
                });

                this.notifyService.async('Loading Relations ...', successAction);
            }
        }
    }


    keyPress(event: any) {
        const pattern = /[0-9\ ]/;

        const inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode !== 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
    }



    private BuildForm() {

        this.form = this.fb.group({
            Id: ['', Validators.required],
            Hostname: ['', Validators.required],
            RUNDOWN_DATE: ['', Validators.required],
            Customer: [''],
            IsRollback: [false],
            ObjectType: ['HOST'],
            Backup: ['', Validators.required],
            Reason: ['', Validators.required],
            VolumestoKeepLonger: '',
            DaystoKeep: ['10', [Validators.required, Validators.min(10), Validators.max(100)]]

        });

        this.formControlValueChanges(this.form);
        this.form.get('Reason')!.disable();
        this.form.get('DaystoKeep')!.disable();
    }

    formControlValueChanges(fg: FormGroup) {

        fg.get('Backup')!.valueChanges.subscribe(value => {

            if (value === 'AlreadyExistingBackup') {
                fg.get('Reason')!.reset();
                fg.get('Reason')!.disable();
            } else {
                fg.get('Reason')!.enable();
            }

        });

        fg.get('VolumestoKeepLonger')!.valueChanges.subscribe(value => {

            if (!value) {
                fg.get('DaystoKeep')!.disable();
            } else {
                fg.get('DaystoKeep')!.enable();
            }
        });

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
        return this.xaservices.Http!.Get<Array<any>>('api/feature/cmdbsearch/host', { params: httpParams });
    }



    Submit() {

        if (this.form.valid) {
            console.log(this.form.value);
        } else {
            console.error('Form is not valid', this.form);
        }

        const model = this.form.getRawValue();
        const res = this.form.controls['RUNDOWN_DATE'].value.split('.');

        // res[1] - 1 because month is set by index, 0 is January, 1 is February, etc.
        model.RUNDOWN_DATE = new Date(res[2], res[1] - 1, res[0], 12, 0, 0, 0);


        return {
            value: model,
            identifier: `${model.Hostname}_${model.Id}`
        };
    }

    Feedback(): FeedbackRequestPayload {

        return this.form.value;
    }


}

