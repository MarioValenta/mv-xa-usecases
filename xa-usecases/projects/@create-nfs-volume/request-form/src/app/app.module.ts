import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShowErrorsModule } from '@xa/show-errors';
import { InfoMailShareModule, XAServices } from '@xa/lib-ui-common';
import { XAModalService, XAUIModule } from '@xa/ui';
import { environment } from '../environments/environment';
import { SharedModule as DEVSharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';
import { InfoTableComponent } from './infotable-component/infotable.component';
import { SharedModule } from 'projects/@create-nfs-volume/shared/shared-module';
import { XAToastDefaults } from 'projects/shared/toast-config';
import { NouisliderModule } from 'ng2-nouislider';
import { XASERVICE_TOKEN, windowFactory } from 'projects/shared.functions';
import { ValidationService } from '@xa/validation';

@NgModule({
  declarations: [
    AppComponent,
    InfoTableComponent
  ],
  imports: [
    BrowserModule,
    XAUIModule.forRoot(),
    NouisliderModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ShowErrorsModule,
    environment.production ? [] : DEVSharedModule,
    SharedModule,
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
      XAModalService,
      ValidationService
  ],
  exports: [AppComponent],
  entryComponents: [
    AppComponent,
    InfoTableComponent
  ],
  bootstrap: []
})
export class CreateNFSVolumeRequestFormAppModule {

  constructor(private injector: Injector) {

  }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('create-nfs-volume', ce);
  }
}
