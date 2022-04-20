import { CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfoMailShareModule } from '@xa/lib-ui-common';
import { ShowErrorsModule } from '@xa/show-errors';
import { XAUIModule } from '@xa/ui';
import { NouisliderModule } from 'ng2-nouislider';
import { windowFactory, XASERVICE_TOKEN } from 'projects/shared.functions';
import { PipeModule } from 'projects/shared/pure-pipes/pipe.module';
import { XAToastDefaults } from 'projects/shared/toast-config';
import { SharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    XAUIModule.forRoot(),
    ShowErrorsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NouisliderModule,
    FormsModule,
    environment.production ? [] : SharedModule,
    InfoMailShareModule,
    PipeModule
  ],
  providers: [
    {
      provide: XASERVICE_TOKEN,
      useFactory: windowFactory
    },
    {
      provide: 'XANotifyToastConfig',
      useValue: XAToastDefaults,
    },
  ],
  exports: [AppComponent],
  entryComponents: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class IdpaProxyRequestFormAppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('<idpa-proxy-request-form>', ce);
  }
}
