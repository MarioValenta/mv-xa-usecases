import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { AppComponent } from './app.component';
import { XAServices } from '@xa/lib-ui-common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { XAUIModule, XAModalService } from '@xa/ui';
import { ValidationService } from '@xa/validation';
import { ShowErrorsModule } from '@xa/show-errors';
import { AttachmentUploadComponent } from './attachmentupload-component/AttachmentUpload.component';
import { AgGridModule } from 'ag-grid-angular';
import { XAToastDefaults } from 'projects/shared/toast-config';
import { XAGridHelperModule } from '@xa/grid';
import { environment } from '../environments/environment';
//TODO import { SharedModule } from 'DevEnvironment/src/app/shared/shared.module';
import 'ag-grid-enterprise';

@NgModule({
  declarations: [
    AppComponent,
    AttachmentUploadComponent
  ],
  imports: [
    BrowserModule,
    XAUIModule.forRoot(),
    XAGridHelperModule,
    AgGridModule.withComponents([]),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ShowErrorsModule,
    //TODO environment.production ? [] : SharedModule,
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
    AttachmentUploadComponent
  ],
  exports: [AppComponent]
})

export class CreateSRRequestFormAppModule {

  constructor(private injector: Injector) {

  }

  ngDoBootstrap() {

    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('createsr-request-form', ce);
  }
}
