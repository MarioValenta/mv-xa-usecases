import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FeedbackRequestPayload, ICERequestContext, ICETaskContext } from '@xa/lib-ui-common';
import { IFormControlSettingsObject } from 'projects/shared/interfaces/iform-control-settings-object';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  template: ''
})
export abstract class FormBaseComponent implements OnInit, OnDestroy {

  @Input() Context!: ICERequestContext | ICETaskContext;

  title: string = 'empty title';
  form: FormGroup = new FormGroup({});
  destroy$ = new Subject<any>();

  constructor(@Inject(String) title?: string) {
    if (title) {
      this.title = title;
    }
  }

  setValidationService?(): void;
  abstract buildForm(): void;
  checkFormValuesChanges?(): void;
  abstract onSubmit(): any;
  customOnInit?(): void;
  setTaskContextCallbacks?(): void;

  ngOnInit(): void {
    console.debug(this.title, 'onInit()');

    this.buildForm();
    this.setValidationService && this.setValidationService();
    this.checkFormValuesChanges && this.checkFormValuesChanges();
    this.setFormStatusChangeListener();
    this.setBasicContextCallbacks();
    this.setFormDataFromPayload();
    this.customOnInit && this.customOnInit();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  setBasicContextCallbacks(): void {
    console.debug(this.title, 'setBasicContextCallbacks()');

    this.Context.OnSubmit(() => this.onSubmit());
    this.Context.OnFeedback(() => this.onFeedback());

    // set the ICETaskContext callbacks like reject, approve only if function is implemented
    this.setTaskContextCallbacks && this.setTaskContextCallbacks();
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

  onFeedback(): FeedbackRequestPayload {
    return this.form.value;
  }

  buildFormControlObject(formControlKey: string, formControlLabel?: string, formControlPlaceholder?: string): IFormControlSettingsObject {
    return {
      key: formControlKey,
      label: formControlLabel ? formControlLabel : formControlKey,
      placeholder: formControlPlaceholder ? formControlPlaceholder : 'enter ' + formControlKey
    };
  }
}
