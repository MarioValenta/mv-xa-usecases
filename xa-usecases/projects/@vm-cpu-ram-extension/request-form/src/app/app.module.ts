import 'ag-grid-enterprise';

import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AllCellEditors, AllCellRenderers, XAGridHelperModule } from '@xa/grid';
import { SearchModule } from '@xa/search';
import { ShowErrorsModule } from '@xa/show-errors';
import { XAUIModule } from '@xa/ui';
import { AgGridModule } from 'ag-grid-angular';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { windowFactory, XASERVICE_TOKEN } from 'projects/shared.functions';
import { SharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { InfoTableComponent } from './infotable-component/infotable.component';

@NgModule({
    declarations: [
        AppComponent,
        InfoTableComponent
    ],
    imports: [
        BrowserModule,
        XAUIModule.forRoot(),
        XAGridHelperModule,
        AgGridModule.withComponents([
          ...AllCellEditors,
          ...AllCellRenderers
      ]),
        ReactiveFormsModule,
        BrowserAnimationsModule,
        SearchModule,
        Ng2FlatpickrModule,
        ShowErrorsModule,
        environment.production ? [] : SharedModule
    ],
    exports:[
        AppComponent
    ],
    providers: [
        {
          provide: XASERVICE_TOKEN,
          useFactory: windowFactory
        }
    ],
    entryComponents: [
        AppComponent,
        InfoTableComponent
    ],
    bootstrap: []
})
export class VMCpuRamExtensionRequestFormAppModule {

    constructor(private injector: Injector) { }

    ngDoBootstrap() {
        const ce = createCustomElement(AppComponent, { injector: this.injector });
        customElements.define('vm-cpu-ram-extension-request-form', ce);
    }
}
