import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XAUIModule } from '@xa/ui';

import { AppComponent } from './app.component';
import { ConfigureNetworkDevicesTableComponent_1_0_0 } from './configurenetworkdevices-table.1.0.0.component';


@NgModule({
  declarations: [
    AppComponent,
    ConfigureNetworkDevicesTableComponent_1_0_0
  ],
  imports: [
    BrowserModule,
    XAUIModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  exports: [
    AppComponent],
  providers: [],
  entryComponents: [
    AppComponent,
    ConfigureNetworkDevicesTableComponent_1_0_0
  ],
  bootstrap: []
})
export class CreateIPNetworkUTConfigureNetworkDevicesAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('create-ip-network-ut-configure-network-devices', ce);
  }

}
