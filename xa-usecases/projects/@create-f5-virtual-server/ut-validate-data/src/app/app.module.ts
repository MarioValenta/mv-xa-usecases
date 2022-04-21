import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { UTValidateComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowErrorsModule } from '@xa/show-errors';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XAUIModule, XAModalService } from '@xa/ui';
import { createCustomElement } from '@angular/elements';
import { PipeModule } from 'projects/shared/pure-pipes/pipe.module';
import { SharedModule } from 'projects/@create-f5-virtual-server/shared/shared-module';
import { XASERVICE_TOKEN, windowFactory } from 'projects/shared.functions';

@NgModule({
  declarations: [
    UTValidateComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    XAUIModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ShowErrorsModule,
    SharedModule,
    PipeModule
  ],
  exports: [UTValidateComponent],
  providers: [
    {
      provide: XASERVICE_TOKEN,
      useFactory: windowFactory
    },
    XAModalService
  ],
  entryComponents: [
    UTValidateComponent
  ],
  bootstrap: []
})
export class CreateF5VirtualServerUTValidateAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(UTValidateComponent, { injector: this.injector });
    customElements.define('create-f5-virtual-server-ut-validate', ce);
  }
}
