import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  exports: [AppComponent],
  entryComponents: [
    AppComponent
  ],
  providers: []
})
export class TestUserTaskProcessRequestFormAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
      const ce = createCustomElement(AppComponent, { injector: this.injector });
      customElements.define('test-user-task-request-form', ce);
  }
}
