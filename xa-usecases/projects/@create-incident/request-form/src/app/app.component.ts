import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Input } from '@angular/core';
import {ICERequest, ICERequestContext, FeedbackRequestPayload } from '@xa/lib-ui-common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ValidationService } from '@xa/validation';
import { DataService } from './data.service';
import { XANotifyService } from '@xa/ui';
import { CustomerDto } from 'projects/@create-sr/request-form/src/app/dtos/CustomerDTO';

@Component({
  selector: 'create-incident-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements ICERequest, OnInit, OnDestroy {
  @Input() public Context!: ICERequestContext;

  title = 'RequestForm';
  form!: FormGroup;
  destroy$ = new Subject<any>();
  Category1$: Observable<Array<any>>;
  Category2$!: Observable<Array<string>>;
  Customers$: Observable<Array<CustomerDto>>;
  customers: Array<CustomerDto> = [];
  loaded = false;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    public validationService: ValidationService,
    public toastService: XANotifyService,
  ) {
    
    this.Customers$ = this.dataService.getCustomers().pipe(
      tap((customers: Array<CustomerDto>) => {
        this.customers = customers;
      })
    );
    this.Category1$ = this.dataService.getCategory1();

    
  }

  buildForm() {
    this.form = this.formBuilder.group({
      Customer: [''],
      CustomerName: [''],
      Title: [''],
      ServiceRequestDescriptionTextArea: [''],
      AssignmentGroup: [''],
      Category1: [''],
      Category2: [''],
      Attachments: [[]],
      MailAddressesShareInformation: [''],
      AffectedCIName: [''],
      CIs: [[]],
    });
  }

  ngOnInit() {
    this.buildForm();

    if (this.Context.Validation.requestForm) {
      this.validationService.setValidatorsFromConfig(
        this.form,
        this.Context.Validation.requestForm,
        false
      );
    }

    this.form.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => (this.Context.Valid = status));

    this.Context.OnSubmit(() => this.submit());
    this.Context.OnFeedback(() => this.feedback());

    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload);
    }
    this.loaded = true;

    this.checkChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  checkChanges() {
    this.form
      .get('Category1')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        if (resp) {
          this.Category2$ = this.dataService.getCategory2(resp);
        }
      });

    this.form
      .get('CIs')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(
        (ci) => {
        if (ci.length >= 0) {
          ci.forEach((element: { CustomerScope: string; Name: string; ID: string; }) => {
            if(element.CustomerScope){
              this.form.get('AssignmentGroup')?.patchValue(element.CustomerScope);
            }
            else {
              this.toastService.error(
                "The selected CI must have a documented support group in CMDB",
                "Couldn't find support group of CI",
                {
                  titleMaxLength: 40,
                  closeOnClick: true,
                  timeout: 3000,
                  pauseOnHover: true
                }
                
              )
            }
            this.form.get('AffectedCIName')?.patchValue(element.Name+'_'+element.ID);

          });       
        } 
        if(ci.length == 0){
          this.form.get('AssignmentGroup')?.patchValue('');
          this.form.get('AffectedCIName')?.patchValue('');
        }
      }
      );
  }
  customerSelected() {
    this.form.get('Customer')?.setValue(
        this.getSelectedCustomerBySM9name(this.form.get('CustomerName')?.value)? this.getSelectedCustomerBySM9name(
              this.form.get('CustomerName')?.value
            ).label
          : null
      );
  }

  updateCIForm(CIs: Array<string>) {
    this.form.get('CIs')?.setValue(CIs);
  }

  isFormElementRequired(elementName: string) {
    return this.validationService.validatorConfigList.get(elementName)
      ? this.validationService.validatorConfigList.get(elementName)?.required ||
          this.validationService.validatorConfigList.get(elementName)?.requiredTrue: false;
  }

  getSelectedCustomerBySM9name(customerSM9Name: String): CustomerDto {
    return this.customers.filter(
      (customerItem) => customerItem.sm9name === customerSM9Name
    )[0];
  }

  submit() {
    if (!this.form.valid) {
      console.error('Form is not valid', this.form);
    }

    return {
      value: this.form.getRawValue(),
      identifier: `${this.form.get('CustomerName')?.value}_${this.form.get('Title')?.value}`,
    };
  }

  feedback(): FeedbackRequestPayload {
    return this.form.value;
  }
}
