import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { SearchField } from '@xa/search';
import { XAServices, ICERequestContext } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';

@Component({
  selector: 'search-cis',
  templateUrl: './search-cis.component.html',
})
export class SearchCisModalComponent implements OnInit {

  selection = 'multiple';
  rowSelection;
  SearchFields: Array<SearchField> = [];
  myStyle = { "height": "400px" };

  @Input() context: ICERequestContext;
  @Output() selectedRow = new EventEmitter<string>();

  constructor(@Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }

  ngOnInit() {
    if (this.context.ConfigPayload.searchcomponentColumns) {
      this.SearchFields = this.context.ConfigPayload.searchcomponentColumns;

      this.SearchFields.forEach(element => {
        if (element['UseFormatValue']) {
          element['FormatValue'] = (value) => {
            if (value.startsWith('!'))
              return value.substring(1);

            if (value.includes('*') || value.includes('%')) {
              return value;
            }
            return `*${value}*`;
          }
        }
      });
    }
  }

  onSearchChanged(event) {
    if (event) {
      this.rowSelection = event[0];
      this.selectedRow.emit(this.rowSelection);
      console.log(this.rowSelection);
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

    const showFields = this.SearchFields.filter(f => f && !f.HideResult).map(f => f.Name).join(',');
    httpParams['fields'] = showFields;
    if (this.context.ConfigPayload.allowedStatus) {
      httpParams['allowedStatus'] = this.context.ConfigPayload.allowedStatus.toString();
    }

    return this.xaservices.Http!.Get<Array<any>>('api/cmdb/hosts', { params: httpParams });
  }
}
