import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { AppComponent } from './app.component';
import { createCustomElement } from '@angular/elements';
import { XAUIModule } from '@xa/ui';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    XAUIModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  exports: [AppComponent],
  entryComponents: [
    AppComponent
  ],
  bootstrap: []
})
export class SapApplicationRundownUTSelectStorageAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('sap-application-rundown-ut-select-storage', ce);
  }
}
