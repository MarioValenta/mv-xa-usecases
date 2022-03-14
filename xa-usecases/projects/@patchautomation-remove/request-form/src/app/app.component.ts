import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Input } from '@angular/core';
import { ICERequest, ICERequestContext, FeedbackRequestPayload } from '@xa/lib-ui-common';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'patchautomation-remove-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements ICERequest, OnInit, OnDestroy {

  @Input() public Context: ICERequestContext;

  title = 'RequestForm';
  form: FormGroup;
  destroy$ = new Subject<any>();
  loaded = false;
  loadedContext = null;

  constructor(
    private fb: FormBuilder
  ) {

  }

  buildForm() {
    this.form = this.fb.group({
      Identifier: ['', Validators.required],
      processId: ['', Validators.required],
      CIs: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.buildForm();
    this.loaded = true;

    this.form.statusChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(status => this.Context.Valid = status
    );

    this.Context.OnSubmit(() => this.submit());
    this.Context.OnFeedback(() => this.feedback());

    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  submit() {
    if (!this.form.valid) {
      console.error('Form is not valid', this.form);
    }

    return {
      value: this.form.getRawValue(),
      identifier: `${this.form.get('Identifier').value}`
    };
  }

  feedback(): FeedbackRequestPayload {
    return this.form.value;
  }

  updateCIForm(CIs: any) {
    this.form.get('CIs').setValue(CIs);
  }
}
