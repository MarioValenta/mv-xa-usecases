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
import { Ng2FlatpickrComponent } from './ng2-flatpickr/ng2-flatpickr.component';
import { Ng2FlatpickrDirective } from './ng2-flatpickr/ng2-flatpickr.directive';
import 'ag-grid-enterprise';
import { XAToastDefaults } from '../toast-config';
import { ValidationService } from '@xa/validation';
import { ShowErrorsModule } from '@xa/show-errors';
import { environment } from '../environments/environment';
import { SharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';
import { PipeModule } from 'projects/shared/pure-pipes/pipe.module';
import { AttachmentUploadComponent } from 'projects/shared/attachmentupload-component/AttachmentUpload.component';
import { CiTableComponent } from 'projects/@create-rfc/ci-table/ci-table.component';


@NgModule({
  declarations: [
    AppComponent,
    RequestForChangeSearchAppsModalComponent,
    CiTableComponent,
    RequestForChangeSearchCisModalComponent,
    Ng2FlatpickrComponent,
    Ng2FlatpickrDirective,
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
    PipeModule
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
    AppComponent,
    Ng2FlatpickrComponent,
    Ng2FlatpickrDirective
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
