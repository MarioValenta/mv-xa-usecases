import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { RejectTaskPayload, ApproveTaskPayload, FeedbackRequestPayload, ICETaskContext, ICETask, SubmitTaskPayload } from '@xa/lib-ui-common';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { DataService } from './data-service.service';
import { ValidatorConfig } from '@xa/validation/lib/Validation/ValidatorConfig';
import { ValidationService } from '@xa/validation';

@Component({
  selector: 'create-f5-virtual-server-ut-validate',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class UTValidateComponent implements ICETask, OnInit, OnDestroy {

  @Input() Context: ICETaskContext;

  title = 'ValidateRequestData';

  form: FormGroup;

  destroy$ = new Subject<any>();
  F5Cluster$: Observable<string[]>;
  loaded = false;

  constructor(private fb: FormBuilder, private dataService: DataService, public validationService: ValidationService) {

  }

  buildForm() {
    this.form = this.fb.group({
      Customer: [''],
      WBS: [''],
      DNSName: [''],
      Network: [''],
      NetworkRequestOptions: this.fb.group({
        IPv4: [''],
        IPv6: [''],
        SelectIPVersion: [''],
        SelectedLANLabel: ['']
      }),
      Environment: [''],
      Protocol: [''],
      ServicePort: [''],
      SSLTLSTermination: [''],
      SelectCertificate: [''],
      CertificateText: [''],
      BackendSSLTLS: [''],
      BackendSSLTLSText: [''],
      CertificateKey: [''],
      Certificate: [''],
      PoolMembers: this.fb.array([]),
      Persistence: [''],
      CookieName: [''],
      HealthCheck: [''],
      SendString: [''],
      ReceiveString: [''],
      ReceiveDisableString: [''],
      F5Cluster: [''],
      F5Partition: [''],
      ServiceName: [''],
      Aborted: false,
      Comments: [''],
      TechnicalComment: [''],
      NWSComment: ['']
    });
  }

  ngOnInit() {

    this.buildForm();

    if (this.Context.Validation['UT.F5CreateVServer.ValidateData']) {
      this.validationService.setValidatorsFromConfig(this.form, this.Context.Validation['UT.F5CreateVServer.ValidateData'], false);
    }

    if (this.Context.Payload) {
      if (this.Context.Payload["PoolMembers"]) {
        this.addDefaultValuesToPoolMembers(this.Context.Payload["PoolMembers"]);
      }

      this.form.patchValue(this.Context.Payload);
      this.F5Cluster$ = this.dataService.GetF5Cluster(this.form.get('Customer').value);
    }

    this.loaded = true;

    this.form.statusChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(status => {
      this.Context.Valid = status;
    })

    this.Context.OnApprove(() => this.approve());
    this.Context.OnReject(() => this.reject());
    this.Context.OnFeedback(() => this.feedback());

    if (this.Context.Payload['SSLTLSTermination'] === true &&
      this.Context.Payload['BackendSSLTLS'] === true) {
      this.form.get('BackendSSLTLSText').enable();
    }
    if (this.Context.Payload['SSLTLSTermination'] === true &&
      this.Context.Payload['SelectCertificate'] === 'useCert') {
      this.form.get('CertificateText').enable();
    }

  }

  getFormDataByName(formElementName: string): string {
    return this.Context.Payload[formElementName];
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  getConfigsForPoolMembers(varName: string): ValidatorConfig {
    return this.validationService.validatorConfigList.get('PoolMembers').fields.find(item => item.varName === varName);
  }

  get getValidationService(): ValidationService {
    return this.validationService;
  }

  get poolMembers() {
    return this.form.get('PoolMembers') as FormArray;
  }

  updateCIForm(cis: any) {
    this.form.setControl('PoolMembers', this.fb.array([]));
    //let res = this.validationService.validatorConfigList.get('PoolMembers');
    this.form.get('PoolMembers').setValidators([Validators.required]);

    cis.forEach(element => {
      this.poolMembers.push(this.createPoolMemberItem(element));
    });
    this.form.get('PoolMembers').updateValueAndValidity();
  }

  addDefaultValuesToPoolMembers(cis: any): any {
    cis.forEach(element => {
      element.Ratio = "0";
      element.ConnectionLimit = "0";
      element.PriorityGroup = "0";
    });
  }

  createPoolMemberItem(element: any): FormGroup {

    if (element) {
      return this.fb.group({
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
        ],
        Ratio: [element.Ratio,
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.min(this.getConfigsForPoolMembers('Ratio').min),
          Validators.max(this.getConfigsForPoolMembers('Ratio').max)
        ]
        ],
        ConnectionLimit: [element.ConnectionLimit,
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.min(this.getConfigsForPoolMembers('ConnectionLimit').min),
          Validators.max(this.getConfigsForPoolMembers('ConnectionLimit').max)
        ]
        ],
        PriorityGroup: [element.PriorityGroup,
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.min(this.getConfigsForPoolMembers('PriorityGroup').min),
          Validators.max(this.getConfigsForPoolMembers('PriorityGroup').max)
        ]
        ]

      });
    } else {
      return this.fb.group({
        PoolMember: ['', Validators.required],
        IPAddress: ['', Validators.required],
        ServicePort: ['',
          [
            Validators.required,
            Validators.pattern("^[0-9]*$"),
            Validators.min(this.getConfigsForPoolMembers('ServicePort').min),
            Validators.max(this.getConfigsForPoolMembers('ServicePort').max)
          ]
        ],
        Ratio: ['0',
          [
            Validators.required,
            Validators.pattern("^[0-9]*$"),
            Validators.min(this.getConfigsForPoolMembers('Ratio').min),
            Validators.max(this.getConfigsForPoolMembers('Ratio').max)
          ]
        ],
        ConnectionLimit: ['0',
          [
            Validators.required,
            Validators.pattern("^[0-9]*$"),
            Validators.min(this.getConfigsForPoolMembers('ConnectionLimit').min),
            Validators.max(this.getConfigsForPoolMembers('ConnectionLimit').max)
          ]
        ],
        PriorityGroup: ['0',
          [
            Validators.required,
            Validators.pattern("^[0-9]*$"),
            Validators.min(this.getConfigsForPoolMembers('PriorityGroup').min),
            Validators.max(this.getConfigsForPoolMembers('PriorityGroup').max)
          ]
        ]
      });
    }
  }

  approve(): ApproveTaskPayload {

    if (this.form.valid) {
      console.debug(this.form.value);
    } else {
      console.error('Form is not valid', this.form);
    }

    const model = this.form.value;

    return {
      value: model,
      runtimeData: model
    };
  }

  reject(): RejectTaskPayload {

    this.form.get('Aborted').setValue(true);
    console.log(this.form.value);
    return {
      resultName: 'Aborted',
      reasonName: 'ApprovalComment',
      resultValue: this.form.get('Aborted').value
    };
  }

  feedback(): FeedbackRequestPayload {

    return this.form.value;
  }

}
