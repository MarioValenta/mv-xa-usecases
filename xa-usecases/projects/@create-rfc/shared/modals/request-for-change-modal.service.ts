import { Injectable } from '@angular/core';
import { XAModalService, XAModalPageBuilder, XAModalPageContext } from '@xa/ui';
import { RequestForChangeSearchAppsModalComponent } from './search-apps-dialog/request-for-change-search-apps.component';
import { RequestForChangeSearchCisModalComponent } from './search-cis-dialog/request-for-change-search-cis.component';
import { ICERequestContext } from '@xa/lib-ui-common';

@Injectable({
  providedIn: 'root'
})
export class RequestForChangeModalService {

  constructor(private modalService: XAModalService) { }

  public OpenHostSearchComponent(value: any, parentContext: ICERequestContext, func: ((context: XAModalPageContext<any>) => any)) {

    const page = new XAModalPageBuilder()
      .FromComponent('AddCIs', RequestForChangeSearchCisModalComponent)
      .SetTop('50px')
      .SetWidth('50%')
      .AddInvokeMethodBehaviour('AddCIs', func);

    const context = {
      description: `Add CIs`,
      parentContext: parentContext
    };

    this.modalService.CreateModal().AddPage(page).Open('AddCIs', context);
  }

  public OpenAppSearchComponent(value: any, parentContext: ICERequestContext, func: ((context: XAModalPageContext<any>) => any)) {

    const page = new XAModalPageBuilder()
      .FromComponent('AddCIs', RequestForChangeSearchAppsModalComponent)
      .SetTop('50px')
      .SetWidth('50%')
      .AddInvokeMethodBehaviour('AddCIs', func);

    const context = {
      description: `Add Applications`,
      parentContext: parentContext
    };

    this.modalService.CreateModal().AddPage(page).Open('AddCIs', context);
  }
}
