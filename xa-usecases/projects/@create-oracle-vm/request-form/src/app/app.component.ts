import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ICERequest, ICERequestContext, FeedbackRequestPayload } from '@xa/lib-ui-common';
import { takeUntil, switchMap } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { DataService } from './data-service.service';
import { ValidationService } from '@xa/validation';

@Component({
    selector: 'create-oracle-vm-request-form',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements ICERequest, OnInit, OnDestroy {

    @Input() Context!: ICERequestContext;
    @ViewChild('customerDropDown') customerDropDown;

    form!: FormGroup;
    destroy$ = new Subject();

    Customers$: Observable<string[]>;
    Environments$: Observable<string[]>;
    DBVersion$: Observable<string[]>;
    ServiceSupportTimeDetails$!: Observable<string[]>;

    identifier: string = '';

    CustomerLANs$!: Observable<string[]>;
    AdminvLANs$!: Observable<string[]>;
    TsmvLANs$!: Observable<string[]>;
    NASLANs$!: Observable<string[]>;

    cpuRangeOptions = null;
    memoryRangeOptions = null;
    dbRangeOptions = null;

    constructor(private fb: FormBuilder, private dataService: DataService, private validationService: ValidationService) {
        this.Customers$ = this.dataService.GetCustomers();
        this.Environments$ = this.dataService.GetEnvironments();
        this.DBVersion$ = this.dataService.GetDBVersions();
    }

    buildForm() {

        this.form = this.fb.group({
            Customer: [''],
            Environment: [''],
            ServiceSupportTime: [''],
            ServiceSupportTimeDetails: [''],
            DBVersion: [''],
            Hostname: [''],
            VMOptions: this.fb.group({
                VRAM: [8, Validators.required],
                VCPU: [1, Validators.required],
                VRAMm: [8, Validators.required],
                VCPUm: [1, Validators.required],
                NumberOfDBs: [0, Validators.required],
                NumberOfDBsM: [0, Validators.required],
            }),

            ChangeImplementationWBS: [''],
            ServiceOperationWBS: [''],
            DatacenterSite: [''],
            LANSettings: this.fb.group({
                TSMLAN: [{ value: null, disabled: true }, Validators.required],
                TSMvLAN: [{ value: '', disabled: true }, Validators.required],
                AdminLAN: [{ value: null, disabled: true }, Validators.required],
                AdminvLAN: [{ value: '', disabled: true }, Validators.required],
                AdminLANDomain: [{ value: '', disabled: true }, Validators.required],
                CustomerLAN: [{ value: '', disabled: true }, Validators.required],
                CustomerLANDomain: [{ value: '', disabled: true }],
                NASLAN: [{ value: '', disabled: true }, Validators.required]
            }),

            DNSServer1: [''],
            DNSServer2: [''],
            NTPServer1: [''],
            NTPServer2: [''],
            Agree: ['']
        });
    }

    ngOnInit() {

        this.cpuRangeOptions = this.Context.ConfigPayload.rangeOptions.cpuRangeOptions;
        this.memoryRangeOptions = this.Context.ConfigPayload.rangeOptions.memoryRangeOptions;
        this.dbRangeOptions = this.Context.ConfigPayload.rangeOptions.dbRangeOptions;

        this.buildForm();

        if (this.Context.Validation.requestForm) {
            this.validationService.setValidatorsFromConfig(this.form, this.Context.Validation.requestForm);
        }

        this.checkChanges();

        this.form.statusChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe(status => this.Context.Valid = status);

        this.Context.OnSubmit(() => this.SubmitForm());
        this.Context.OnFeedback(() => this.Feedback());

        if (this.Context.Payload) {
            this.form.patchValue(this.Context.Payload);
        }
    }

    isFormElementRequired(elementName: string) {
        return this.validationService.validatorConfigList.get(elementName)
            ? (this.validationService.validatorConfigList.get(elementName)!.required || this.validationService.validatorConfigList.get(elementName)!.requiredTrue)
            : false;
    }

    checkChanges() {

        this.form.get('Customer')!.valueChanges.pipe(
            takeUntil(this.destroy$)).subscribe(
                selectedCustomer => {
                    if (selectedCustomer) {

                        this.TsmvLANs$ = this.dataService.GetTsmLANsFor(selectedCustomer);
                        this.CustomerLANs$ = this.dataService.GetCustomerLANsFor(selectedCustomer);
                        this.AdminvLANs$ = this.dataService.GetAdminLANsFor(selectedCustomer);
                        this.NASLANs$ = this.dataService.GetStorageLANsFor(selectedCustomer);

                        // this.TsmvLANs$.subscribe(res => console.log(res));
                        // this.CustomerLANs$.subscribe(res => console.log(res));
                        // this.AdminvLANs$.subscribe(res => console.log(res));
                        // this.NASLANs$.subscribe(res => console.log(res));

                        this.form.get('LANSettings.TSMvLAN')!.enable();
                        this.form.get('LANSettings.AdminLAN')!.enable();
                        this.form.get('LANSettings.CustomerLAN')!.enable();
                        this.form.get('LANSettings.CustomerLANDomain')!.enable();
                        this.form.get('LANSettings.NASLAN')!.enable();

                        // if (selectedCustomer === 'TMA') {
                        //     this.form.get('LANSettings.AdminLAN').patchValue('no');
                        // } else {
                        //     this.form.get('LANSettings.AdminLAN').patchValue('yes');
                        // }
                        this.form.get('LANSettings.AdminLAN')!.patchValue('no');

                        this.form.get('LANSettings.TSMvLAN')!.patchValue('');
                        this.form.get('LANSettings.CustomerLAN')!.patchValue('');
                        this.form.get('LANSettings.CustomerLANDomain')!.patchValue('');
                        this.form.get('LANSettings.NASLAN')!.patchValue('');
                    } else {
                        this.form.get('LANSettings.TSMvLAN')!.patchValue('');
                        this.form.get('LANSettings.AdminLAN')!.patchValue('');
                        this.form.get('LANSettings.CustomerLAN')!.patchValue('');
                        this.form.get('LANSettings.CustomerLANDomain')!.patchValue('');
                        this.form.get('LANSettings.NASLAN')!.patchValue('');

                        this.form.get('LANSettings.TSMvLAN')!.disable();
                        this.form.get('LANSettings.AdminLAN')!.disable();
                        this.form.get('LANSettings.CustomerLAN')!.disable();
                        this.form.get('LANSettings.CustomerLANDomain')!.disable();
                        this.form.get('LANSettings.NASLAN')!.disable();
                    }
                }
            )

        this.form.get('Environment')!.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(selectedEnvironment => {
                if (selectedEnvironment) {

                    if (selectedEnvironment === 'Production' || selectedEnvironment === 'PROD') {
                        this.form.get('LANSettings.TSMLAN')!.enable();
                        this.form.get('LANSettings.TSMLAN')!.patchValue('yes');
                    } else {
                        this.form.get('LANSettings.TSMLAN')!.enable();
                        this.form.get('LANSettings.TSMLAN')!.patchValue('');
                    }

                } else {
                    this.form.get('LANSettings.TSMLAN')!.patchValue('');
                    this.form.get('LANSettings.TSMLAN')!.disable();
                }
            });

        this.form.get('ServiceSupportTime')!.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                switchMap(value => {
                    this.ServiceSupportTimeDetails$ = this.dataService.GetServiceTimeDetails(value);
                    return this.ServiceSupportTimeDetails$;
                })
            )
            .subscribe(value => {
                this.form.get('ServiceSupportTimeDetails')!.patchValue(null);
            }
            );


        this.form.get('LANSettings.TSMLAN')!.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(tsmLAN => {
            if (tsmLAN === 'yes') {
                this.form.get('LANSettings.TSMvLAN')!.enable();
                this.form.get('LANSettings.TSMvLAN')!.patchValue('');
            } else {
                this.form.get('LANSettings.TSMvLAN')!.patchValue('');
                this.form.get('LANSettings.TSMvLAN')!.disable();
            }
        });

        this.form.get('LANSettings.AdminLAN')!.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(adminLAN => {
            if (adminLAN === 'yes') {
                this.form.get('LANSettings.AdminvLAN')!.enable();
                this.form.get('LANSettings.AdminvLAN')!.patchValue('');
                this.form.get('LANSettings.AdminLANDomain')!.enable();
                this.form.get('LANSettings.AdminLANDomain')!.patchValue('');
            } else {
                this.form.get('LANSettings.AdminvLAN')!.patchValue('');
                this.form.get('LANSettings.AdminvLAN')!.disable();
                this.form.get('LANSettings.AdminLANDomain')!.patchValue('');
                this.form.get('LANSettings.AdminLANDomain')!.disable();
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
    }

    CustomerSelected() {
        this.identifier = this.customerDropDown.ref.nativeElement.querySelector('.text').innerHTML;
    }

    UpdateView() {
        if (this.form.get('VMOptions.VRAM')!.value) {
            this.form.get('VMOptions.VRAMm')!.patchValue(this.form.get('VMOptions.VRAM')!.value);
        }
        if (this.form.get('VMOptions.VCPU')!.value) {
            this.form.get('VMOptions.VCPUm')!.patchValue(this.form.get('VMOptions.VCPU')!.value);
        }
        if (this.form.get('VMOptions.NumberOfDBs')!.value) {
            this.form.get('VMOptions.NumberOfDBsM')!.patchValue(this.form.get('VMOptions.NumberOfDBs')!.value);
        }
    }

    UpdateVRAM() {
        this.form.get('VMOptions.VRAM')!.patchValue(this.form.get('VMOptions.VRAMm')!.value);
    }
    UpdateVCPU() {
        this.form.get('VMOptions.VCPU')!.patchValue(this.form.get('VMOptions.VCPUm')!.value);
    }
    UpdateNumberOfDBs() {
        this.form.get('VMOptions.NumberOfDBs')!.patchValue(this.form.get('VMOptions.NumberOfDBsM')!.value);
    }

    getPlaceholderFromConfigPayload(formElement: string): string {
        return this.Context.ConfigPayload.Placeholders ?
        this.Context.ConfigPayload.Placeholders[formElement] : 'enter '+formElement +'...'
    }

    public SubmitForm() {
        if (this.form.valid && this.identifier) {
            console.debug(this.form);
            console.debug(this.form.value);
        } else {
            console.error('Form is not valid', this.form);
        }

        const model = this.form.value;

        return {
            value: model,
            identifier: `${this.identifier}`
        };
    }

    Feedback(): FeedbackRequestPayload {
        return this.form.value;
    }
}
