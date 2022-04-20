import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApproveTaskPayload, FeedbackRequestPayload, ICETask, ICETaskContext, RejectTaskPayload } from '@xa/lib-ui-common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'create-ip-network-ut-approve',
  templateUrl: './app.component.html',
  styleUrls: ['./create-ip-styles.component.scss']
})
export class AppComponent implements ICETask, OnInit, OnDestroy {

  @Input() Context!: ICETaskContext;

  form: FormGroup;

  destroy$ = new Subject<any>();

  public childformvalid: Boolean;
  public allvalid: Boolean;


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
      Aborted: false,
      ApprovalComment: [''],

    });

  }

  ngOnInit() {

    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload);
    }

    this.form.statusChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(status => {

      if (status === 'VALID' && this.childformvalid === true) {
        this.Context.Valid = true;
      } else {
        this.Context.Valid = false;
      }

    })


    this.Context.OnApprove(() => this.Approve());
    this.Context.OnReject(() => this.Reject());
    this.Context.OnFeedback(() => this.Feedback());

  }

  OnChildFormValid(formvalid: boolean) {

    this.childformvalid = formvalid;
    this.allvalid = this.form.valid && formvalid;

    if (this.allvalid === true) {

      this.Context.Valid = true;

    } else {
      this.Context.Valid = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }


  Reject(): RejectTaskPayload {

    this.form.get('Aborted').setValue(true);
    console.log(this.form.value);
    return {
      resultName: 'Aborted',
      reasonName: 'ApprovalComment',
      resultValue: this.form.get('Aborted').value
    };
  }

  Approve(): ApproveTaskPayload {

    return {
      value: this.form.value,
      runtimeData: this.form.value
    };
  }

  Feedback(): FeedbackRequestPayload {

    return this.form.value;
  }
}
