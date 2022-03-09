import { NgModule, ModuleWithProviders } from '@angular/core';
import { SearchCisModalComponent } from './modals/search-cis-dialog/search-cis.component';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { BrowserModule } from '@angular/platform-browser';
import { XAUIModule } from '@xa/ui';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchModule } from '@xa/search';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    SearchCisModalComponent
  ],
  imports: [
    AgGridModule.withComponents([]),
    BrowserModule,
    ReactiveFormsModule,
    XAUIModule.forRoot(),
    SearchModule,
    BrowserAnimationsModule
  ],
  exports: [
    SearchCisModalComponent
  ],
  entryComponents: [
    SearchCisModalComponent
  ]

})
export class SharedModule {

  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
      ]
    };
  }
}

