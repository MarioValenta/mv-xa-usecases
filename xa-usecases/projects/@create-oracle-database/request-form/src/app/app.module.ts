import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { XAServices } from '@xa/lib-ui-common';
import { ValidationService } from '@xa/validation';
import { ShowErrorsModule } from '@xa/show-errors';
import { XAUIModule } from '@xa/ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    XAUIModule.forRoot(),
    BrowserAnimationsModule,
    ShowErrorsModule
  ],
  entryComponents: [
    AppComponent
  ],
  exports: [
    AppComponent
  ],
  providers: [{
    provide: XAServices,
    useValue: (window as any).xa
  },
    ValidationService]
})
export class CreateOracleDatabaseRequestFormAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const el = createCustomElement(AppComponent,
      { injector: this.injector });
    customElements.define('create-new-oracle-database', el);
  }

}
