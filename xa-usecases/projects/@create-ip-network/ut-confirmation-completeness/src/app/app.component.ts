import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ICETask, ICETaskContext, SubmitTaskPayload, FeedbackRequestPayload } from '@xa/lib-ui-common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'create-ip-network-ut-confirmation-completeness',
  templateUrl: './app.component.html',
  styleUrls: ['./create-ip-styles.component.scss'],
})

export class AppComponent implements ICETask, OnInit, OnDestroy {

  @Input() Context: ICETaskContext;

  form: FormGroup;

  destroy$ = new Subject<any>();

  constructor(private fb: FormBuilder) {

    this.form = this.fb.group({
      Confirmation: ['', Validators.required],
      Feedback: [''],

    });
  }



  public NetworkItems;
  public AffectedDevices = [];

  ngOnInit(): void {

    this.NetworkItems = this.Context.Payload.NetworkItems;
    this.GetAffectedDevices(this.NetworkItems);


    this.form.statusChanges.pipe(
      takeUntil(this.destroy$),
      map(status => this.Context.Valid = status)
    ).subscribe();

    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload);
    }

    console.log(this.Context);
    this.Context.OnSubmit(() => this.Submit());
    this.Context.OnFeedback(() => this.Feedback());
  }


  GetAffectedDevices(NetworkItems: any[]) {

    NetworkItems.forEach(element => {
      this.AffectedDevices.push(element.AffectedDevices);

    });

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

