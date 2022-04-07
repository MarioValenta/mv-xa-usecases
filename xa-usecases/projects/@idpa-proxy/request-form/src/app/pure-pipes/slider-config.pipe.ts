import { Pipe, PipeTransform } from '@angular/core';
import { ICERequestContext } from '@xa/lib-ui-common';
import * as DefaultSliderOptions from '../default-slider-options.json';

@Pipe({
  name: 'sliderOption'
})
export class SliderOptionPipe implements PipeTransform {
  transform(context: ICERequestContext, sliderOption: any, debug?: boolean): any {
    if (debug) {
      console.debug('run slider-option pipe');
    }
    return this.getSliderOptionsConfig(context, sliderOption);
  }

  getSliderOptionsConfig(context: ICERequestContext, sliderOption: string) {
    return (context && context.ConfigPayload.SliderOptions) ? context.ConfigPayload.SliderOptions[sliderOption] : (DefaultSliderOptions as any).default[sliderOption];
  }
}
