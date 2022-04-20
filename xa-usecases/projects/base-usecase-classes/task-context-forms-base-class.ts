import { Component, Inject, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApproveTaskPayload, ICETask, ICETaskContext, RejectTaskPayload, SubmitTaskPayload } from '@xa/lib-ui-common';
import { FormsBaseClass } from './forms-base-class';

@Component({
  template: ''
})
export abstract class TaskContextFormsBaseClass extends FormsBaseClass implements ICETask {

  @Input() Context!: ICETaskContext;
  rejectedFormKey: string = 'Aborted';

  constructor(@Inject(String) title?: string) {
    super(title);
  }

  setTaskContextCallbacks(): void {
    console.debug(this.title, 'setTaskContextCallbacks()');

    this.Context.OnApprove(() => this.onApprove());
    this.Context.OnReject(() => this.onReject());
  }

  setFormAborted() {
    if (!this.form.get(this.rejectedFormKey)) {
      this.form.addControl(this.rejectedFormKey, new FormControl(true));
    } else {
      this.form.get(this.rejectedFormKey)!.setValue(true);
    }
  }

  onSubmit(): SubmitTaskPayload {
    console.debug(this.title, 'onSubmit()');

    if (this.form.valid) {
      console.debug(this.form.value);
    } else {
      console.error('Form is not valid', this.form);
    }

    const formData = this.form.value;

    return {
      value: formData,
      runtimeData: formData
    };
  }

  onApprove(): ApproveTaskPayload {
    console.debug(this.title, 'onApprove()', this.form.value);

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

  onReject(): RejectTaskPayload {
    console.debug(this.title, 'onReject()', this.form.value);

    this.setFormAborted();
    return {
      resultName: this.rejectedFormKey,
      reasonName: 'ApprovalComment',
      resultValue: this.form.get(this.rejectedFormKey)!.value
    };
  }
}
