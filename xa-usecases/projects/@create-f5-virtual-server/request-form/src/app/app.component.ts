import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ICERequest, ICERequestContext, FeedbackRequestPayload } from '@xa/lib-ui-common';
import { takeUntil, take } from 'rxjs/operators';
import { Subject, of, Observable } from 'rxjs';
import { DataService } from './data.service';
import { ValidationService } from '@xa/validation';
import { ValidatorConfig } from '@xa/validation/lib/Validation/ValidatorConfig';
import { PlaceholderPipe } from 'projects/shared/pure-pipes/placeholder.pipe';

@Component({
  selector: 'create-f5-virtual-server-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class RequestFormComponent implements ICERequest, OnInit, OnDestroy {

  @Input() Context: ICERequestContext;

  form: FormGroup;
  destroy$ = new Subject();
  placeholderPipe: PlaceholderPipe = new PlaceholderPipe();

  dropDownConfig: any = {
    selectOnKeydown: true,
    allowAdditions: true,
    hideAdditions: false,
    templates: {
      addition: function (search: string) {
        return 'use custom WBS ' + search.substring(4)
      }
    }
  };

  //varaibles for values in the form
  Customers$: Observable<string[]>;
  WBS$: Observable<Array<string>>;
  Network$: Observable<any[]>;
  Environment$: Observable<any[]>;
  Protocol$: Observable<string[]>;
  Persistence$: Observable<string[]>;
  HealthCheck$: Observable<string[]>;
  customerFirstChange: boolean = false;

  networksByCustomer = [];

  constructor(private fb: FormBuilder, private dataService: DataService, private cref: ChangeDetectorRef,
    public validationService: ValidationService) {
    this.Customers$ = this.dataService.getCustomers();
    this.Network$;
    this.Environment$ = this.dataService.getEnvironments();
    this.Protocol$ = of(['TCP', 'UDP']);
    this.Persistence$ = of(['none', 'cookie insert', 'source IP', 'existing cookie']);
    this.HealthCheck$ = of(['TCP', 'UDP', 'HTTP', 'HTTPS', 'ICMP']);
  }

  loaded = false;
  contentCertificateKeyPlaceholder = '';
  contentCertificatePlaceholder = '';

  buildForm() {

    this.form = this.fb.group({
      Customer: [''],
      WBS: [{ value: '', disabled: true }],
      DNSName: [''],
      Network: [{ value: '', disabled: true }],
      NetworkRequestOptions: this.fb.group({
        IPv4: [false],
        IPv6: [false],
        SelectIPVersion: [false],
        SelectedLANLabel: ['']
      }),
      Environment: [{ value: '', disabled: true }],
      Protocol: ['TCP'],
      ServicePort: [''],
      SSLTLSTermination: [false],
      BackendSSLTLS: [''],
      SelectCertificate: [''],
      CertificateKey: [{ value: '', disabled: true }],
      Certificate: [{ value: '', disabled: true }],
      Persistence: [''],
      CookieName: [''],
      HealthCheck: [''],
      SendString: [''],
      ReceiveString: [''],
      ReceiveDisableString: [''],
      Comments: [''],
      PoolMembers: this.fb.array([])
    });
  }

  ngOnInit() {
    this.buildForm();

    if (this.Context.Validation.requestForm) {
      this.validationService.setValidatorsFromConfig(this.form, this.Context.Validation.requestForm, false);
    }

    this.checkChanges();

    this.loaded = true;

    this.setCertificatePlaceholders(this.Context.ConfigPayload.textarea.textLength, this.Context.ConfigPayload.textarea.placeholder);

    this.form.statusChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(status => this.Context.Valid = status);

    this.Context.OnSubmit(() => this.submitForm());
    this.Context.OnFeedback(() => this.feedback());

    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload);
    }

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  get getValidationService(): ValidationService {
    return this.validationService;
  }
  get poolMembers() {
    return this.form.get('PoolMembers') as FormArray;
  }

  setCertificatePlaceholders (maxLength: number, maxLengthPlaceholder: string) {
    if (this.getPlaceholderFromConfig('CertificateKey')) {
      this.contentCertificateKeyPlaceholder = this.placeholderPipe.transform(this.Context, 'CertificateKey');
    } else {
      this.contentCertificateKeyPlaceholder = 'enter PEM Key';
    }

    if (this.getPlaceholderFromConfig('Certificate')) {
      this.contentCertificatePlaceholder = this.placeholderPipe.transform(this.Context, 'Certificate');
    } else {
      this.contentCertificatePlaceholder = 'enter PEM Certificate';
    }

    if (maxLength && maxLengthPlaceholder) {
      this.contentCertificateKeyPlaceholder += maxLengthPlaceholder;
      this.contentCertificatePlaceholder += maxLengthPlaceholder;
    }
  }

  checkChanges() {

    this.form.get('Customer').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedCustomer => {
        if (selectedCustomer) {
          this.WBS$ = this.dataService.getWBSInstallations(selectedCustomer);
          this.form.get('WBS').enable();
          this.form.get('Network').enable();
          this.form.get('Environment').enable();
        } else {
          this.form.get('WBS').disable();
          this.form.get('Network').disable();
          this.form.get('Environment').disable();
        }
      });

    this.form.get('Network').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        let selectedLAN = this.getObjectByValue(this.networksByCustomer, 'ID', val);
        if (selectedLAN.length > 0) {
          this.SetLanRequestOptions(selectedLAN[0].RequestIpVersion);
          this.form.get('NetworkRequestOptions.SelectedLANLabel').patchValue(selectedLAN[0].label);
        }
      });

    this.form.get('SSLTLSTermination').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(sslTLSTerminationValue => {
        if (sslTLSTerminationValue) {
          this.form.get('SelectCertificate').enable();
        } else {
          this.form.get('SelectCertificate').disable();
          this.form.get('CertificateKey').disable();
          this.form.get('Certificate').disable();
        }
      });

    this.form.get('SelectCertificate').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(certificateValue => {

        if (certificateValue === 'provideCert') {
          this.form.get('CertificateKey').enable();
          this.form.get('Certificate').enable();
        } else {
          this.form.get('CertificateKey').disable();
          this.form.get('Certificate').disable();
        }

      });

    this.form.get('HealthCheck').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(healthCheckValue => {
        if (healthCheckValue === 'HTTP' || healthCheckValue === 'HTTPS') {
          this.form.get('SendString').enable();
          this.form.get('ReceiveString').enable();
          this.form.get('ReceiveDisableString').enable();
        } else {
          this.form.get('SendString').disable();
          this.form.get('ReceiveString').disable();
          this.form.get('ReceiveDisableString').disable();
        }
      });

    this.form.get('Persistence').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(persistenceValue => {
        if (persistenceValue === 'existing cookie') {
          this.form.get('CookieName').enable();
        } else {
          this.form.get('CookieName').disable();
        }
      });
  }

  CustomerSelected() {

    // After the user changes the value of the Customer, only then the dependend
    // elements should be resetted. With this if (this.customerFirstChange) {} the cloning is possible,
    // without resetting the dependend elements when the value of Customer changes.

    if (this.customerFirstChange) {
      this.form.get('Network').patchValue('');
      this.form.get('Environment').patchValue('');
      this.form.get('WBS').patchValue('');
    }

    this.Network$ = this.dataService.getLANsByCustomer(this.form.get('Customer').value);
    this.Network$
      .pipe(take(1))
      .subscribe(networks => { this.networksByCustomer = networks; });

    this.customerFirstChange = true;
  }

  private SetLanRequestOptions(requestIpVersion: number) {
    switch (requestIpVersion) {
      case 0: {
        this.form.get('NetworkRequestOptions.IPv4').patchValue(false);
        this.form.get('NetworkRequestOptions.IPv6').patchValue(false);
        this.form.get('NetworkRequestOptions.SelectIPVersion').patchValue(false);
        break;
      }
      case 4: {
        this.form.get('NetworkRequestOptions.IPv4').patchValue(true);
        this.form.get('NetworkRequestOptions.IPv6').patchValue(false);
        this.form.get('NetworkRequestOptions.SelectIPVersion').patchValue(false);
        break;
      }
      case 6: {
        this.form.get('NetworkRequestOptions.IPv4').patchValue(false);
        this.form.get('NetworkRequestOptions.IPv6').patchValue(true);
        this.form.get('NetworkRequestOptions.SelectIPVersion').patchValue(false);
        break;
      }
      case 10: {
        this.form.get('NetworkRequestOptions.IPv4').patchValue(false);
        this.form.get('NetworkRequestOptions.IPv6').patchValue(false);
        this.form.get('NetworkRequestOptions.SelectIPVersion').patchValue(true);
        break;
      }
    }
  }

  getPlaceholderFromConfig(formControlName: string): string {
    return (this.Context &&
      this.Context.ConfigPayload.placeholders &&
      this.Context.ConfigPayload.placeholders[formControlName]) ?
      this.Context.ConfigPayload.placeholders[formControlName] : null;
  }

  getObjectByValue = function (array: any[], key: string | number, value: any) {
    return array.filter(function (object) {
      return object[key] === value;
    });
  };

  getConfigsForPoolMembers(varName: string): ValidatorConfig {
    return this.validationService.validatorConfigList.get('PoolMembers').fields.find(item => item.varName === varName);
  }

  createPoolMemberItem(element: any): FormGroup {

    if (element) {
      return this.fb.group({
        HostID: [element.HostID, Validators.required],
        PoolMember: [element.PoolMember, Validators.required],
        IPAddress: [element.IPAddress, Validators.required],
        ServicePort: [
          element.ServicePort,
          [
            Validators.required,
            Validators.pattern("^[0-9]*$"),
            Validators.min(this.getConfigsForPoolMembers('ServicePort').min),
            Validators.max(this.getConfigsForPoolMembers('ServicePort').max)
          ]
        ]
      });
    } else {
      return this.fb.group({
        HostID: ['', Validators.required],
        PoolMember: ['', Validators.required],
        IPAddress: ['', Validators.required],
        ServicePort: ['',
          [
            Validators.required,
            Validators.pattern("^[0-9]*$"),
            Validators.min(this.getConfigsForPoolMembers('ServicePort').min),
            Validators.max(this.getConfigsForPoolMembers('ServicePort').max)
          ]
        ]
      });
    }
  }

  updateCIForm(CIs: any) {
    this.form.setControl('PoolMembers', this.fb.array([]));
    if (this.validationService.validatorConfigList.get('PoolMembers').required) {
      this.form.get('PoolMembers').setValidators([Validators.required]);
    }

    CIs.forEach(element => {
      this.poolMembers.push(this.createPoolMemberItem(element));
    });
    this.form.get('PoolMembers').updateValueAndValidity();
  }

  public submitForm() {
    if (this.form.valid) {
      console.debug(this.form.getRawValue());
    } else {
      console.error('Form is not valid', this.form);
    }

    const model = this.form.value;

    return {
      value: model,
      identifier: `${model.Customer} | ${model.DNSName}`
    };
  }

  feedback(): FeedbackRequestPayload {
    return this.form.value;
  }
}
