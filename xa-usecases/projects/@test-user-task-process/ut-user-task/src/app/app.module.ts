import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  exports: [AppComponent],
  providers: [],
  entryComponents: [AppComponent]
})
export class TestUserTaskUTUserTaskAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
      const ce = createCustomElement(AppComponent, { injector: this.injector });
      customElements.define('test-user-task-ut-user-task', ce);
  }
}
