import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XAUIModule } from '@xa/ui';
import { ShowErrorsModule } from '@xa/show-errors';
import { InfoMailShareModule } from '@xa/lib-ui-common';
import { NouisliderModule } from 'ng2-nouislider';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { PipeModule } from 'projects/shared/pure-pipes/pipe.module';
import { SharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';
import { XAToastDefaults } from 'projects/shared/toast-config';
import { XASERVICE_TOKEN, windowFactory } from 'projects/shared.functions';

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
  exports: [
    AppComponent,
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
  ],
  entryComponents: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
})
export class VMCreateRequestFormv2AppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('vmcreate-request-form-v2', ce);
  }
}
