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
import { CiTableComponent } from './ci-table/ci-table.component';
import { PatchAutomationSearchCisModalComponent } from './modals/search-cis-dialog/patch-automation-search-cis.component';
import { Ng2FlatpickrComponent } from './ng2-flatpickr/ng2-flatpickr.component';
import { Ng2FlatpickrDirective } from './ng2-flatpickr/ng2-flatpickr.directive';
import 'ag-grid-enterprise';
import { ValidationService } from '@xa/validation';
import { environment } from '../environments/environment';
import { SharedModule as DEVSharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';
import { ShowErrorsModule } from '@xa/show-errors';
import { XAToastDefaults } from 'projects/shared/toast-config';

@NgModule({
  declarations: [
    AppComponent,
    CiTableComponent,
    PatchAutomationSearchCisModalComponent,
    Ng2FlatpickrComponent,
    Ng2FlatpickrDirective
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
    environment.production ? [] : DEVSharedModule,
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
    Ng2FlatpickrDirective,
  ],
  entryComponents: [
    AppComponent,
    CiTableComponent,
    PatchAutomationSearchCisModalComponent

  ],
  bootstrap: []
})

export class PatchautomationRequestFormAppModule {

  constructor(private injector: Injector) {

  }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('patchautomation-request-form', ce);
  }
}
