import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { AppComponent } from './app.component';
import { XAServices } from '@xa/lib-ui-common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { XAUIModule, XAModalService } from '@xa/ui';
import { AgGridModule } from 'ag-grid-angular';
import { SearchModule } from '@xa/search';
import { XAGridHelperModule } from '@xa/grid';
import 'ag-grid-enterprise';
import { XAToastDefaults } from '../toast-config';
import { ValidationService } from '@xa/validation';
import { ShowErrorsModule } from '@xa/show-errors';
import { environment } from '../environments/environment';
import { SharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';
import { AttachmentUploadComponent } from 'projects/@create-rfc/shared/attachmentupload-component/AttachmentUpload.component';
import { CiTableComponent } from 'projects/@create-rfc/shared/ci-table/ci-table.component';
import { RequestForChangeSearchAppsModalComponent } from 'projects/@create-rfc/shared/modals/search-apps-dialog/request-for-change-search-apps.component';
import { RequestForChangeSearchCisModalComponent } from 'projects/@create-rfc/shared/modals/search-cis-dialog/request-for-change-search-cis.component';
import { PipeModule } from 'projects/@create-rfc/shared/pure-pipes/pipe.module';
import { Ng2FlatpickrModule } from 'projects/shared/ng2-flatpickr/ng2-flatpickr.module';


@NgModule({
  declarations: [
    AppComponent,
    RequestForChangeSearchAppsModalComponent,
    CiTableComponent,
    RequestForChangeSearchCisModalComponent,
    AttachmentUploadComponent
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
    Ng2FlatpickrModule
  ],
  providers: [
    {
      provide: XAServices,
      useValue: (window as any).xa
    },
    {
      provide: 'XANotifyToastConfig',
      useValue: XAToastDefaults
    },
    XAModalService,
    ValidationService
  ],
  exports: [
    AppComponent
  ],
  entryComponents: [
    AppComponent,
    RequestForChangeSearchAppsModalComponent,
    CiTableComponent,
    RequestForChangeSearchCisModalComponent,
    AttachmentUploadComponent
  ],
  bootstrap: []
})
export class CreateRfcRequestFormAppModule {

  constructor(private injector: Injector) {

  }

  ngDoBootstrap() {

    //const strategyFactory = new ElementZoneStrategyFactory(VMCreateRequestComponent, this.injector);
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('create-rfc-request-form', ce);

  }
}
