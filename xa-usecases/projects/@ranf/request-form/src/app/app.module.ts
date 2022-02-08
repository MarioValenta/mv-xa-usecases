import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { AppComponent } from './app.component';
import { XAServices } from '@xa/lib-ui-common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { XAUIModule, XAModalService } from '@xa/ui';
import { AgGridModule } from 'ag-grid-angular';
import { XAGridHelperModule, AllCellRenderers, AllCellEditors } from '@xa/grid';
import 'ag-grid-enterprise';
import { AttachmentUploadComponent } from './attachmentupload-component/AttachmentUpload.component';
import { ValidationService } from '@xa/validation';
import { Ng2FlatpickrComponent } from './ng2-flatpickr/ng2-flatpickr.component';
import { Ng2FlatpickrDirective } from './ng2-flatpickr/ng2-flatpickr.directive';
import { XAToastDefaults } from './toast-config';
//TODO import { SharedModule } from 'DevEnvironment/src/app/shared/shared.module';
import { environment } from '../environments/environment';
import { ExcelTableUploadComponent } from './excel-table-component/excel.table.component';
import { GridStatusBarSharedModule } from 'projects/shared/grid-status-bar/grid-status-bar.shared.module';
import { GridStatusBarComponent } from 'projects/shared/grid-status-bar/grid-status-bar-component.component';

@NgModule({
  declarations: [
    AppComponent,
    AttachmentUploadComponent,
    ExcelTableUploadComponent,
    Ng2FlatpickrComponent,
    Ng2FlatpickrDirective
  ],
  imports: [
    BrowserModule,
    XAUIModule.forRoot(),
    XAGridHelperModule,
    AgGridModule.withComponents([
      ...AllCellEditors,
      ...AllCellRenderers,
      GridStatusBarSharedModule
    ]),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    //TODO environment.production ? [] : SharedModule
  ],
  exports: [
    AppComponent,
    ExcelTableUploadComponent,
    Ng2FlatpickrComponent,
    Ng2FlatpickrDirective,
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
  entryComponents: [
    AppComponent,
    AttachmentUploadComponent,
    GridStatusBarComponent
  ],
  bootstrap: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})

export class AppModule {

  constructor(private injector: Injector) {

  }

  ngDoBootstrap() {

    // const strategyFactory = new ElementZoneStrategyFactory(VMCreateRequestComponent, this.injector);
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('ranf', ce);

  }
}
