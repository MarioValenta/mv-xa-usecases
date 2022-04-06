import 'ag-grid-enterprise';

import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XAUIModule } from '@xa/ui';
import { InterfaceTableComponent_1_0_0 } from 'projects/@server-rundown/shared/interface-table/interface-table.1.0.0.component';
import { PartitionTableComponent_1_0_0 } from 'projects/@server-rundown/shared/partition-table/partition-table.1.0.0.component';
import { windowFactory, XASERVICE_TOKEN } from 'projects/shared.functions';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    InterfaceTableComponent_1_0_0,
    PartitionTableComponent_1_0_0
  ],
  imports: [
    BrowserModule,
    XAUIModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: XASERVICE_TOKEN,
      useFactory: windowFactory
    }
  ],
  exports: [AppComponent],
  entryComponents: [
    AppComponent,
    InterfaceTableComponent_1_0_0,
    PartitionTableComponent_1_0_0
  ],
  bootstrap: []
})
export class ServerRundownUTNasOfflineAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('server-rundown-ut-nas-offline', ce);

  }
}
