import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './json-values-as-simple-table.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule
  ],
  exports: [AppComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class JsonValuesAsSimpleTableModule { }
