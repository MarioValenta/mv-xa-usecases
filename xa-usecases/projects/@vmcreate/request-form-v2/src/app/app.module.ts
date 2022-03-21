import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XAUIModule } from '@xa/ui';
import { ShowErrorsModule } from '@xa/show-errors';
import { ValidationService } from '@xa/validation';
import { XAServices, InfoMailShareModule } from '@xa/lib-ui-common';
import { NouisliderModule } from 'ng2-nouislider';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { SliderOptionPipe } from './pure-pipes/slider-config.pipe';
import { PlaceholderPipe } from './pure-pipes/placeholder.pipe';
import { RequiredPipe } from './pure-pipes/required.pipe';
import { SharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';
import { XAToastDefaults } from 'projects/shared/toast-config';

@NgModule({
  declarations: [
    AppComponent,
    SliderOptionPipe,
    PlaceholderPipe,
    RequiredPipe
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
    InfoMailShareModule
  ],
  exports: [
    AppComponent,
  ],
  providers: [
    ValidationService,
    {
      provide: XAServices,
      useValue: (window as any).xa
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
