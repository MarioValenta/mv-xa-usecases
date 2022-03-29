import { Component, Inject, OnInit } from '@angular/core';
import { XAModalPageContext } from '@xa/ui';
import { SearchField } from '@xa/search';
import { XAServices } from '@xa/lib-ui-common';
import { environment } from '../../../environments/environment';
import { XASERVICE_TOKEN } from 'projects/shared.functions';

@Component({
  selector: 'app-patch-automation-search-cis',
  templateUrl: './patch-automation-search-cis.component.html'
})
export class PatchAutomationSearchCisModalComponent implements OnInit {

  selection = 'multiple';
  rowSelection;
  SearchFields: Array<SearchField> = [];
  myStyle = '';
  private httpParamsFields = 'fields';

  constructor(private context: XAModalPageContext<any>, @Inject(XASERVICE_TOKEN) private xaservices: XAServices) {

    if (context.Data.parentContext.ConfigPayload.columns) {
      context.Data.parentContext.ConfigPayload.columns.forEach(element => {
        if (element.wildcardsearch === true) {
          this.SearchFields.push({
            Label: element.field, Name: element.searchField, FormatValue: (value) => {
              if (value.startsWith('!')) {
                return value.substring(1);
              }
              if (value.includes('*') || value.includes('%')) {
                return value;
              }
              return `${value}*`;
            }
          });
        } else {
          this.SearchFields.push({ Label: element.field, Name: element.searchField });
        }
      });
    }
  }

  ngOnInit() {
    if (this.context.Data.parentContext.ConfigPayload.searchcomponent) {
      this.myStyle = this.context.Data.parentContext.ConfigPayload.searchcomponent.myStyle;
    }
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

  filterSearchFields = (data: any) => {
    if (this.context.Data.parentContext.ConfigPayload.allowedStatus) {
      return (this.context.Data.parentContext.ConfigPayload.allowedStatus).includes(data.HSTATUS && data.HSTATUS.toUpperCase());
    } else {
      return true;
    }
  }

  searchFunction = (data: any) => {
    const httpParams = Object.keys(data).reduce((curr, next) => {
      const val = data[next] as string;
      if (val && val.trim()) {
        curr[next] = val;
      }
      return curr;
    }, {});


    httpParams[this.httpParamsFields] = this.SearchFields.filter(f => f && !f.HideResult).map(f => f.Name).join(',');
    console.log('httpParams', httpParams);
    return this.xaservices.Http!.Get<Array<any>>(environment.hostEndpointUrl, { params: httpParams });
  }


}
