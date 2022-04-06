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
import { InfoTableComponent } from 'projects/@server-rundown/shared/infotable-component/infotable.component';
import { RelationTableComponent } from 'projects/@server-rundown/shared/relation-table/relation-table.component';
import { windowFactory, XASERVICE_TOKEN } from 'projects/shared.functions';
import { XAToastDefaults } from 'projects/shared/toast-config';
import { AppComponent } from './app.component';


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
  exports: [
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
  ]
})
export class ServerRundownRequestFormAppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('server-rundown-request-form', ce);
  }
}
