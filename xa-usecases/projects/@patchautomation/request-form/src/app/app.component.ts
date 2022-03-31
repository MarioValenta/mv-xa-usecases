import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackRequestPayload, ICERequest, ICERequestContext } from '@xa/lib-ui-common';
import { ValidationService } from '@xa/validation';
import { getFlatpickrSettings } from 'projects/shared.functions';
import { FlatpickrOptions } from 'projects/shared/ng2-flatpickr/ng2-flatpickr.module';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { CiTableComponent } from './ci-table/ci-table.component';
import { CustomerDTO } from './customer-dto';
import { DataService } from './data.service';


@Component({
  selector: 'patchautomation-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({ opacity: 1 })),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({ opacity: 0 }),
        animate(600)
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(400, style({ opacity: 0 })))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements ICERequest, OnInit, OnDestroy {

  @ViewChild(CiTableComponent) child: CiTableComponent;
  @Input() public Context: ICERequestContext;

  title = 'RequestForm';
  form: FormGroup;
  destroy$ = new Subject<any>();
  loaded = false;
  showMessageBox: boolean = true;

  customers: Array<CustomerDTO> = [];
  Customers$: Observable<CustomerDTO[]> = this.dataService.GetCustomers().pipe(tap((value: CustomerDTO[]) => {
    this.customers = value;
  }));

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private dataService: DataService
  ) {

  }

  startOptions: FlatpickrOptions = getFlatpickrSettings();

  buildForm() {
    this.form = this.fb.group({
      OptionalIdentifier: [''],
      Identifier: ['', Validators.required],
      Startdate: ['', Validators.required],
      Customer: ['', Validators.required],
      CIs: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.buildForm();
    this.loaded = true;
    this.validationService.setValidatorsFromConfig(this.form, this.Context.Validation.requestForm);

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

    let finalIdentifier = "";

    if (this.form.get('OptionalIdentifier').value) {
      finalIdentifier = this.form.get('Identifier').value + ' | ' + this.form.get('OptionalIdentifier').value;
    } else {
      finalIdentifier = this.form.get('Identifier').value;
    }

    return {
      value: this.form.getRawValue(),
      identifier: `${finalIdentifier}`
    };
  }

  feedback(): FeedbackRequestPayload {
    return this.form.value;
  }

  closeMessageBox() {
    this.showMessageBox = false;
  }

  updateCIForm(CIs) {
    this.form.get('CIs').setValue(CIs);
  }

  customerSelected(event: any) {
    this.form.get('CIs').setValue('');
    this.child.clearCIs();
    this.createIdentifier();
  }

  dateSelected(event: any) {
    this.createIdentifier();
  }

  createIdentifier(): void {
    let customerShortName = '<cust-short>';
    let selectedDate: Date = null;
    let date: string = '<date>';

    if (this.form.get('Customer').value) {
      customerShortName = this.customers.find((item: CustomerDTO) => item.sm9name === this.form.get('Customer').value).CUSTOMERNICKNAME;
    }

    if (this.form.get('Startdate').value) {
      selectedDate = new Date(this.form.get('Startdate').value);
      date = selectedDate.getFullYear().toString().substring(2, 4)
        + '-' + this.appendLeadingZeroToNumber(selectedDate.getMonth() + 1)
        + '-' + this.appendLeadingZeroToNumber(selectedDate.getDate())
        + ' ' + this.appendLeadingZeroToNumber(selectedDate.getHours())
        + this.appendLeadingZeroToNumber(selectedDate.getMinutes());
    }

    this.form.get('Identifier').setValue(customerShortName + ' | Autopatch | ' + date);
  }

  appendLeadingZeroToNumber(value: number): string {
    return ("0" + value).slice(-2);
  }

}
