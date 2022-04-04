import { Component, Inject, OnInit } from '@angular/core';
import { XAModalPageContext } from '@xa/ui';
import { SearchField } from '@xa/search';
import { XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';

@Component({
  selector: 'app-request-for-change-search-cis',
  templateUrl: './request-for-change-search-cis.component.html'
})
export class RequestForChangeSearchCisModalComponent implements OnInit {

  searchfields: Array<string> = ['HostID', 'Hostname'];
  resultfields: Array<string> = ['HostID', 'Hostname'];
  selection = 'multiple';
  rowSelection: any;

  constructor(private context: XAModalPageContext<any>, @Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }


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
      Name: 'HSUP',
      Label: 'SupportGroup',
      HideInput: true
    },
    // {
    //   Name: 'CUSTOMERSCOPE',
    //   Label: 'Country',
    //   HideInput: true
    // },
    {
      Name: 'HFKEY',
      Label: 'FKey',
      HideInput: true,
      HideTable: true
    }

  ]

  ngOnInit() {

  }

  onSearchChanged(event) {
    this.rowSelection = event;
  }

  AddCIs() {
    this.context.Invoke('AddCIs', this.rowSelection);
    this.context.Close();
  }

  Cancel() {
    this.context.Close();
  }

  get allowedStatusHost() {
    if (this.context.Data.parentContext.ConfigPayload.searchModal) {
      return this.context.Data.parentContext.ConfigPayload.searchModal.allowedStatusHost;
    } else {
      return [
        'ACTIVE',
        'BASE_INSTALLED',
        'READY_FOR_SERVICE',
        'EXPERIMENTAL',
        'INFOALERTING'
      ];
    }
  }

  filter = (data: any) => {
    return this.allowedStatusHost.includes(data.HSTATUS && data.HSTATUS.toUpperCase());
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
    httpParams['allowedStatus'] = this.allowedStatusHost.toString();

    return this.xaservices.Http!.Get<Array<any>>('api/cmdb/alpinehosts', { params: httpParams });
  }
}
