import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackRequestPayload, ICERequest, ICERequestContext } from '@xa/lib-ui-common';
import { FlatpickrOptions } from 'projects/shared/ng2-flatpickr/ng2-flatpickr.module';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from './data.service';

@Component({
  selector: 'universal-tap-execution-kfa-deployment-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements ICERequest, OnInit, OnDestroy {

  @Input() public Context: ICERequestContext;

  title = 'KFA-Deployment';
  form: FormGroup;
  destroy$ = new Subject();

  constructor(private fb: FormBuilder, dataService: DataService) {
    dataService.getCatalogDbData('test').subscribe(values => {
      console.log(values);
    });
   }

  startOptions: FlatpickrOptions = {
    enableTime: true,
    mode: 'single',
    time_24hr: true,
    weekNumbers: true,
    minuteIncrement: 15,
    defaultHour: 10,
    altInput: true,
    altFormat: 'l j.F Y, H:i',
    minDate: this.getDate()
  };

  ngOnInit() {

    this.buildForm();

    this.form.statusChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(status => this.Context.Valid = status);

    this.Context.OnSubmit(() => this.submit());
    this.Context.OnFeedback(() => this.feedback());

    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload);
    }

  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private buildForm() {

    this.form = this.fb.group({
      Startdate: ['', Validators.required]
    });

  }

  feedback(): FeedbackRequestPayload {
    return this.form.value;
  }

  submit() {
    if (this.form.valid) {
      console.debug(this.form.value);
    } else {
      console.error('Form is not valid', this.form);
    }
    const model = this.form.value;
    return {
      value: model,
      identifier: `${this.title}-${model.Startdate}`
    };
  }

  dateSelected(event: any) {
  }

  public getDate() {
    const dt = new Date();
    return new Date(dt.setHours(dt.getHours(), dt.getMinutes() + 30, 0, 0));
  }
}
