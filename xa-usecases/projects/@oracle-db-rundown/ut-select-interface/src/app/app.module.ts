import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XAUIModule } from '@xa/ui';
import { GeneralInformationAppModule } from 'projects/@oracle-db-rundown/shared/general-information/general-information.module';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    XAUIModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    GeneralInformationAppModule
  ],
  exports: [AppComponent],
  entryComponents: [
    AppComponent
  ]
})
export class OracleDbRdnUTSelectInterfaceAppModuleAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('oracle-db-rundown-ut-select-interface', ce);
  }
}
