import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XAServices } from '@xa/lib-ui-common';
import { XAUIModule } from '@xa/ui';

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

  ],
  providers: [],
  entryComponents: [
    AppComponent,
  ],
  exports: [AppComponent],
  bootstrap: []
})
export class CreateIPNetworkUTConfirmationCompletenessAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('create-ip-network-ut-confirmation-completeness', ce);
  }
}
