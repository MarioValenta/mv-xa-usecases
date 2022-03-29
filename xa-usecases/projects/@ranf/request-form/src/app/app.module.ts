import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { AppComponent } from './app.component';
import { UiAttachmentsUploadModule } from '@xa/lib-ui-common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { XAUIModule, XAModalService } from '@xa/ui';
import { AgGridModule } from 'ag-grid-angular';
import { XAGridHelperModule, AllCellRenderers, AllCellEditors } from '@xa/grid';
import 'ag-grid-enterprise';
import { ValidationService } from '@xa/validation';
import { SharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';
import { environment } from '../environments/environment';
import { ExcelTableUploadComponent } from './excel-table-component/excel.table.component';
import { GridStatusBarSharedModule } from 'projects/shared/grid-status-bar/grid-status-bar.shared.module';
import { GridStatusBarComponent } from 'projects/shared/grid-status-bar/grid-status-bar-component.component';
import { XAToastDefaults } from 'projects/shared/toast-config';
import { Ng2FlatpickrModule } from 'projects/shared/ng2-flatpickr/ng2-flatpickr.module';
import { windowFactory, XASERVICE_TOKEN } from 'projects/shared.functions';

@NgModule({
  declarations: [
    AppComponent,
    ExcelTableUploadComponent
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
    environment.production ? [] : SharedModule,
    Ng2FlatpickrModule,
    UiAttachmentsUploadModule
  ],
  exports: [
    AppComponent,
    ExcelTableUploadComponent
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
    GridStatusBarComponent
  ],
  bootstrap: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})

export class RanfRequestFormAppModule {

  constructor(private injector: Injector) {

  }

  ngDoBootstrap() {

    // const strategyFactory = new ElementZoneStrategyFactory(VMCreateRequestComponent, this.injector);
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('ranf', ce);

  }
}
