import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { AppComponent } from './app.component';
import { UiAttachmentsUploadModule, InfoMailShareModule } from '@xa/lib-ui-common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { XAUIModule, XAModalService } from '@xa/ui';
import { ValidationService } from '@xa/validation';
import { ShowErrorsModule } from '@xa/show-errors';
import { AgGridModule } from 'ag-grid-angular';
import { XAToastDefaults } from 'projects/shared/toast-config';
import { XAGridHelperModule } from '@xa/grid';
import { environment } from '../environments/environment';
import 'ag-grid-enterprise';
import { SharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';
import { XASERVICE_TOKEN, windowFactory } from 'projects/shared.functions';
import { RequestForChangeSearchAppsModalComponent } from '../../shared/modals/search-apps-dialog/request-for-change-search-apps.component';
import { CiTableComponent } from '../../shared/ci-table/ci-table.component';
import { RequestForChangeSearchCisModalComponent } from '../../shared/modals/search-cis-dialog/request-for-change-search-cis.component';
import { SearchModule } from '@xa/search';


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

    XAModalService,
    ValidationService
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

  constructor(private injector: Injector) {

  }

  ngDoBootstrap() {

    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('create-incident-request-form', ce);
  }
}
