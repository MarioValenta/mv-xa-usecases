import { Component, OnInit, Input, Inject } from '@angular/core';
import { XAModalPageContext } from '@xa/ui';
import { SearchField } from '@xa/search';
import { XAServices } from '@xa/lib-ui-common';
import {environment} from "../../../environments/environment";
import { XASERVICE_TOKEN } from 'projects/shared.functions';

@Component({
  selector: 'search-cis',
  templateUrl: './search-cis.component.html',
})
export class SearchCisModalComponent implements OnInit {

  selection = 'multiple';
  rowSelection;
  SearchFields: Array<SearchField> = [];
  myStyle = '';
  addButtonText = 'add';

  constructor(private context: XAModalPageContext<any>, @Inject(XASERVICE_TOKEN) private xaservices: XAServices) {

    if (context.Data.parentContext.ConfigPayload.searchcomponentColumns) {
      this.SearchFields = context.Data.parentContext.ConfigPayload.searchcomponentColumns;

      this.SearchFields.forEach(element => {
        if (element['UseFormatValue']) {
          element['FormatValue'] = (value) => {
            if (value.startsWith('!')) {
              return value.substring(1);
            }

            if (value.includes('*') || value.includes('%')) {
              return value;
            }
            return `*${value}*`;
          };
        }
      });
    }
    this.selection = context.Data.selectionMode;
  }

  ngOnInit() {
    if (this.context.Data.parentContext.ConfigPayload.searchcomponent) {
      this.myStyle = this.context.Data.parentContext.ConfigPayload.searchcomponent.myStyle;
    }
    if (this.context.Data.parentContext.ConfigPayload.searchModal.addButtonText) {
      this.addButtonText = this.context.Data.parentContext.ConfigPayload.searchModal.addButtonText;
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
    if (this.context.Data.parentContext.ConfigPayload.allowedStatus) {
      httpParams['allowedStatus'] = this.context.Data.parentContext.ConfigPayload.allowedStatus.toString();
    }

    if (this.context.Data.parentContext.ConfigPayload.allowedPlatforms) {
      httpParams['allowedPlatforms'] = this.context.Data.parentContext.ConfigPayload.allowedPlatforms.toString();
    }
    return this.xaservices.Http!.Get<Array<any>>('api/cmdb/hosts', { params: httpParams });
  }
}
