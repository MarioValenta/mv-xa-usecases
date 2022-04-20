import { NgModule } from '@angular/core';
import { PlaceholderPipe } from './placeholder.pipe';
import { RequiredPipe } from './required.pipe';
import { SliderOptionPipe } from './slider-config.pipe';

@NgModule({
  declarations: [
    RequiredPipe,
    PlaceholderPipe,
    SliderOptionPipe
  ],
  exports: [
    RequiredPipe,
    PlaceholderPipe,
    SliderOptionPipe
  ]
})
export class PipeModule {}
