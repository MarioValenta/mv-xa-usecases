import 'ag-grid-enterprise';

import { CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AllCellEditors, AllCellRenderers } from '@xa/grid';
import { SearchModule } from '@xa/search';
import { ShowErrorsModule } from '@xa/show-errors';
import { XAModalService, XAUIModule } from '@xa/ui';
import { AgGridModule } from 'ag-grid-angular';
import { windowFactory, XASERVICE_TOKEN } from 'projects/shared.functions';

import { AppComponent } from './app.component';
import { ApprovaltaskTableComponent } from './approvaltask-table.1.0.0.component';
import { SearchDevicesComponent } from './modals/search-devices-dialog/search-devices.component';

@NgModule({
  declarations: [
    AppComponent,
    ApprovaltaskTableComponent,
    SearchDevicesComponent
  ],
  imports: [
    BrowserModule,
    XAUIModule.forRoot(),
    ReactiveFormsModule,
    AgGridModule,
    AgGridModule.withComponents([
      ...AllCellEditors,
      ...AllCellRenderers,]),
    BrowserAnimationsModule,
    SearchModule,
    ShowErrorsModule
  ],
  exports: [
    AppComponent,
    ApprovaltaskTableComponent],
  providers: [
    {
      provide: XASERVICE_TOKEN,
      useFactory: windowFactory
    },
    XAModalService
  ],
  entryComponents: [
    AppComponent,
    ApprovaltaskTableComponent,
    SearchDevicesComponent
  ],
  bootstrap: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class CreateIPNetworkUTApproveAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('create-ip-network-ut-approve', ce);
  }
}
