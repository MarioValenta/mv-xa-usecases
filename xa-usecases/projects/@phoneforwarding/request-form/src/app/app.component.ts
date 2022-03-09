import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { ICERequest, ICERequestContext, FeedbackRequestPayload } from '@xa/lib-ui-common';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DataService } from './data-service.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'phoneforwarding-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements ICERequest, OnInit, OnDestroy {

  title = 'phoneforwarding-request-form';
  @Input() public Context: ICERequestContext;
  form: FormGroup;
  forwardTo: any;
  destroy$ = new Subject<any>();
  endpointData: Observable<string[]>;

  @ViewChild('userDropDown') userDropDown;

  constructor(
    private fb: FormBuilder, private data: DataService) {

  }

  BuildForm() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      forwardTo: ['', Validators.required]
        });
  }

  ngOnInit() {
    this.BuildForm();

    this.form.statusChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(status => this.Context.Valid = status
    );

    this.Context.OnSubmit(() => this.Submit());
    this.Context.OnFeedback(() => this.Feedback());

    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload);
    }

    this.endpointData = this.data.GetDataFromEndpoint(this.Context.ConfigPayload.endpointURL);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  Submit() {
    if (!this.form.valid) {
      console.error('Form is not valid', this.form);
    }

    return {
      value: this.form.value,
      identifier:
        this.userDropDown.ref.nativeElement.querySelector('.text').innerHTML
        + `_${this.form.get('forwardTo').value}`
    };
  }

  Feedback(): FeedbackRequestPayload {
    return this.form.value;
  }


}
