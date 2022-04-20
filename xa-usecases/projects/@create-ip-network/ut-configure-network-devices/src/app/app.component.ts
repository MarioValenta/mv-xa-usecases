import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackRequestPayload, ICETask, ICETaskContext, SubmitTaskPayload } from '@xa/lib-ui-common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'create-ip-network-ut-configure-network-devices',
  templateUrl: './app.component.html',
  styleUrls: ['./create-ip-styles.component.scss'],
})

export class AppComponent implements ICETask, OnInit, OnDestroy {

  @Input() Context!: ICETaskContext;

  form: FormGroup;

  destroy$ = new Subject<any>();

  constructor(private fb: FormBuilder) {

    this.form = this.fb.group({
      RequestorFirstName: [''],
      RequestorLastName: [''],
      RequestorEmail: [''],
      Location: [''],
      Customer: [''],
      Description: [''],
      Wbs: [''],
      Comment: [''],
      NetworkItems: [''],
      ConfiguredDevices: [false, Validators.required],
      Aborted: false
    });

  }

  ngOnInit() {

    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload);
    }

    this.form.statusChanges.pipe(
      takeUntil(this.destroy$)
  ).subscribe(status => {

      if (this.form.get('ConfiguredDevices').value === true) {
          this.Context.Valid = true;
      } else {
          this.Context.Valid = false;
      }

  })

    console.log(this.Context);
    this.Context.OnSubmit(() => this.Submit());
    this.Context.OnFeedback(() => this.Feedback());
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  Submit(): SubmitTaskPayload {

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

  Feedback(): FeedbackRequestPayload {
    return this.form.value;
  }

}
