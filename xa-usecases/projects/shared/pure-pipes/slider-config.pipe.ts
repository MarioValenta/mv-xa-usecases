import { Pipe, PipeTransform } from '@angular/core';
import { ICERequestContext } from '@xa/lib-ui-common';
import * as DefaultSliderOptions from '../../@vmcreate/request-form-v2/src/app/default-slider-options.json';
// TODO update defaultSliderOptions import

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
