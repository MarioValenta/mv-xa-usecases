import { Component, OnInit, Input, Inject } from '@angular/core';
import { XAModalPageContext } from '@xa/ui';
import { SearchField } from '@xa/search';
import { XAServices, ICERequestContext } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';

@Component({
  selector: 'request-for-change-search-apps',
  templateUrl: './request-for-change-search-apps.component.html',

})
export class RequestForChangeSearchAppsModalComponent implements OnInit {

  constructor(private context: XAModalPageContext<any>, @Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }

  searchfields: Array<string> = ['ApplicationID', 'ApplicationName'];
  resultfields: Array<string> = ['ApplicationID', 'ApplicationName','TBLHOST'];
  selection = 'single';
  rowSelection: any;

  @Input() public Context: ICERequestContext;

  SearchFields: Array<SearchField> = [
    {
      Name: 'SVCID',
      Label: 'ApplicationID'
    },
    {
      Name: 'SVCNAME',
      Label: 'ApplicationName',
      FormatValue: (value) => {

        if (value) {
          return `${value}%`;
        }

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
      Name: 'SVCSUPAPP',
      Label: 'SupportGroup',
      HideInput: true
    },


  ];



  get allowedStatusService() {
    if (this.context.Data.parentContext.ConfigPayload.searchModal) {
      return this.context.Data.parentContext.ConfigPayload.searchModal.allowedStatusService;
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

  ngOnInit() {

  }


  onSearchChanged(event: any) {
    this.rowSelection = event;
  }

  AddCIs() {
    this.context.Invoke('AddCIs', this.rowSelection);
    this.context.Close();
  }

  Cancel() {
    this.context.Close();
  }

  filter = (data: any) => {
    return this.allowedStatusService.includes(data.HSTATUS && data.HSTATUS.toUpperCase());
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
    httpParams['allowedStatus'] = this.allowedStatusService.toString();

    return this.xaservices.Http!.Get<Array<any>>('api/feature/cmdbsearch/Service?fields=SVCSUP', { params: httpParams });
  }
}
