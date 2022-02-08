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
import { XAServices } from '@xa/lib-ui-common';
import { ValidationService } from '@xa/validation';
import { BtnCellRenderer } from './attachmentlist-component/button-cell-renderer.component';
import { GridStatusBarSharedModule } from 'projects/shared/grid-status-bar/grid-status-bar.shared.module';
// TODO import { SharedModule } from 'DevEnvironment/src/app/shared/shared.module';
import { GridStatusBarComponent } from 'projects/shared/grid-status-bar/grid-status-bar-component.component';
import { environment } from '../environments/environment';
import { XAToastDefaults } from 'projects/shared/toast-config';
import { Ng2FlatpickrComponent } from 'projects/shared/ng2-flatpickr/ng2-flatpickr.component';
import { Ng2FlatpickrDirective } from 'projects/shared/ng2-flatpickr/ng2-flatpickr.directive';


@NgModule({
  declarations: [
    AppComponent,
    AttachmentListComponent,
    Ng2FlatpickrComponent,
    Ng2FlatpickrDirective,
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
    // TODO environment.production ? [] : SharedModule
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
export class AppModule {

  constructor(private injector: Injector) {

  }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('ranf-user-task-form', ce);
  }
}
