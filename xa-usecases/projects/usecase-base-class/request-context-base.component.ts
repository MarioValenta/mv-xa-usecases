import { Component, Inject, Input } from '@angular/core';
import { ICERequest, ICERequestContext } from '@xa/lib-ui-common';
import { FormBaseComponent } from './form-base.component';

@Component({
  template: ''
})
export abstract class RequestContextBaseComponent extends FormBaseComponent implements ICERequest {

  @Input() Context!: ICERequestContext;
  requestFormIdentifier: string = 'EMPTY';

  constructor(@Inject(String) title?: string) {
    super(title);
  }

  onSubmit() {
    console.debug(this.title, 'onSubmit()');

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
