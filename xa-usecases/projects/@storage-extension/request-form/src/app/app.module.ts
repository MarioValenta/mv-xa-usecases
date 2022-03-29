import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { AppComponent } from './app.component';
import { StorageTableComponent } from './storage-table/storage-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { XAUIModule } from '@xa/ui';
import { AgGridModule } from 'ag-grid-angular';
import { SearchModule } from '@xa/search';
import { ShowErrorsComponent } from './show-errors.component';
import { InfoTableComponent } from './infotable-component/infotable.component';
import 'ag-grid-enterprise';
import { environment } from '../environments/environment';
import { SharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';
import { windowFactory, XASERVICE_TOKEN } from 'projects/shared.functions';

@NgModule({
    declarations: [
        AppComponent,
        StorageTableComponent,
        ShowErrorsComponent,
        InfoTableComponent
    ],
    imports: [
        BrowserModule,
        XAUIModule.forRoot(),
        ReactiveFormsModule,
        AgGridModule,
        BrowserAnimationsModule,
        SearchModule,
        environment.production ? [] : SharedModule,
    ],
    exports: [
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
        StorageTableComponent,
        ShowErrorsComponent,
        InfoTableComponent
    ],
    bootstrap: []
})
export class StorageExtensionRequestFormAppModule {

    constructor(private injector: Injector) {

    }

    ngDoBootstrap() {
        const ce = createCustomElement(AppComponent, { injector: this.injector });
        customElements.define('storage-extension-request-form', ce);
    }
}
