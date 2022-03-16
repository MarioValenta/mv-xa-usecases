import { Pipe, PipeTransform } from '@angular/core';
import { ValidationService } from '@xa/validation';

@Pipe({
  name: 'required'
})
export class RequiredPipe implements PipeTransform {
  transform(validationService: ValidationService, elementName: string, debug?: boolean): boolean {
    if (debug) {
      console.debug('run required pipe');
      console.debug('validationService:', validationService);
      console.debug(elementName + ' required = ' + this.isFormElementRequired(validationService, elementName));
    }
    return this.isFormElementRequired(validationService, elementName);
  }

  isFormElementRequired(validationService: ValidationService, elementName: string,): boolean {
    return (validationService && validationService.validatorConfigList.get(elementName)) ?
      (validationService.validatorConfigList.get(elementName).required || validationService.validatorConfigList.get(elementName).requiredTrue) : false;
  }
}
