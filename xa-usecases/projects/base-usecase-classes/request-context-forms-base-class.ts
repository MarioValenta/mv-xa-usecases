import { Component, Inject, Input, OnInit } from '@angular/core';
import { ICERequest, ICERequestContext } from '@xa/lib-ui-common';
import { takeUntil } from 'rxjs/operators';
import { FormsBaseClass } from './forms-base-class';

@Component({
  template: ''
})
export class RequestContextFormsBaseClass extends FormsBaseClass implements OnInit, ICERequest {

  @Input() Context!: ICERequestContext;

  requestFormIdentifier: string = 'EMPTY';

  constructor(@Inject(String) title?: string) {
    super(title);
  }

  ngOnInit(): void {
    this.form.statusChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(status => this.Context.Valid = status);

    this.Context.OnSubmit(() => this.onSubmitRequest());
    this.Context.OnFeedback(() => this.feedback());
  }

  onSubmitRequest() {
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
