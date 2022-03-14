import { Injectable } from '@angular/core';
import { XAModalService, XAModalPageBuilder, XAModalPageContext } from '@xa/ui';
import { PatchAutomationSearchCisModalComponent } from './search-cis-dialog/patch-automation-search-cis.component';
import { ICERequestContext } from '@xa/lib-ui-common';

@Injectable({
  providedIn: 'root'
})
export class SearchCIModalService {

  constructor(private modalService: XAModalService) { }

  public OpenHostSearchComponent(value: any, processId: String, parentContext: ICERequestContext, func: ((context: XAModalPageContext<any>) => any)) {

    const page = new XAModalPageBuilder()
      .FromComponent('AddCIs', PatchAutomationSearchCisModalComponent)
      .SetTop(parentContext.ConfigPayload.searchcomponent.top)
      .SetWidth(parentContext.ConfigPayload.searchcomponent.width)
      .AddInvokeMethodBehaviour('AddCIs', func);

    const context = {
      description: `Add CIs`,
      parentContext: parentContext,
      type: value,
      processId: processId
    };

    this.modalService.CreateModal().AddPage(page).Open('AddCIs', context);
  }
}
