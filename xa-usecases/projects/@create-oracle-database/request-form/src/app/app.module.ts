import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InfoMailShareModule } from '@xa/lib-ui-common';
import { ShowErrorsModule } from '@xa/show-errors';
import { XAUIModule } from '@xa/ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { windowFactory, XASERVICE_TOKEN } from 'projects/shared.functions';

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
    InfoMailShareModule
  ],
  entryComponents: [
    AppComponent
  ],
  exports: [
    AppComponent
  ],
  providers: [
    {
      provide: XASERVICE_TOKEN,
      useFactory: windowFactory
    }
  ]
})
export class CreateOracleDatabaseRequestFormAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const el = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('create-new-oracle-database', el);
  }
}
