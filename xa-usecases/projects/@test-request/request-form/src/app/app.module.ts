import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    environment.production ? [] : SharedModule,
  ],
  exports: [AppComponent],
  providers: [],
  entryComponents: [AppComponent],
  bootstrap: []
})
export class TestRequestRequestFormAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
      const ce = createCustomElement(AppComponent, { injector: this.injector });
      customElements.define('test-request-request-form', ce);
  }
}
