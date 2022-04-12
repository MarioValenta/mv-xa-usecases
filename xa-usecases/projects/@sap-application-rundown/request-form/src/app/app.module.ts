import 'ag-grid-enterprise';

import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AllCellEditors, AllCellRenderers, XAGridHelperModule } from '@xa/grid';
import { XAServices } from '@xa/lib-ui-common';
import { SearchModule } from '@xa/search';
import { ShowErrorsModule } from '@xa/show-errors';
import { XAModalService, XAUIModule } from '@xa/ui';
import { AgGridModule } from 'ag-grid-angular';
import { XAToastDefaults } from 'projects/shared/toast-config';
import { SharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';

import { AppComponent } from './app.component';
import { CiTableComponent } from './ci-table/ci-table.component';
import { CiTableDataService } from './ci-table/ci-table.data.service';
import { InfoTableComponent } from './infotable-component/infotable.component';
import { SearchCisModalComponent } from './modals/search-cis-dialog/search-cis.component';
import { SearchCIModalService } from './modals/searchCI-modal.service';
import { DataService } from './service/data.service';
import { XASERVICE_TOKEN, windowFactory } from 'projects/shared.functions';

@NgModule({
  declarations: [
    AppComponent,
    CiTableComponent,
    SearchCisModalComponent,
    InfoTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    XAGridHelperModule,
    AgGridModule.withComponents([
      ...AllCellEditors,
      ...AllCellRenderers
    ]),
    XAUIModule.forRoot(),
    ShowErrorsModule,
    SearchModule,
    SharedModule
  ],
  providers: [
    {
      provide: XASERVICE_TOKEN,
      useFactory: windowFactory
    },
    XAModalService,
    {
      provide: 'XANotifyToastConfig',
      useValue: XAToastDefaults
    },
    SearchCIModalService,
    CiTableDataService,
  ],
  entryComponents: [
    AppComponent,
    CiTableComponent,
    SearchCisModalComponent,
    InfoTableComponent
  ],
  exports: [
    AppComponent,
    CiTableComponent,
    SearchCisModalComponent,
    InfoTableComponent,
  ],
  bootstrap: []
})
export class SapApplicationRundownRequestFormAppModule {
  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('sap-application-rundown-request-form', ce);
  }
}
