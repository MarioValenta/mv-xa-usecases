import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ICERequestContext, ICERequest, XAServices, FeedbackRequestPayload } from '@xa/lib-ui-common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StorageParameters } from './models/storage-parameters.model';
import { DataService } from './data-service.service';
import { SearchField } from '@xa/search';
import { XASERVICE_TOKEN } from 'projects/shared.functions';

@Component({
    selector: 'storage-extension-request-form',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements ICERequest, OnInit, OnDestroy {

    @Input() public Context: ICERequestContext;

    form: FormGroup;

    Mountpoint = '[Mountpoint]';
    extensionTo: number;
    tableStorageType: string;
    public info = { HostID: '', Hostname: '', Environment: '', Customer: '', Status: '', WBS: '' };
    public HostId: string;

    destroy$ = new Subject();
    constructor(private fb: FormBuilder, private dataService: DataService, @Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }

    ngOnInit() {

        this.BuildForm();

        this.form.statusChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe(status => this.Context.Valid = status);

        this.Context.OnSubmit(() => this.Submit());
        this.Context.OnFeedback(() => this.Feedback());

        if (this.Context.Payload) {
            this.form.patchValue(this.Context.Payload);
        }

    }



    ngOnDestroy() {
        this.destroy$.next();
    }

    private BuildForm() {

        this.form = this.fb.group({
            HostId: ['', Validators.required],
            Hostname: ['', Validators.required],
            Customer: [''],
            Storage: this.fb.group({
                Mountpoint: [''],
                Filesystem: [''],
                Device: [''],
                SizeGB: [0]
            }),
            needSANextension: [false],
            SANLUNpath: { disabled: true, value: '' },
            OS: [''],
            ExtensionBy: ['', [Validators.required, Validators.min(0.1), Validators.pattern(/^\d*(\.\d+)?$/)]],
            ExtensionTo: [''],
            StorageType: [''],
            StorageMountpoint: [''],
            StorageFilesystem: [''],
            StorageDevice: [''],
            StorageSizeGB: [''],
        });

    }

    onGridChanged(storageParameter: StorageParameters) {
        this.form.get('Storage').setValue(storageParameter);
        this.Mountpoint = this.form.get('Storage').get('Mountpoint').value;

        if(this.form.get('OS').value == 'Windows'){
            var str = this.Mountpoint.replace(/\\/g, '');
            this.form.get('StorageMountpoint').patchValue(str);
        }else{
            this.form.get('StorageMountpoint').patchValue(this.Mountpoint);
        }

        this.form.get('StorageFilesystem').patchValue(this.form.get('Storage').get('Filesystem').value);
        this.form.get('StorageDevice').patchValue(this.form.get('Storage').get('Device').value);
        this.form.get('StorageSizeGB').patchValue(this.form.get('Storage').get('SizeGB').value);
        this.form.get('needSANextension').setValue(false);
        this.form.get('SANLUNpath').disable();
        this.form.get('ExtensionBy').setValue(0);
        this.extensionTo = Number(storageParameter.SizeGB);
        this.form.get('ExtensionTo').setValue(this.extensionTo);

        if (storageParameter.Device === 'Hitachi-SAN') {
            this.form.get('StorageType').setValue('SAN');
            this.tableStorageType = 'SAN';
        } else if (storageParameter.Filesystem.substr(0, 3) === 'nfs') {
            this.form.get('StorageType').setValue('NFS');
            this.tableStorageType = 'NFS';
        } else if (storageParameter.Filesystem === 'iSCSI') {
            this.form.get('StorageType').setValue('iSCSI');
            this.tableStorageType = 'iSCSI';
        } else {
            this.form.get('StorageType').setValue('VMDK');
            this.tableStorageType = 'VMDK';
        }


    }

    onSearchChanged(hostParameter) {

        if (!hostParameter) {
            return;
        }

        this.form.reset();
        this.dataService.GetOSofCI(hostParameter.HostID).subscribe(data => {
            this.form.get('OS').patchValue(data.OS);
        });

        this.form.get('HostId').setValue(hostParameter.HostID);
        this.form.get('Customer').setValue(hostParameter.Customer);
        this.form.get('Hostname').setValue(hostParameter.Hostname);
        this.HostId = hostParameter.HostID;

        this.info = hostParameter;
    }

    onSANcheckBoxClicked() {
        if (this.form.get('needSANextension').value) {
            // TODO: Implement Disabling of the SearchTable Component
            this.form.get('SANLUNpath').enable();
            this.form.get('StorageType').setValue('SAN');
            this.Mountpoint = 'specified SAN LUN';
        } else {
            this.form.get('SANLUNpath').disable();
            this.form.get('StorageType').setValue(this.tableStorageType);
            this.Mountpoint = '[Mountpoint]';
        }
    }

    recalculateExtension() {
        const extensionBy: number = Number(this.form.get('ExtensionBy').value);

        if (extensionBy && extensionBy > 0) {
            this.form.get('ExtensionTo').setValue((this.extensionTo + extensionBy).toFixed(2));
        } else {
            this.form.get('ExtensionTo').setValue(this.extensionTo);
        }
    }

    Feedback(): FeedbackRequestPayload {

        return this.form.value;
    }

    Submit() {

        if (this.form.valid) {
            console.debug(this.form.value);
        } else {
            console.error('Form is not valid', this.form);
        }

        const model = this.form.value;

        return {
            value: model,
            identifier: `${model.Hostname}_${model.Storage.Mountpoint}`
        };
    }

    allowedStatus = [
        "ACTIVE",
        "BASE_INSTALLED",
        "READY_FOR_SERVICE",
        "EXPERIMENTAL",
        "INFOALERTING"
    ];

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
                return `${value}*`;
            }
        },
        {
            Name: 'HENVIRONMENT',
            Label: 'Environment',
            Type: 'select',
            Options: this.dataService.GetEnvironments(),
            Placeholder: "Environment",
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
            Placeholder: "Select Customer"
        },
        {
            Name: 'HSTATUS',
            Label: 'Status',
            Type: 'select',
            Options: () => (this.Context && this.Context.ConfigPayload.AllowedStatus) || this.allowedStatus,
            Placeholder: "Status",
            Width: '15em',
            HideInput: false
        },
        {
            Name: 'HKTR',
            Label: 'WBS',
            HideInput: true
        }
    ]

    filter = (data: any) => {
        return (this.Context.ConfigPayload.AllowedStatus || this.allowedStatus).includes(data.HSTATUS && data.HSTATUS.toUpperCase())
    }

    searchFunction = (data: any) => {

        let httpParams = Object.keys(data).reduce((curr, next) => {
            const val = data[next] as string;
            if (val && val.trim()) {
                curr[next] = val;
            }
            return curr;
        }, {});

        const showFields = this.SearchFields.filter(f => f && !f.HideResult).map(f => f.Name).join(',')
        httpParams['fields'] = showFields;
        return this.xaservices.Http!.Get<Array<any>>('api/feature/cmdbsearch/host', { params: httpParams })
    }
}
