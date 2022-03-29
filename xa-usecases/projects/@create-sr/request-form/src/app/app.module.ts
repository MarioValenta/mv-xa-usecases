import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { AppComponent } from './app.component';
import { UiAttachmentsUploadModule, InfoMailShareModule } from '@xa/lib-ui-common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { XAUIModule, XAModalService } from '@xa/ui';
import { ShowErrorsModule } from '@xa/show-errors';
import { AgGridModule } from 'ag-grid-angular';
import { XAToastDefaults } from 'projects/shared/toast-config';
import { XAGridHelperModule } from '@xa/grid';
import { environment } from '../environments/environment';
import 'ag-grid-enterprise';
import { SharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';
import { XASERVICE_TOKEN, windowFactory } from 'projects/shared.functions';


@NgModule({
  declarations: [
    AppComponent
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
    InfoMailShareModule
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
    AppComponent
  ],
  exports: [AppComponent]
})

export class CreateSRRequestFormAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('createsr-request-form', ce);
  }
}
