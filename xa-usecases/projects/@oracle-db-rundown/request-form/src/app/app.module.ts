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
import { windowFactory, XASERVICE_TOKEN } from 'projects/shared.functions';
import { RelationTableComponent } from 'projects/@oracle-db-rundown/shared/relation-table/relation-table.component';
import { XAToastDefaults } from 'projects/shared/toast-config';

import { AppComponent } from './app.component';
import { InfoTableComponent } from './infotable-component/infotable.component';

@NgModule({
    declarations: [
        AppComponent,
        RelationTableComponent,
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
        ShowErrorsModule
    ],
    exports:[
        AppComponent
    ],
    providers: [
        {
          provide: XASERVICE_TOKEN,
          useFactory: windowFactory
        },
        {
          provide: 'XANotifyToastConfig',
          useValue: XAToastDefaults
        }
    ],
    entryComponents: [
        AppComponent,
        RelationTableComponent,
        InfoTableComponent
    ],
    bootstrap: []
})
export class OracleDbRdnRequestFormAppModule {

    constructor(private injector: Injector) { }

    ngDoBootstrap() {
        const ce = createCustomElement(AppComponent, { injector: this.injector });
        customElements.define('oracle-db-rundown-request-form', ce);
    }
}
