import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { XAUIModule, XAModalService } from '@xa/ui';
import { RequestFormComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XAServices } from '@xa/lib-ui-common';
import { ValidationService } from '@xa/validation';
import { ShowErrorsModule } from '@xa/show-errors';
import { SharedModule } from 'projects/@create-f5-virtual-server/shared/shared-module';
import { PipeModule } from 'projects/@create-f5-virtual-server/shared/pure-pipes/pipe.module';

@NgModule({
  declarations: [
    RequestFormComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    XAUIModule.forRoot(),
    BrowserAnimationsModule,
    ShowErrorsModule,
    SharedModule,
    PipeModule
  ],
  exports: [RequestFormComponent],
  providers: [{
    provide: XAServices,
    useValue: (window as any).xa
  },

    XAModalService,
    ValidationService
  ],
  entryComponents: [
    RequestFormComponent
  ],
  bootstrap: []
})
export class CreateF5VirtualServerRequestFormAppModule {

  constructor(private injector: Injector) {

  }

  ngDoBootstrap() {
    const ce = createCustomElement(RequestFormComponent, { injector: this.injector });
    customElements.define('createF5vServer-request-form', ce);
  }

}
