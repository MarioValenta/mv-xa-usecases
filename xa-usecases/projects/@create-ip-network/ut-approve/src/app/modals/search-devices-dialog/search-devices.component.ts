import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { XAModalPageContext } from '@xa/ui';
import { GridApi, ColumnApi, RowValueChangedEvent, RowDataUpdatedEvent } from 'ag-grid-community';
import { GridBuilder } from '@xa/grid';
import { AffectedDevicesInfo } from './model/AffectedDevicesInfo';
import { SearchField } from '@xa/search';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';

@Component({
    templateUrl: './search-devices.component.html',
})
export class SearchDevicesComponent {

    constructor(public context: XAModalPageContext<any>, private fb: FormBuilder, @Inject(XASERVICE_TOKEN) private xaservices: XAServices) {

        this.rowdata = context.Data.selectedDevices || [];
        this.location = context.Data.location;
        this.createForm();

    }

    get formArray() {

        return this.modalForm.controls.Devices as FormArray;
    }


    public description: string;
    modalForm: FormGroup;
    location: string;

    // gridApi and columnApi
    private api: GridApi;
    private columnApi: ColumnApi;
    public rowdata = [];
    public rowArray = [];

    columnDefs = new GridBuilder<any>()
        .AddColumn(
            column => column.DefaultColumn('HostID').SetHeaderName('HostID'),
            column => column.DefaultColumn('HostName').SetHeaderName('Hostname'),
            column => column.DefaultColumn('SupportGroup').SetHeaderName('Support Group'),
            column => column.DefaultColumn('Customer').SetHeaderName('Customer')
        ).Build();

    public row: AffectedDevicesInfo;

    allowedStatus = [
        'ACTIVE',
        'BASE_INSTALLED',
        'READY_FOR_SERVICE',
        'EXPERIMENTAL',
        'INFOALERTING'
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

                if (value.startsWith('!')) {
                    return value.substring(1);
                }

                if (value.includes('*') || value.includes('%')) {
                    return value;
                }
                return `${value}*`;
            }
        },
        {
            Name: 'HSUP',
            Label: 'SupportGroup',
            HideInput: true
        },
        {
            Name: 'HCUST',
            Label: 'Customer',
            HideInput: true
        },
        {
            Name: 'HLOCATION',
            DefaultValue: this.context.Data.location,
            HideInput: true,
            HideTable: true,
        }
    ];

    createForm() {

        this.modalForm = this.fb.group({
            Devices: this.fb.array([])
        });

    }


    onSelection(hostparameter: any) {

        if (hostparameter) {
            this.rowArray = hostparameter.map(it => {
                return {
                    HostID: it.HostID,
                    HostName: it.Hostname,
                    SupportGroup: it.SupportGroup,
                    Customer: it.Customer
                };

            });
        } else{
            hostparameter = []
        }

        console.log(this.rowArray);
    }

    buildForm(element) {
        return this.fb.group({
            HostID: [element.HostID || null],
            HostName: [element.Hostname || null],
            SupportGroup: [element.SupportGroup || null],
            Customer: [element.Customer || null]
        });

    }

    AddSelectedDevices() {

        console.log(this.rowArray)
        this.rowArray.forEach(it => {

            if (this.rowdata.find(r => r.HostID === it.HostID) == null && (it.SupportGroup != null)) {

                this.rowdata = this.rowdata.concat(this.rowArray);

            }

        })


    }

    DeleteSelectedDevices() {
        const selectedrow = this.api.getSelectedRows();
        this.api.updateRowData({ remove: selectedrow });

    }

    onRowValueChanged($event: RowValueChangedEvent) {
        const rowData = [];
        console.debug($event);
        this.api.forEachNode(function (node) {
            rowData.push(node.data);
        });
        this.rowdata = rowData;
    }

    rowDataUpdated($event: RowDataUpdatedEvent) {
        const rowData = [];
        console.debug($event);
        this.api.forEachNode(function (node) {
            rowData.push(node.data);
        });
        this.rowdata = rowData;
    }


    onGridReady(params): void {
        this.api = params.api;
        this.api.hideOverlay();
        this.columnApi = params.columnApi;

        this.api.sizeColumnsToFit();
    }


    Yes() {
        console.debug(this.modalForm.value);
        this.context.Invoke('adddevice', this.rowdata);
        this.context.Close();
        return;

    }

    No() {
        this.context.Close();

    }

    filter = (data: any) => {
        return this.allowedStatus.includes(data.HSTATUS && data.HSTATUS.toUpperCase());
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
        console.log(this.location);
        console.log(showFields);
        return this.xaservices.Http!.Get<Array<any>>('api/feature/cmdbsearch/host', { params: httpParams });
    }


}



