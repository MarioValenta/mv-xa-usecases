import { Component, Inject, Input, OnInit, Output } from '@angular/core';
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

  @Input() selection: string = 'multiple';
  @Input() invokeFunctionName: string = '';
  @Input() rowSelection;
  @Input() searchFields: Array<SearchField> = [];
  @Input() myStyle: string = '';
  private httpParamsFields: string = 'fields';

  constructor(private context: XAModalPageContext<any>, @Inject(XASERVICE_TOKEN) private xaservices: XAServices) {


  }

  ngOnInit() {
    if (this.context.Data.parentContext.ConfigPayload.searchcomponent) {
      this.myStyle = this.context.Data.parentContext.ConfigPayload.searchcomponent.myStyle;
    }
  }

  onSearchChanged(event: any) {
    this.rowSelection = event;
    console.log(this.rowSelection);
  }

  addEntries() {
    if (this.invokeFunctionName) {
      this.context.Invoke(this.invokeFunctionName, this.rowSelection);

    } else {
      throw new Error('Invoke function name not defined.');
    }
  }

  cancelModal() {
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


    httpParams[this.httpParamsFields] = this.searchFields.filter(f => f && !f.HideResult).map(f => f.Name).join(',');
    console.log('httpParams', httpParams);

    // TODO CUSTOMER
    return this.xaservices.Http!.Get<Array<any>>(`api/autopatchcategoryassignment/gethosts/${this.context.Data.parentContext}`, { params: httpParams });
  }


}
