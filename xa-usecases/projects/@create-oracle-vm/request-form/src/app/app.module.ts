import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShowErrorsModule } from '@xa/show-errors';
import { XAUIModule } from '@xa/ui';
import { NouisliderModule } from 'ng2-nouislider';
import { windowFactory, XASERVICE_TOKEN } from 'projects/shared.functions';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    XAUIModule.forRoot(),
    BrowserAnimationsModule,
    ShowErrorsModule,
    NouisliderModule
  ],
  entryComponents: [
    AppComponent
  ],
  providers: [
    {
      provide: XASERVICE_TOKEN,
      useFactory: windowFactory
    }
  ],
  exports: [AppComponent]
})
export class CreateOracleVMRequestFormAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const el = createCustomElement(AppComponent,
      { injector: this.injector });
    customElements.define('create-oracle-vm-request-form', el);
  }

}
