import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { XAGridHelperModule } from '@xa/grid';
import { SearchModule } from '@xa/search';
import { ShowErrorsModule } from '@xa/show-errors';
import { XAUIModule } from '@xa/ui';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule as DEVSharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { CiTableComponent } from './ci-table/ci-table.component';
import { PatchAutomationSearchCisModalComponent } from './modals/search-cis-dialog/patch-automation-search-cis.component';

@NgModule({
  declarations: [
    AppComponent,
    CiTableComponent,
    PatchAutomationSearchCisModalComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    XAUIModule.forRoot(),
    XAGridHelperModule,
    AgGridModule.withComponents([]),
    SearchModule,
    ShowErrorsModule,
    environment.production ? [] : DEVSharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [AppComponent],
  entryComponents: [AppComponent,
    CiTableComponent,
    PatchAutomationSearchCisModalComponent]
})
export class PatchautomationCategoryAssignmentRequestFormAppModule { }
