import { Injectable } from '@angular/core';
import { XAModalService, XAModalPageBuilder, XAModalPageContext } from '@xa/ui';
import { PatchAutomationSearchCisModalComponent } from './search-cis-dialog/patch-automation-search-cis.component';
import { ICERequestContext } from '@xa/lib-ui-common';
import { ITaskContext } from 'projects/xa-portal-dev/src/app/user-tasks/ce-tasks/interfaces/i-task-context';
import { XAModalPage } from '@xa/ui/lib/components/xa-modal/xa-modal-page';
import { SearchField } from '@xa/search';

export type ModalContext = {
  description: string;
  parentContext: ICERequestContext | ITaskContext;
  searchFields: Array<SearchField>;
}

@Injectable({
  providedIn: 'root'
})
export class SearchCIModalService {

  private _searchFields: Array<SearchField> = [];

  constructor(private modalService: XAModalService) { }

  set searchFields(value:Array<SearchField>) {
    this._searchFields = value;
  }

  get searchFields(): Array<SearchField> {
    return this._searchFields;
  }

  public OpenHostSearchComponent(modalName: string, page: XAModalPage<unknown>, context: ModalContext) {
  this.modalService.CreateModal().AddPage(page).Open(modalName, context);

}

}
