import 'ag-grid-enterprise';

import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AllCellEditors, AllCellRenderers } from '@xa/grid';
import { ShowErrorsModule } from '@xa/show-errors';
import { XAModalService, XAUIModule } from '@xa/ui';
import { AgGridModule } from 'ag-grid-angular';
import { NouisliderModule } from 'ng2-nouislider';
import { windowFactory, XASERVICE_TOKEN } from 'projects/shared.functions';
import { XAToastDefaults } from 'projects/shared/toast-config';
import { XAGridComponent } from 'projects/shared/xa-grid/xa-grid.component';
import { SharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    XAGridComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    XAUIModule.forRoot(),
    AgGridModule.withComponents([
      ...AllCellEditors,
      ...AllCellRenderers
    ]),
    NouisliderModule,
    ShowErrorsModule,
    SharedModule
  ],
  entryComponents: [
    AppComponent,
    XAGridComponent,
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
  ],
  exports: [
    AppComponent
  ],
  bootstrap: []
})
export class SapStartupRequestFormAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('sap-startup-request-form', ce);
  }
}
