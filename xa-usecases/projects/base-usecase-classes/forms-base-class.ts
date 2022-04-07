import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FeedbackRequestPayload, ICERequestContext, ICETaskContext } from '@xa/lib-ui-common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  template: ''
})
export abstract class FormsBaseClass implements OnInit, OnDestroy {

  @Input() Context!: ICERequestContext | ICETaskContext;

  title: string = 'empty title';
  form: FormGroup = new FormGroup({});
  destroy$ = new Subject<any>();

  constructor(@Inject(String) title?: string) {
    if (title) {
      this.title = title;
    }
  }

  abstract buildForm(): void;
  checkFormValuesChanges?(): void;
  abstract onSubmit(): any;
  customOnInit?(): void;

  ngOnInit(): void {
    console.debug(this.title, 'onInit()');

    this.buildForm();
    this.checkFormValuesChanges && this.checkFormValuesChanges();
    this.setFormStatusChangeListener();
    this.setContextCallbacks();
    this.setFormDataFromPayload();
    this.customOnInit && this.customOnInit();
  }

  setContextCallbacks(): void {
    console.debug(this.title, 'setContextCallbacks()');

    this.Context.OnSubmit(() => this.onSubmit());
    this.Context.OnFeedback(() => this.feedback());
  }

  setFormStatusChangeListener(): void {
    console.debug(this.title, 'setFormStatusChangeListener()');

    this.form.statusChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(status => this.Context.Valid = status);
  }

  setFormDataFromPayload(): void {
    console.debug(this.title, 'setFormDataFromPayload()');

    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  feedback(): FeedbackRequestPayload {
    return this.form.value;
  }
}
