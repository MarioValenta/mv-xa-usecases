import { ShowErrorsModule } from '@xa/show-errors';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { InputFormArrayComponent } from './input-forms-array.component';

@NgModule({
  declarations: [
    InputFormArrayComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    ShowErrorsModule
  ],
  exports: [InputFormArrayComponent],
  bootstrap: [InputFormArrayComponent]
})
export class InputFormArrayAppModule { }
