import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2FlatpickrComponent } from './ng2-flatpickr.component';
import { Ng2FlatpickrDirective } from './ng2-flatpickr.directive';

export { FlatpickrOptions } from './flatpickr-options.interface.d';
export { Ng2FlatpickrComponent } from './ng2-flatpickr.component';


@NgModule({
  declarations: [
    Ng2FlatpickrComponent,
    Ng2FlatpickrDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    Ng2FlatpickrComponent,
    Ng2FlatpickrDirective
  ]
})
export class Ng2FlatpickrModule { }
