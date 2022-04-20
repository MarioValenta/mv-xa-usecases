import 'ag-grid-enterprise';

import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XAGridHelperModule } from '@xa/grid';
import { InfoMailShareModule, UiAttachmentsUploadModule } from '@xa/lib-ui-common';
import { SearchModule } from '@xa/search';
import { ShowErrorsModule } from '@xa/show-errors';
import { XAModalService, XAUIModule } from '@xa/ui';
import { AgGridModule } from 'ag-grid-angular';
import { CiTableComponent } from 'projects/@create-rfc/shared/ci-table/ci-table.component';
import {
  RequestForChangeSearchAppsModalComponent,
} from 'projects/@create-rfc/shared/modals/search-apps-dialog/request-for-change-search-apps.component';
import {
  RequestForChangeSearchCisModalComponent,
} from 'projects/@create-rfc/shared/modals/search-cis-dialog/request-for-change-search-cis.component';
import { PipeModule } from 'projects/@create-rfc/shared/pure-pipes/pipe.module';
import { windowFactory, XASERVICE_TOKEN } from 'projects/shared.functions';
import { Ng2FlatpickrModule } from 'projects/shared/ng2-flatpickr/ng2-flatpickr.module';
import { XAToastDefaults } from 'projects/shared/toast-config';
import { SharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
    RequestForChangeSearchAppsModalComponent,
    CiTableComponent,
    RequestForChangeSearchCisModalComponent
  ],
  imports: [
    BrowserModule,
    XAUIModule.forRoot(),
    XAGridHelperModule,
    AgGridModule.withComponents([]),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SearchModule,
    ShowErrorsModule,
    environment.production ? [] : SharedModule,
    PipeModule,
    Ng2FlatpickrModule,
    UiAttachmentsUploadModule,
    InfoMailShareModule
  ],
  providers: [
    {
      provide: XASERVICE_TOKEN,
      useFactory: windowFactory
    },
    {
      provide: 'XANotifyToastConfig',
      useValue: XAToastDefaults
    },
    XAModalService
  ],
  exports: [
    AppComponent
  ],
  entryComponents: [
    AppComponent,
    RequestForChangeSearchAppsModalComponent,
    CiTableComponent,
    RequestForChangeSearchCisModalComponent
  ],
  bootstrap: []
})
export class CreateRfcRequestFormAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('create-rfc-request-form', ce);
  }
}
