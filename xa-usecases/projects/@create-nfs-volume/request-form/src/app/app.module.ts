import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfoMailShareModule } from '@xa/lib-ui-common';
import { ShowErrorsModule } from '@xa/show-errors';
import { XAModalService, XAUIModule } from '@xa/ui';
import { NouisliderModule } from 'ng2-nouislider';
import { SharedModule } from 'projects/@create-nfs-volume/shared/shared-module';
import { windowFactory, XASERVICE_TOKEN } from 'projects/shared.functions';
import { XAToastDefaults } from 'projects/shared/toast-config';
import { SharedModule as DEVSharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { InfoTableComponent } from './infotable-component/infotable.component';

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
    XAModalService
  ],
  exports: [AppComponent],
  entryComponents: [
    AppComponent,
    InfoTableComponent
  ],
  bootstrap: []
})
export class CreateNFSVolumeRequestFormAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('create-nfs-volume', ce);
  }
}
