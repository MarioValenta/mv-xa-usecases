import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XAUIModule } from '@xa/ui';
import { AppComponent } from './app.component';
import { InterfaceTableComponent_1_0_0 } from './interface-table/interface-table.1.0.0.component';
import { PartitionTableComponent_1_0_0 } from './partition-table/partition-table.1.0.0.component';

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
    BrowserAnimationsModule,
  ],
  providers: [
  ],
  entryComponents: [
    AppComponent,
    InterfaceTableComponent_1_0_0,
    PartitionTableComponent_1_0_0
  ],
  exports: [AppComponent],
  bootstrap: []
})
export class SapApplicationRundownUTNasOfflineAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('sap-application-rundown-ut-nas-offline', ce);
  }
}
