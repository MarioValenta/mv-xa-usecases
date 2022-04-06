import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ICETask, ICETaskContext, FeedbackRequestPayload } from '@xa/lib-ui-common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'server-rundown-ut-nas-offline',
  templateUrl: './app.component.html'
})
export class AppComponent implements ICETask, OnInit, OnDestroy {

  @Input() Context!: ICETaskContext;

  form: FormGroup;
  info: any;
  daystokeep: any;
  VolumestoKeepLonger: any;
  destroy$ = new Subject<any>();

  constructor(private fb: FormBuilder) {

    this.form = this.fb.group({
      Partitions: [''],
      NAS: [''],
      interfaces: [''],
      nasdone: [false, Validators.requiredTrue]

    });

  }


  ngOnDestroy() {
    this.destroy$.next();
  }

  ngOnInit() {

    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload);
    }

    console.log(this.Context.Payload);

    this.info = this.Context.Payload.info;
    this.daystokeep = this.Context.Payload.DaystoKeep;
    this.VolumestoKeepLonger = this.Context.Payload.VolumestoKeepLonger;

    this.form.statusChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(status => this.Context.Valid = status);

    this.Context.OnSubmit(() => this.Submit());
    this.Context.OnFeedback(() => this.Feedback());

  }

  Submit() {

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
