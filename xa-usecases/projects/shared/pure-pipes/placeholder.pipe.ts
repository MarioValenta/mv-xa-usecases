import { Pipe, PipeTransform } from '@angular/core';
import { ICERequestContext, ICETaskContext } from '@xa/lib-ui-common';

@Pipe({
  name: 'placeholder'
})
export class PlaceholderPipe implements PipeTransform {

  transform(context: (ICERequestContext | ICETaskContext), formControlName: string, emtpyPlaceholderString?: string, debug?: boolean): string {
    if (debug) {
      console.debug('run placeholder pipe');
      console.debug('placeholder of ' + formControlName + ' = "' + this.getPlaceholderFromConfig(context, formControlName) + '"');
    }
    return this.getPlaceholderFromConfig(context, formControlName, emtpyPlaceholderString);
  }

  getPlaceholderFromConfig(context: ICERequestContext | ICETaskContext, formControlName: string, emtpyPlaceholderString?: string): string {
    return (context &&
      context.ConfigPayload.placeholders &&
      context.ConfigPayload.placeholders[formControlName]) ?
      context.ConfigPayload.placeholders[formControlName] : this.emtpyPlaceholder(emtpyPlaceholderString);
  }

  private emtpyPlaceholder(emtpyPlaceholderString?: string) {
    return emtpyPlaceholderString ? emtpyPlaceholderString : '...';
  }
}
