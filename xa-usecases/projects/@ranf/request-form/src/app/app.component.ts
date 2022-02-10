import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Input, ViewChild, AfterViewInit } from '@angular/core';
import { ICERequest, ICERequestContext, FeedbackRequestPayload } from '@xa/lib-ui-common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataService } from './data.service';
import { Subject, Observable, of, EMPTY } from 'rxjs';
import { mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { RANFData } from './models/ranf-data.model';
import { ValidationService } from '@xa/validation';
import { XANotifyService } from '@xa/ui';
import { environment } from '../environments/environment';
import { DebitorCustomerDto } from './dto/DebitorCustomer';
import { CustomerInformationDto } from './dto/CustomerInformation';
import { FlatpickrOptions } from 'projects/shared/ng2-flatpickr/flatpickr-options.interface';

@Component({
    selector: 'ranf-request-form',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent implements ICERequest, OnInit, OnDestroy, AfterViewInit {

    @ViewChild('startPicker') startPicker;
    @ViewChild('endPicker') endPicker;

    @Input() Context: ICERequestContext;

    readonly FORM_KEY_CUSTOMER = 'Customer';
    readonly FORM_KEY_DEBITORID = 'DebitorId';
    readonly FORM_KEY_CUSTOMER_CONTACT = 'CustomerContact';
    readonly FORM_KEY_ACCOUNTS_NUMBER = 'AccountsNumber';
    readonly FORM_KEY_ADDRESS = 'Address';
    readonly FORM_KEY_PERIOD_START = 'PeriodStart';
    readonly FORM_KEY_PERIOD_END = 'PeriodEnd';
    readonly FORM_KEY_UID_NUMBER = 'UIDNumber';
    readonly FORM_KEY_TIME_PAYMENT = 'TimePayment';
    readonly FORM_KEY_DIFFERENT_BILLING_ADDRESS = 'DiffBillAddress';
    readonly FORM_KEY_SETTLEMENT = 'Settlement';
    readonly FORM_KEY_CREDIT_MEMO = 'CreditMemo';
    readonly FORM_KEY_CONTRACT_DURATION = 'ContractDuration';
    readonly FORM_KEY_CONTRACT_NUMBER = 'ContractNumber';
    readonly FORM_KEY_ORDER_NUMBER_OF_CUSTOMER = 'OrderNumberOfCustomer';
    readonly FORM_KEY_BILLING_CYCLE = 'BillingCycle';
    readonly FORM_KEY_HEADER_TEXT = 'HeaderText';
    readonly FORM_KEY_COMMENTS = 'Comments';
    readonly FORM_KEY_ATTACHMENTS = 'Attachments';

    defaultAllowedFileTypes = ['.txt', '.msg', '.xls', '.xlsx', '.ppt', '.pptx', '.doc', '.docx', '.pdf', '.png', '.jpg', '.jpeg'];

    form: FormGroup;
    destroy$ = new Subject();
    Customers$: Observable<any[]>; // {DEBITORNAME: string, DEBITORID: number | string}]
    customers: Array<DebitorCustomerDto> = [];
    AccountsNumbers$: Observable<string[]>;
    UIDNumber$: Observable<string>;
    Addresses$: Observable<string[]>;
    Settlement$: Observable<string[]>;
    TimePayment$: Observable<string[]>;
    BillingCycle$: Observable<string[]>;

    periodStart = this.getDate();
    periodEnd = null;

    startOptions: FlatpickrOptions = {
      locale: {
        firstDayOfWeek: 1
    },
        enableTime: false,
        mode: 'single',
        weekNumbers: true,
        altInput: true,
        altFormat: 'j. F Y',
        dateFormat: "Y-m-d\\Z",
    };

    endOptions: FlatpickrOptions = {
      locale: {
        firstDayOfWeek: 1
    },
        enableTime: false,
        mode: 'single',
        weekNumbers: true,
        altInput: true,
        altFormat: 'j. F Y',
        dateFormat: 'j. F Y\\Z'
    };


    constructor(
        private fb: FormBuilder,
        private validationService: ValidationService,
        private dataService: DataService,
        private xaNotifyService: XANotifyService) {

        this.BillingCycle$ = this.dataService.getBillingCycle();
        this.TimePayment$ = this.dataService.getTimeForPayment();
        this.Settlement$ = this.dataService.getSettlements();
        this.Customers$ = this.dataService.getCustomers().pipe(tap(res => {
            this.customers = res;
        }));
    }

    dropDownConfig: any = {
        selectOnKeydown: true,
        allowAdditions: true,
        hideAdditions: false,
        templates: {
            addition: function (search: string) {
                return 'use custom time for payment ' + search.substring(4)
            }
        }
    };


    buildForm() {
        this.form = this.fb.group({
            Customer: [''],
            DebitorId: [''],
            CustomerContact: [''],
            AccountsNumber: [{ value: '', disabled: true }],
            Address: [{ value: '', disabled: true }],
            UIDNumber: [{ value: '', disabled: true }],
            PeriodStart: [''],
            PeriodEnd: [''],
            TimePayment: [''],
            BillingCycle: [''],
            DiffBillAddress: [''],
            Settlement: [''],
            CreditMemo: [''],
            ContractDuration: [''],
            ContractNumber: [''],
            OrderNumberOfCustomer: [''],
            HeaderText: [''],
            Table: [''],
            SumTotalAmount: [''],
            RawSumTotalAmount: [''],
            Attachments: [[]],
            Comments: ['']
        });
    }

    ngOnInit() {
        this.buildForm();

        if (this.Context.Validation.requestForm) {
            this.validationService.setValidatorsFromConfig(this.form, this.Context.Validation.requestForm, false);
        }

        this.form.statusChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe(status => this.Context.Valid = status);

        this.Context.OnSubmit(() => this.submitForm());
        this.Context.OnFeedback(() => this.feedback());

        this.checkChanges();

        if (this.Context.Payload) {
            this.form.patchValue(this.Context.Payload);
        }
    }

    ngAfterViewInit() {
        this.onValueChangesFlatPicker();
    }

    ngOnDestroy() {
        this.destroy$.next();
    }

    public getDate(addHours = 0) {
        const dt = new Date();
        return new Date(dt.setHours(dt.getHours() + addHours, 0, 0, 0));
    }

    isFormElementRequired(elementName: string) {
        return this.validationService.validatorConfigList.get(elementName)
            ? (this.validationService.validatorConfigList.get(elementName).required || this.validationService.validatorConfigList.get(elementName).requiredTrue)
            : false;
    }

    enableFormElement(formControlName: string, defaultValue?: any) {
        this.form.get(formControlName).enable();
        this.form.get(formControlName).patchValue(defaultValue ? defaultValue : '');
    }

    disableFormElement(formControlName: string) {
        this.form.get(formControlName).patchValue('');
        this.form.get(formControlName).disable();
    }

    logger(level: string, message: string): void {
        if (!environment.production) {
            console.debug('[' + level + ']: ' + message);
        }
    }

    getEnvironment() {
        return environment;
    }

    // Change listeners' wrapper function
    checkChanges() {

        // Customer formControl change listener
        this.form.get(this.FORM_KEY_CUSTOMER).valueChanges.pipe(
            takeUntil(this.destroy$),
            switchMap(selectedDebitorCustomer => {
                this.disableFormElement(this.FORM_KEY_ACCOUNTS_NUMBER);
                this.disableFormElement(this.FORM_KEY_ADDRESS);
                this.disableFormElement(this.FORM_KEY_UID_NUMBER);

                this.logger('DEBUG', `Selected Customer: ${selectedDebitorCustomer}`);
                if (selectedDebitorCustomer && this.customers.length > 0) {
                    let debitor = this.customers.filter((res: DebitorCustomerDto) => res.DEBITORNAME === selectedDebitorCustomer)[0];
                    this.form.get(this.FORM_KEY_DEBITORID).patchValue(debitor.ID);
                    this.logger('DEBUG', `DebitorID: ${this.form.get(this.FORM_KEY_DEBITORID).value}`);
                    return of({ selectedDebitorCustomer: selectedDebitorCustomer, debitor: debitor });
                } else {
                    return of({ selectedDebitorCustomer: selectedDebitorCustomer, debitor: null });
                }
            }),
            switchMap(({ selectedDebitorCustomer, debitor }) => {
                if (debitor) {
                    return this.dataService.GetCustomerInformation(debitor.ID);
                }
                else { return EMPTY; }
            }
            )
        ).subscribe(
            (customerInformation: CustomerInformationDto) => {
                if (customerInformation) {
                    this.enableFormElement(this.FORM_KEY_ACCOUNTS_NUMBER);
                    this.enableFormElement(this.FORM_KEY_ADDRESS);
                    this.enableFormElement(this.FORM_KEY_UID_NUMBER);
                    this.form.get(this.FORM_KEY_ACCOUNTS_NUMBER).patchValue(customerInformation.accountsreceivablenumber);
                    this.form.get(this.FORM_KEY_UID_NUMBER).patchValue(customerInformation.uidnumber);
                    this.form.get(this.FORM_KEY_ADDRESS).patchValue(customerInformation.address);
                } else {
                    this.disableFormElement(this.FORM_KEY_ACCOUNTS_NUMBER);
                    this.disableFormElement(this.FORM_KEY_ADDRESS);
                    this.disableFormElement(this.FORM_KEY_UID_NUMBER);
                }
            }
        );
    }

    readUploadedFileAsURL(inputFile) {
        const temporaryFileReader = new FileReader();

        return new Promise<string>((resolve, reject) => {
            temporaryFileReader.onerror = () => {
                temporaryFileReader.abort();
                reject(new DOMException('Problem parsing input file.'));
            };

            temporaryFileReader.onload = () => {
                resolve(temporaryFileReader.result.toString());
            };
            temporaryFileReader.readAsDataURL(inputFile);
        });
    }

    updateAttachments(files: File[]) {
        const attachmentsBase64: Array<object> = [];
        files.forEach(async (attachment) => {
            await this.readUploadedFileAsURL(attachment).then(data => {
                attachmentsBase64.push({ name: attachment.name, data: data.split(',')[1], size: attachment.size, type: attachment.type });
            });
        });
        this.form.get(this.FORM_KEY_ATTACHMENTS).setValue(attachmentsBase64);
    }

    updateTable(ranfData: Array<RANFData>) {
        this.form.get('Table').setValue(ranfData);
    }

    updateSum(sum: string) {
        this.form.get('SumTotalAmount').setValue(sum);
    }

    updateRawSum(sum: string) {
        this.form.get('RawSumTotalAmount').setValue(sum);
    }

    onValueChangesFlatPicker() {
        this.form.get(this.FORM_KEY_PERIOD_START).valueChanges.subscribe(data => {
          this.logger('DEBUG', data);
          this.logger('DEBUG', this.startPicker.flatpickr.formatDate(data, 'j. F Y', ));
            if (data) {
                this.periodStart = new Date(data);
                this.endPicker.flatpickr.set({ minDate: this.periodStart.setDate(this.periodStart.getDate() + 1) });
            }
        });
        this.form.get(this.FORM_KEY_PERIOD_END).valueChanges.subscribe(data => {
          this.logger('DEBUG', data);
            if (data) {
                this.periodEnd = new Date(data);
                this.logger('DEBUG', this.periodEnd);
                this.startPicker.flatpickr.set({ maxDate: this.periodEnd });
            }
        });
    }

    public submitForm() {
        if (this.form.valid) {
            console.debug(this.form.value);
        } else {
            console.error('Form is not valid', this.form);
        }

        const model = this.form.getRawValue();

        return {
            value: model,
            identifier: `${model.Customer}`
        };
    }

    feedback(): FeedbackRequestPayload {
        return this.form.value;
    }
}
