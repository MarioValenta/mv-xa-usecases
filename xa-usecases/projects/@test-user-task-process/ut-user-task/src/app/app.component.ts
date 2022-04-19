import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApproveTaskPayload, ICETask, RejectTaskPayload } from '@xa/lib-ui-common';
import { TaskContextFormsBaseClass } from 'projects/base-usecase-classes/task-context-forms-base-class';

@Component({
  selector: 'test-user-task-ut-user-task',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends TaskContextFormsBaseClass  implements ICETask, OnInit, OnDestroy {

  title = 'Test User Task';

  constructor(private fb: FormBuilder) {
    super();
  }

  buildForm() {
    this.form = this.fb.group({
      Customer: ['ACME'],
      Test1: ['Test UT 1'],
      Test2: ['Test UT 2'],
      Test3: ['Test UT 3'],
      Aborted: false,
      Comment: ['Test UT 4']
    });
  }

  setContextCallbacks(): void {
    console.debug(this.title, 'setContextCallbacks()');

    this.Context.OnApprove(() => this.onApprove());
    this.Context.OnReject(() => this.onReject());
    this.Context.OnFeedback(() => this.feedback());
  }

  customOnInit(): void {
    this.Context.Valid = true;
  }

  onApprove(): ApproveTaskPayload {

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

    this.form.get('Aborted')!.setValue(true);
    console.log(this.form.value);
    return {
      resultName: 'Aborted',
      reasonName: 'ApprovalComment',
      resultValue: this.form.get('Aborted')!.value
    };
  }

}
