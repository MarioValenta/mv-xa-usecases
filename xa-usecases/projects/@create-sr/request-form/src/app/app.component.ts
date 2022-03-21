import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { ICERequest, ICERequestContext, FeedbackRequestPayload } from '@xa/lib-ui-common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ValidationService } from '@xa/validation';
import { CustomerDto } from './dtos/CustomerDTO';
import { DataService } from './data.service';

@Component({
  selector: 'create-sr-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent implements ICERequest, OnInit, OnDestroy {

  @Input() public Context: ICERequestContext;

  title = 'RequestForm';
  form: FormGroup;
  destroy$ = new Subject<any>();
  AssignmentGroups$: Observable<Array<string>> = null;
  Customers$: Observable<Array<CustomerDto>> = null;
  customers: Array<CustomerDto> = [];


  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    public validationService: ValidationService
  ) {

    this.AssignmentGroups$ = this.dataService.getAppSupportedBy();
    this.Customers$ = this.dataService.getCustomers().pipe(tap((customers: Array<CustomerDto>) => {
      this.customers = customers;
    }));
  }

  buildForm() {
    this.form = this.formBuilder.group({
      Customer: [''],
      CustomerSM9Name: [''],
      Title: [''],
      ServiceRequestDescriptionTextArea: [''],
      AssignmentGroup: [''],
      Attachments: [[]],
      MailAddressesShareInformation: ['']
    });
  }

  ngOnInit() {
    this.buildForm();

    if (this.Context.Validation.requestForm) {
      this.validationService.setValidatorsFromConfig(this.form, this.Context.Validation.requestForm, false);
    }

    this.form.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => this.Context.Valid = status);

    this.Context.OnSubmit(() => this.submit());
    this.Context.OnFeedback(() => this.feedback());

    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  customerSelected() {
    this.form
      .get('Customer')
      .setValue(
        this.getSelectedCustomerBySM9name(this.form.get('CustomerSM9Name').value) ?
          this.getSelectedCustomerBySM9name(this.form.get('CustomerSM9Name').value).label : null
      );
  }

  isFormElementRequired(elementName: string) {
    return this.validationService.validatorConfigList.get(elementName)
      ? (this.validationService.validatorConfigList.get(elementName).required || this.validationService.validatorConfigList.get(elementName).requiredTrue)
      : false;
  }

  getSelectedCustomerBySM9name(customerSM9Name: String): CustomerDto {
    return this.customers.filter(customerItem => customerItem.sm9name === customerSM9Name)[0];
  }

  submit() {
    if (!this.form.valid) {
      console.error('Form is not valid', this.form);
    }

    return {
      value: this.form.getRawValue(),
      identifier: `${this.form.get('CustomerSM9Name').value}_${this.form.get('Title').value
        }`
    };
  }

  feedback(): FeedbackRequestPayload {
    return this.form.value;
  }

}
