import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICERequest, XAServices } from '@xa/lib-ui-common';
import { SearchField } from '@xa/search';
import { XANotifyService } from '@xa/ui';
import { XANotify } from '@xa/ui/lib/components/xa-notify/interfaces/XANotify.interface';
import { ValidationService } from '@xa/validation';
import Lightpick from 'lightpick';
import { RequestContextBaseComponent } from 'projects/usecase-base-class/request-context-base.component';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { DataService } from './data-service.service';


@Component({
  selector: 'oracle-db-rdn-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends RequestContextBaseComponent implements ICERequest {

  title: string = 'oracle-db-rdn-request-form';
  serviceID!: string;
  info = { ServiceID: '', Servicename: '', Environment: '', Customer: '', Status: '', WBS: '' };
  StartDateMin = new Date();
  destroy$ = new Subject<any>();
  domlayout = 'autoHeight';

  EntriesHost!: [];
  hostfields = {
    1: { header: 'Host ID', fields: 'HOSTID' },
    2: { header: 'Hostname', fields: 'HOSTNAME' },
    3: { header: 'Hostmodel', fields: 'HMODEL' },
    4: { header: 'Hostmodelnr', fields: 'HMODELNR' },
    5: { header: 'Predlabel', fields: 'PREDLABEL' },
    6: { header: 'Status', fields: 'HSTATUS' },
    7: { header: 'Support', fields: 'HSUP' }
  };

  EntriesService!: [];
  servicefields = {

    1: { header: 'Service ID', fields: 'ID' },
    2: { header: 'Servicename', fields: 'Name' },
    3: { header: 'Predicate', fields: 'predicate' },
    4: { header: 'Class', fields: 'Class' },
    5: { header: 'Type', fields: 'Type' },
    6: { header: 'Status', fields: 'Status' },
    7: { header: 'Support', fields: 'Support' },
    8: { header: 'Environment', fields: 'Environment' }
  };

  SearchFields: Array<SearchField> = [
    {
      Name: 'SVCID',
      Label: 'ID',
      Placeholder: 'enter Service ID'
    },
    {
      Name: 'SVCNAME',
      Label: 'Name',
      Placeholder: 'enter Service Name',
      FormatValue: (value) => {

        if (value.startsWith('!'))
          return value.substring(1);

        if (value.includes('*') || value.includes('%')) {
          return value;
        }
        return `*${value}*`;
      }
    },
    {
      Name: 'SVCENVIRONMENT',
      Label: 'Environment',
      Type: 'select',
      Options: this.dataService.getEnvironments(),
      Placeholder: 'select Service Environment'
    },
    {
      Name: 'SVCCUSTOMER',
      Label: 'Customer',
      Type: 'select',
      Options: this.dataService.getCustomers(),
      SelectConfig: {
        ViewValue: 'label',
        OptionsValue: 'CUSTOMERNICKNAME'
      },
      Width: '30em',
      Placeholder: 'select Service Customer'
    },
    {
      Name: 'SVCSTATUS',
      Label: 'Status',
      Type: 'select',
      Options: () => (this.Context && this.Context.ConfigPayload.AllowedStatus) || this.allowedStatus,
      Placeholder: 'select Service Status',
      HideInput: false
    },
    {
      Name: 'SVCKTR',
      Label: 'WBS',
      HideInput: true,
      Placeholder: 'enter Service WBS'
    }
  ];

  allowedStatus = [
    'ACTIVE',
    'DESIGNED',
    'DRAFT',
    'EXPERIMENTAL',
    'GARBAGE',
    'INACTIVE',
    'INFOALERTING',
    'INFOONLY',
    'INFOONLY_TMA-TECHNIK',
    'MAINTENANCE',
    'PLANNED',
    'READY_FOR_SERVICE',
    'RUNDOWN',
    'SLEEPING',
    'STARTUP'
  ];

  constructor(private fb: FormBuilder,
    private dataService: DataService,
    @Inject(XASERVICE_TOKEN) private xaservices: XAServices,
    private cref: ChangeDetectorRef,
    private validationService: ValidationService,
    private notifyService: XANotifyService) {
    super('oracle-db-rdn-request-form');
  }

  public getFormControl(name: string): AbstractControl | null {
    const control = this.form.get(name);
    return control;
  }

  buildForm(): void {
    console.debug(this.title, 'buildForm()');

    this.form = this.fb.group({
      ServiceID: ['', Validators.required],
      ServiceName: ['', Validators.required],
      RUNDOWN_DATE: ['', Validators.required],
      Customer: [''],
      IsRollback: [false],
      ObjectType: ['SERVICE'],
      Backup: ['', Validators.required],
      Reason: ['', Validators.required],
      VolumestoKeepLonger: '',
      DaystoKeep: ['10', [Validators.required, Validators.min(10), Validators.max(100)]]

    });

    this.formControlValueChanges(this.form);
    this.form.get('Reason')!.disable();
    this.form.get('DaystoKeep')!.disable();
  }

  setValidationService() {
    if (this.Context.Validation.requestForm) {
      console.debug(this.title, 'setValidationService()');

      this.validationService.setValidatorsFromConfig(this.form, this.Context.Validation.requestForm);
    }
  }

  customOnInit() {
    console.debug(this.title, 'customOnInit()');

    //  format: 'YYYY-MM-DDTHH:mm:ss.sssZ',
    const picker = new Lightpick({
      field: document.getElementById('datepicker'),
      format: 'DD.MM.YYYY',
      singleDate: true,
      onSelect: (date: any) => {
        this.form.get('RUNDOWN_DATE')!.patchValue(`${date.format('DD.MM.YYYY')}`);
        this.cref.markForCheck();
      }
    });
  }

  onSearchChanged(serviceParameter: any) {

    this.EntriesHost = [];
    this.EntriesService = [];
    this.notifyService.clear();

    if (!serviceParameter) {
      return;
    } else {
      this.form.reset();
      this.form.get('ServiceID')!.setValue(serviceParameter.ID);
      this.form.get('ServiceName')!.setValue(serviceParameter.Name);
      this.form.get('Customer')!.setValue(serviceParameter.Customer);
      this.serviceID = serviceParameter.ID;
      this.info = serviceParameter;

      if (serviceParameter.ID) {

        const successAction = new Observable<XANotify>((observer) => {

          this.dataService.getServiceRelations(serviceParameter.ID).pipe(
            map(data => {
              this.EntriesHost = data.Host || [];
              this.EntriesService = data.Service || [];
            }),
            takeUntil(this.destroy$)).subscribe(() => {
              this.form.get('IsRollback')!.setValue(false);
              this.form.get('ObjectType')!.setValue('SERVICE');
              this.form.get('Backup')!.reset();
              this.form.get('Reason')!.disable();
              this.form.get('DaystoKeep')!.setValue('10');
              this.form.get('DaystoKeep')!.disable();

              observer.next({
                title: 'Success',
                body: this.EntriesHost.length + ' Host and ' + this.EntriesService.length + ' Service Relations data loaded!',
                config: {
                  closeOnClick: true,
                  timeout: 5000,
                  showProgressBar: true
                }
              });

              observer.complete();
            });
        });

        this.notifyService.async('Loading Relations ...', successAction);
      }
    }
  }

  keyPress(event: any) {
    const pattern = /[0-9\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  formControlValueChanges(fg: FormGroup) {

    fg.get('Backup')!.valueChanges.subscribe(value => {

      if (value === 'AlreadyExistingBackup') {
        fg.get('Reason')!.reset();
        fg.get('Reason')!.disable();
      } else {
        fg.get('Reason')!.enable();
      }

    });

    fg.get('VolumestoKeepLonger')!.valueChanges.subscribe(value => {

      if (!value) {
        fg.get('DaystoKeep')!.disable();
      } else {
        fg.get('DaystoKeep')!.enable();
      }
    });

  }

  searchFunction = (data: any) => {

    const httpParams: any = Object.keys(data).reduce((curr: any, next) => {
      const val = data[next] as string;
      if (val && val.trim()) {
        curr[next] = val;
      }
      return curr;
    }, {});

    const showFields = this.SearchFields.filter(f => f && !f.HideResult).map(f => f.Name).join(',');
    httpParams['fields'] = showFields;
    return this.xaservices.Http!.Get<Array<any>>('api/feature/cmdbsearch/service', { params: httpParams });
  }

  onSubmit(): { value: any; identifier: string; } {
    console.debug(this.title, 'onSubmit()');

    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      console.error('Form is not valid', this.form);
    }

    const model = this.form.getRawValue();
    const res = this.form.controls['RUNDOWN_DATE'].value.split('.');

    // res[1] - 1 because month is set by index, 0 is January, 1 is February, etc.
    model.RUNDOWN_DATE = new Date(res[2], res[1] - 1, res[0], 12, 0, 0, 0);

    return {
      value: model,
      identifier: `${model.ServiceName}_${model.ServiceID}`
    };
  }

}

