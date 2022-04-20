import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShowErrorsModule } from '@xa/show-errors';
import { XAUIModule } from '@xa/ui';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { windowFactory, XASERVICE_TOKEN } from 'projects/shared.functions';
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
    ReactiveFormsModule,
    BrowserAnimationsModule,
    Ng2FlatpickrModule,
    ShowErrorsModule,
    environment.production ? [] : SharedModule
  ],
  exports: [
    AppComponent
  ],
  providers: [
    {
      provide: XASERVICE_TOKEN,
      useFactory: windowFactory
    }
  ],
  entryComponents: [
    AppComponent,
  ],
  bootstrap: []
})
export class PatchautomationProcessReportRequestFormAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('patchautomation-process-report-request-form', ce);
  }
}
