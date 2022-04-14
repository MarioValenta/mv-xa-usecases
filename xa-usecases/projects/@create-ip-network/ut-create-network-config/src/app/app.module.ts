import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XAServices } from '@xa/lib-ui-common';
import { ShowErrorsModule } from '@xa/show-errors';
import { XAUIModule } from '@xa/ui';

import { AppComponent } from './app.component';
import { CreateNetworkConfigTableComponent } from './createnetworkconfig-table.1.0.0.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateNetworkConfigTableComponent

  ],
  imports: [
    BrowserModule,
    XAUIModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ShowErrorsModule
  ],
  exports: [
    AppComponent,
    CreateNetworkConfigTableComponent
  ],
  providers: [],
  entryComponents: [
    AppComponent,
    CreateNetworkConfigTableComponent
  ],
  bootstrap: []
})
export class CreateIPNetworkUTCreateNetworkConfigAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
      const ce = createCustomElement(AppComponent, { injector: this.injector });
      customElements.define('create-ip-network-ut-create-network-config', ce);
  }
}
