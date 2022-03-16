import { NgModule } from '@angular/core';
import { PlaceholderPipe } from './placeholder.pipe';
import { RequiredPipe } from './required.pipe';

@NgModule({
  declarations: [
    RequiredPipe,
    PlaceholderPipe
  ],
  exports: [
    RequiredPipe,
    PlaceholderPipe
  ]
})
export class PipeModule {}
