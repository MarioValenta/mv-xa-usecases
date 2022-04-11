import { Component, Inject, Input } from '@angular/core';
import { ICERequest, ICERequestContext } from '@xa/lib-ui-common';
import { FormsBaseClass } from './forms-base-class';

@Component({
  template: ''
})
export abstract class RequestContextFormsBaseClass extends FormsBaseClass implements ICERequest {

  @Input() Context!: ICERequestContext;
  requestFormIdentifier: string = 'EMPTY';

  constructor(@Inject(String) title?: string) {
    super(title);
  }

  onSubmit() {
    console.log('OnSubmit');

    if (this.form.valid) {
      console.debug(this.form.value);
    } else {
      console.error('Form is not valid', this.form);
    }

    return {
      value: this.form.value,
      identifier: this.requestFormIdentifier
    };
  }
}
