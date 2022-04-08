import { Component, Inject, Input } from '@angular/core';
import { ICETask, ICETaskContext, SubmitTaskPayload } from '@xa/lib-ui-common';
import { FormsBaseClass } from './forms-base-class';

@Component({
  template: ''
})
export abstract class TaskContextFormsBaseClass extends FormsBaseClass implements ICETask {

  @Input() Context!: ICETaskContext;

  constructor(@Inject(String) title?: string) {
    super(title);
  }

  onSubmit(): SubmitTaskPayload {
    console.log('onSubmit', this.title);

    if (this.form.valid) {
      console.debug(this.form.value);
    } else {
      console.error('Form is not valid', this.form);
    }

    const model = this.form.value;

    return {
      value: model,
      runtimeData: model
    };
  }
}
