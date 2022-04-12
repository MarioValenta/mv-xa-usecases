import { Injectable } from '@angular/core';
import { XAModalService, XAModalPageBuilder, XAModalPageContext } from '@xa/ui';
import { SearchCisModalComponent } from './search-cis-dialog/search-cis.component';
import { ICERequestContext } from '@xa/lib-ui-common';

@Injectable({
  providedIn: 'root'
})
export class SearchCIModalService {

  constructor(private modalService: XAModalService) { }

  public OpenHostSearchComponent(
    value: any,
    parentContext: ICERequestContext,
    func: ((context: XAModalPageContext<any>) => any),
    selectionMode: string
  ) {

    const page = new XAModalPageBuilder()
      .FromComponent('AddCIs', SearchCisModalComponent)
      .SetTop(parentContext.ConfigPayload.searchcomponent.top)
      .SetWidth(parentContext.ConfigPayload.searchcomponent.width)
      .AddInvokeMethodBehaviour('AddCIs', func);

    const context = {
      description: `Add CIs`,
      parentContext: parentContext,
      selectionMode: selectionMode
    };

    this.modalService.CreateModal().AddPage(page).Open('AddCIs', context);

  }
}
