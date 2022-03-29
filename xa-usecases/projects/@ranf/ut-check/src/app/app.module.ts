import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { XAModalService, XAUIModule } from '@xa/ui';
import { AllCellEditors, AllCellRenderers, XAGridHelperModule } from '@xa/grid';
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'ag-grid-enterprise';

import { AppComponent } from './app.component';
import { AttachmentListComponent } from './attachmentlist-component/AttachmentList.component';
import { ValidationService } from '@xa/validation';
import { BtnCellRenderer } from './attachmentlist-component/button-cell-renderer.component';
import { GridStatusBarSharedModule } from 'projects/shared/grid-status-bar/grid-status-bar.shared.module';
import { SharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';
import { GridStatusBarComponent } from 'projects/shared/grid-status-bar/grid-status-bar-component.component';
import { environment } from '../environments/environment';
import { XAToastDefaults } from 'projects/shared/toast-config';
import { Ng2FlatpickrModule } from 'projects/shared/ng2-flatpickr/ng2-flatpickr.module';
import { windowFactory, XASERVICE_TOKEN } from 'projects/shared.functions';


@NgModule({
  declarations: [
    AppComponent,
    AttachmentListComponent,
    BtnCellRenderer
  ],
  imports: [
    BrowserModule,
    XAUIModule.forRoot(),
    XAGridHelperModule,
    AgGridModule.withComponents([
      ...AllCellEditors,
      ...AllCellRenderers,
      BtnCellRenderer,
      GridStatusBarSharedModule
    ]),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    environment.production ? [] : SharedModule,
    Ng2FlatpickrModule
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
  exports: [AppComponent],
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
export class RanfUtCheckAppModule {

  constructor(private injector: Injector) {

  }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('ranf-user-task-form', ce);
  }
}
