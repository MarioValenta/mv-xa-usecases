import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XAServices } from '@xa/lib-ui-common';
import { XAUIModule, XAModalService } from '@xa/ui';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    XAUIModule.forRoot(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{
    provide: XAServices,
    useValue: (window as any).xa
  },
    XAModalService
  ],
  entryComponents: [
    AppComponent
  ],
  exports: [AppComponent],
  bootstrap: []
})
export class PhoneForwardingRequestFormAppModule {

  constructor(private injector: Injector) {

  }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('phoneforwarding-request-form', ce);
  }
}
