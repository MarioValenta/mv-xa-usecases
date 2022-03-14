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
import { XAGridHelperModule, AllCellRenderers, AllCellEditors } from '@xa/grid';
import { CiTableComponent } from './ci-table/ci-table.component';
import { PatchAutomationSearchCisModalComponent } from './modals/search-cis-dialog/patch-automation-search-cis.component';
import 'ag-grid-enterprise';
import { XAToastDefaults } from 'projects/shared/toast-config';
import { environment } from '../environments/environment';
import { SharedModule as DEVSharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    CiTableComponent,
    PatchAutomationSearchCisModalComponent
  ],
  imports: [
    BrowserModule,
    XAUIModule.forRoot(),
    XAGridHelperModule,
    AgGridModule.withComponents([]),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SearchModule,
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

    XAModalService
  ],
  exports: [
    AppComponent
  ],
  entryComponents: [
    AppComponent,
    CiTableComponent,
    PatchAutomationSearchCisModalComponent

  ],
  bootstrap: []
})

export class PatchautomationRemoveRequestFormAppModule {

  constructor(private injector: Injector) {

  }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('patchautomationremove-request-form', ce);
  }
}
