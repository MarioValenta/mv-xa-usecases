import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { ICERequest, ICERequestContext, FeedbackRequestPayload } from '@xa/lib-ui-common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { DataService } from './data.service';
import { map, takeUntil } from 'rxjs/operators';
import { ValidationService } from '@xa/validation';
import { FlatpickrOptions } from 'ng2-flatpickr';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect/index';
import 'flatpickr/dist/plugins/monthSelect/style.css';



@Component({
  selector: 'patchautomation-process-report-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent implements ICERequest, OnInit, OnDestroy {

  @Input() public Context: ICERequestContext;

  form: FormGroup;
  Customer$: Observable<any[]>;
  destroy$ = new Subject<any>();
  domlayout = 'autoHeight';
  month: string

  constructor(private fb: FormBuilder,
    private dataService: DataService,
    private cref: ChangeDetectorRef,
    private validationService: ValidationService) {

  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }


  ngOnInit() {
    this.BuildForm();

    if (this.Context.Validation.requestForm) {
      this.validationService.setValidatorsFromConfig(this.form, this.Context.Validation.requestForm);
    }

    this.form.statusChanges
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(status => {
        this.Context.Valid = status;
      });

    this.Context.OnSubmit(() => this.Submit());
    this.Context.OnFeedback(() => this.Feedback());

    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload);
    }

  }


  PeriodOptions: FlatpickrOptions = {
    enableTime: false,
    maxDate: new Date(),

    plugins: [
      monthSelectPlugin({
        dateFormat: "M.Y", //defaults to "F Y"
        altFormat: "M.Y", //defaults to "F Y"
      })
    ],

    onChange: (date: string | number | Date) => {

      if (date) {
        const datestart = new Date(date);
        const startetFrom = ("0" + (datestart.getMonth() + 1)).slice(-2) + "." + datestart.getFullYear();
        this.cref.markForCheck();
        this.form.get('Period').patchValue(startetFrom);
        this.month = (datestart).toLocaleString('en-US', { month: 'long' })
      }
    }
  }

  private BuildForm() {

    this.form = this.fb.group({
      CountryCode: ['ALPINE', Validators.required],
      Customer: ['ALL', Validators.required],
      Period: ['', Validators.required],
      ContactInfo: ['', Validators.required]
    });

    this.formControlValueChanges(this.form);

  }

  isFormElementRequired(elementName: string) {
    return this.validationService.validatorConfigList.get(elementName)
      ? (this.validationService.validatorConfigList.get(elementName).required || this.validationService.validatorConfigList.get(elementName).requiredTrue)
      : false;
  }

  formControlValueChanges(fg: FormGroup) {

    fg.get('CountryCode').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        if (val) {
          this.Customer$ = this.dataService
            .GetCustomers(val)
            .pipe(
              takeUntil(this.destroy$),
              map(customers => {
                customers.unshift({ label: 'ALL', sm9name: 'ALL' });
                return customers;
              }));

        }
      })


  }


  Submit() {

    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      console.error('Form is not valid', this.form);
    }

    const model = this.form.getRawValue();
    model['ContactInfo'] = this.form.get('ContactInfo').value.replace(/\s*,\s*/g, ",");
    console.log(model)

    return {
      value: model,
      identifier: `PatchAutomation report , ${this.month}`
    };
  }

  Feedback(): FeedbackRequestPayload {

    return this.form.value;
  }


}



