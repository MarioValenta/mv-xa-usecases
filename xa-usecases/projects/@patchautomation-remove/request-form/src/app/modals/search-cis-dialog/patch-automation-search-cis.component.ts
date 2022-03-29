import { Component, Inject, OnInit } from '@angular/core';
import { XAModalPageContext } from '@xa/ui';
import { SearchField } from '@xa/search';
import { XAServices } from '@xa/lib-ui-common';
import { take, share } from 'rxjs/operators';
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

  constructor(public context: XAModalPageContext<any>, @Inject(XASERVICE_TOKEN) private xaservices: XAServices) {

    // TODO refactor this quickfix
    if (context.Data.parentContext.ConfigPayload.columns) {
      context.Data.parentContext.ConfigPayload.columns.forEach(element => {
        if (element.wildcardsearch === true) {
            if (context.Data.processId) {
              this.SearchFields.push({
                Label: element.field,
                Name: element.field,
                HideInput: true,
                FormatValue: (value) => {
                  if (value.startsWith('!')) {
                    return value.substring(1);
                  }
                  if (value.includes('*') || value.includes('%')) {
                    return value;
                  }
                  return `${value}*`;
                }
              });
            }
            else {
              this.SearchFields.push({
                Label: element.field, Name: element.field, FormatValue: (value) => {
                  if (value.startsWith('!')) {
                    return value.substring(1);
                  }
                  if (value.includes('*') || value.includes('%')) {
                    return value;
                  }
                  return `${value}*`;
                }
              });
            }

        } else {
          if (context.Data.processId) {
            this.SearchFields.push({
              Label: element.field,
              Name: element.field,
              HideInput: true
            });
          } else {
            this.SearchFields.push({
              Label: element.field,
              Name: element.field
            });
          }
        }
      }
      );
    }
  }


  ngOnInit() {
    if (this.context.Data.parentContext.ConfigPayload.searchcomponent) {
      this.myStyle = this.context.Data.parentContext.ConfigPayload.searchcomponent.myStyle;
    }
  }

  onSearchChanged(event: any) {
    this.rowSelection = event;
  }

  onError(errorEvent: any) {
    switch (errorEvent.status) {
      case 404: {
        window.alert('API endpoint could not be found! Please let us know via the feedback button!');
        this.context.Close();
        break;
      } default: {
        window.alert(errorEvent.message);
        this.context.Close();
        break;
      }
    }
  }

  AddCIs() {
    if (this.rowSelection !== undefined && this.rowSelection !== null) {
      this.context.Invoke('AddCIs', this.rowSelection);
      this.context.Close();
    }
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

  searchFunctionById = (data: any) => {
    console.debug('loading hosts... ');
    console.debug('processID', this.context.Data.processId);
    return this.xaservices.Http!.Get<Array<any>>(`api/patchautomation/${this.context.Data.processId}/hosts`).pipe(
      take(1),
      share()
    );
  }

}
