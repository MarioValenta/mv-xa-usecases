import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XAUIModule } from '@xa/ui';

import { AppComponent } from './app.component';
import { ConfigureSwitchingTable_1_0_0 } from './configureswitching-table.1.0.0.component';


@NgModule({
  declarations: [
    AppComponent,
    ConfigureSwitchingTable_1_0_0
  ],
  imports: [
    BrowserModule,
    XAUIModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  exports: [AppComponent],
  providers: [],
  entryComponents: [
    AppComponent,
    ConfigureSwitchingTable_1_0_0
  ],
  bootstrap: []
})
export class CreateIPNetworkUTConfigureSwitchingCategoryAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('create-ip-network-ut-configure-switching-category', ce);
  }
}
