import { Component, Inject, Input, OnInit } from '@angular/core';
import { ICETask, ICETaskContext } from '@xa/lib-ui-common';
import { takeUntil } from 'rxjs/operators';
import { FormsBaseClass } from './forms-base-class';

@Component({
  template: ''
})
export class TaskContextFormsBaseClass extends FormsBaseClass implements OnInit, ICETask {

  @Input() Context!: ICETaskContext;

  constructor(@Inject(String) title?: string) {
    super(title);
  }

  ngOnInit(): void {
    this.form.statusChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(status => this.Context.Valid = status);

    this.Context.OnSubmit(() => this.onSubmitTask());
    this.Context.OnFeedback(() => this.feedback());
  }

  onSubmitTask() {
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
