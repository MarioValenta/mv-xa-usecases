import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShowErrorsModule } from '@xa/show-errors';
import { XAUIModule } from '@xa/ui';
import { windowFactory, XASERVICE_TOKEN } from 'projects/shared.functions';
import {
  JsonValuesAsSimpleTableModule,
} from 'projects/shared/json-values-as-simple-table/json-values-as-simple-table.module';
import { Ng2FlatpickrModule } from 'projects/shared/ng2-flatpickr/ng2-flatpickr.module';
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
    ShowErrorsModule,
    BrowserModule,
    XAUIModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    Ng2FlatpickrModule,
    JsonValuesAsSimpleTableModule,
    environment.production ? [] : SharedModule,
    PipeModule
  ],
  exports: [AppComponent],
  providers: [
    {
      provide: XASERVICE_TOKEN,
      useFactory: windowFactory
    },
    {
      provide: 'XANotifyToastConfig',
      useValue: XAToastDefaults
    }
  ]
})

export class UniversalTapExecutionKfaDeploymentRequestFormAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('universal-tap-execution-kaf-deployment-request-form', ce);
  }
}

