import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridStatusBarComponent } from './grid-status-bar-component.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  GridStatusBarComponent
  ],
  exports: [
    GridStatusBarComponent
  ]
})

export class GridStatusBarSharedModule { }
