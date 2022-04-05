import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ShowErrorsModule } from '@xa/show-errors';
import { XAUIModule } from '@xa/ui';
import { GeneralInformationAppModule } from 'projects/@oracle-db-rundown/shared/general-information/general-information.module';
import { InputFormArrayAppModule } from 'projects/@oracle-db-rundown/shared/input-forms-array/input-forms-array.module';
import { OracleDbRdnUTEnterStorageAppComponent } from './app.component';

@NgModule({
  declarations: [
    OracleDbRdnUTEnterStorageAppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    XAUIModule.forRoot(),
    GeneralInformationAppModule,
    ShowErrorsModule,
    InputFormArrayAppModule
  ],
  exports: [
    OracleDbRdnUTEnterStorageAppComponent
  ],
  entryComponents: [
    OracleDbRdnUTEnterStorageAppComponent
  ]
})
export class OracleDbRdnUTEnterStorageAppModuleAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
      const ce = createCustomElement(OracleDbRdnUTEnterStorageAppComponent, { injector: this.injector });
      customElements.define('oracle-db-rundown-ut-enter-storage', ce);
  }
}
