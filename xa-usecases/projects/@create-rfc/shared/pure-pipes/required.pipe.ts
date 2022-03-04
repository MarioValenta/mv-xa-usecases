import { Pipe, PipeTransform } from '@angular/core';
import { ValidationService } from '@xa/validation';
import { ValidatorConfig } from '@xa/validation/lib/Validation/ValidatorConfig';

@Pipe({
  name: 'required'
})
export class RequiredPipe implements PipeTransform {
  transform(validationService: ValidationService, elementName: string, isFromAssignmentGroupsArray?: boolean, debug?: boolean): boolean {
    if (debug) {
      console.debug('run required pipe');
      console.debug('validationService:', validationService);
      console.debug('isFromAssignmentGroupsArray:', isFromAssignmentGroupsArray);
      console.debug(elementName + ' required = ' + this.isFormElementRequired(validationService, elementName));
    }
    return isFromAssignmentGroupsArray ?
      (this.getFieldFromAssignmentGroupsArray(validationService, elementName).required || this.getFieldFromAssignmentGroupsArray(validationService, elementName).requiredTrue) :
      this.isFormElementRequired(validationService, elementName);
  }

  isFormElementRequired(validationService: ValidationService, elementName: string,): boolean {
    if (validationService instanceof ValidationService) {
      return (validationService && validationService.validatorConfigList.get(elementName)) ?
        (validationService.validatorConfigList.get(elementName).required || validationService.validatorConfigList.get(elementName).requiredTrue) : false;
    }
  }

  getDependendObjectsByElement(validationService: ValidationService, elementName: string, dependendValue: string): ValidatorConfig[] {
    return validationService.validatorConfigList.get(elementName).dependencies[dependendValue];
  }

  getElementFromDependendObjectsByElement(validationService: ValidationService, elementName: string, dependendValue: string, varName: string): ValidatorConfig {
    return this.getDependendObjectsByElement(validationService, elementName, dependendValue).filter(
      (element: ValidatorConfig) => element.varName === varName
    )[0];
  }

  getFieldsValidatorsFromValidatorArray(validatorArray: ValidatorConfig, elementName: string): ValidatorConfig {
    return validatorArray ?
      validatorArray.fields.filter((element: ValidatorConfig) => element.varName === elementName)[0] : null;
  }

  getFieldFromAssignmentGroupsArray(validationService: ValidationService, elementName: string): ValidatorConfig {
    return this.getFieldsValidatorsFromValidatorArray(
      this.getElementFromDependendObjectsByElement(validationService,
        'KnowAboutRequiredTeamsRadio',
        'detailed',
        'AssignmentGroups'),
      elementName);
  }






}
