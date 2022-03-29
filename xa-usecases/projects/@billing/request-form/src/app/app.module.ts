import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { XAUIModule } from '@xa/ui';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { XASERVICE_TOKEN, windowFactory } from 'projects/shared.functions';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    XAUIModule.forRoot()
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
  entryComponents: [AppComponent],
  bootstrap: []
})
export class BillingRequestFormAppModule {

  constructor(private injector: Injector) {

  }

  ngDoBootstrap() {
      const ce = createCustomElement(AppComponent, { injector: this.injector });
      customElements.define('billing-request-form', ce);
  }

}
