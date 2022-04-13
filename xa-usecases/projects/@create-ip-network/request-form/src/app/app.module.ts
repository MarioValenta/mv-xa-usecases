import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchModule } from '@xa/search';
import { ShowErrorsModule } from '@xa/show-errors';
import { XAUIModule } from '@xa/ui';
import { windowFactory, XASERVICE_TOKEN } from 'projects/shared.functions';

import { AppComponent } from './app.component';
import { NetworkOptionsTableComponent } from './network-options-table.component';


@NgModule({
  declarations: [
    AppComponent,
    NetworkOptionsTableComponent
  ],
  imports: [
    BrowserModule,
    XAUIModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SearchModule,
    ShowErrorsModule
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
    AppComponent
],
  bootstrap: []
})
export class CreateIpNetworkRequestFormAppModule {
  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('create-ip-network-request-form', ce);
  }
}
