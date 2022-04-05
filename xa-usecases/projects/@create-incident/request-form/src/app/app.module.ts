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
import { windowFactory, XASERVICE_TOKEN } from 'projects/shared.functions';
import { XAToastDefaults } from 'projects/shared/toast-config';
import { SharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';
import { CiTableComponent } from '../../shared/ci-table/ci-table.component';
import { RequestForChangeSearchAppsModalComponent } from '../../shared/modals/search-apps-dialog/request-for-change-search-apps.component';
import { RequestForChangeSearchCisModalComponent } from '../../shared/modals/search-cis-dialog/request-for-change-search-cis.component';
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
    ShowErrorsModule,
    environment.production ? [] : SharedModule,
    UiAttachmentsUploadModule,
    InfoMailShareModule,
    SearchModule
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
  entryComponents: [
    AppComponent,
    RequestForChangeSearchAppsModalComponent,
    CiTableComponent,
    RequestForChangeSearchCisModalComponent
  ],
  exports: [AppComponent]
})

export class CreateIncidentRequestFormAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('create-incident-request-form', ce);
  }
}
