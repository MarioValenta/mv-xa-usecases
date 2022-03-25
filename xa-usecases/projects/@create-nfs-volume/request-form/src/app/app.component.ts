import { PercentSnapshotSpaceDTO } from './dto/PercentSnapshotSpaceDTO';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FeedbackRequestPayload, ICERequest, ICERequestContext } from '@xa/lib-ui-common';
import { XANotifyService } from '@xa/ui';
import { ValidationService } from '@xa/validation';
import { NouisliderComponent } from 'ng2-nouislider';
import { Subject, Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { distinctUntilChanged, take, takeUntil, tap, map } from 'rxjs/operators';
import { DataService } from './data.service';
import { VmDTO } from './dto/VM-dto';

@Component({
  selector: 'create-nfs-volume-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements ICERequest, OnInit, OnDestroy {

  @ViewChild('volumeSizeSlider') public volumeSizeSlider: NouisliderComponent;

  title = 'RequestForm';

  @Input() Context: ICERequestContext;
  form: FormGroup;
  destroy$ = new Subject();

  // data
  RetentionTime$: Observable<Array<string>>;
  Protocol$: Observable<Array<string>>;
  LocalSnapshotPolicy$: Observable<Array<string>>;
  StorageClass$: Observable<Array<string>>;
  Environment$: Observable<Array<string>>;
  PercentSnapshotSpace$: Observable<Array<string>>;
  SVMs$: Observable<Array<string>>;
  StorageCluster$: Observable<Array<string>>;

  selectedVM$: BehaviorSubject<VmDTO> = new BehaviorSubject(null);
  PercentSnapshotSpaceBehaviorSubject: BehaviorSubject<PercentSnapshotSpaceDTO> = new BehaviorSubject({ snapVaultBackup: '', localSnapshotPolicy: '' });
  PercentSnapshotSpaceS$: Subscription;

  defaultVolumeSizeSliderOptions: any = {
    "start": 0,
    "step": 5,
    "connect": [
      true,
      false
    ],
    "pips": {
      "mode": "values",
      "density": 2,
      "values": [
        50,
        100,
        200,
        300,
        400,
        500,
        600,
        700,
        800,
        900,
        1000
      ]
    },
    "range": {
      "min": 50,
      "max": 1000
    }, "behaviour": "snap"
  };

  readonly FORM_KEY_CUSTOMER = 'Customer';
  readonly FORM_KEY_CUST_SHORT = 'CustomerShort';
  readonly FORM_KEY_MODE = 'Mode';
  readonly FORM_KEY_TOGGLE = 'ModeAdvancedToggle';
  readonly FORM_KEY_SELECTED_VM = 'SelectedVM';
  readonly FORM_KEY_VOLUMENAME = 'VolumeName';
  readonly FORM_KEY_SNAPVAULTBACKUP = 'SnapvaultBackup';
  readonly FORM_KEY_RETENTIONTIME = 'RetentionTime';
  readonly FORM_KEY_PROTOCOL = 'Protocol';
  readonly FORM_KEY_LOCALSNAPSHOTPOLICY = 'LocalSnapshotPolicy';
  readonly FORM_KEY_VOLUMESIZE = 'VolumeSize';
  readonly FORM_KEY_EXPORTPOLICY = 'ExportPolicy';
  readonly FORM_KEY_STORAGEENVIRONMENT = 'StorageEnvironment';
  readonly FORM_KEY_STORAGECLUSTER = 'StorageCluster';
  readonly FORM_KEY_SVM = 'SVM';
  readonly FORM_KEY_PERCENTSNAPSHOTSPACE = 'PercentSnapshotSpace';
  readonly FORM_KEY_STORAGECLASS = 'StorageClass';
  readonly FORM_KEY_MAILS = 'MailAddressesShareInformation';

  readonly FORM_LABEL_MODE = 'Mode';
  readonly FORM_LABEL_TOGGLE = 'activate advanced search Mode';
  readonly FORM_LABEL_SELECTED_VM = 'selected VM';
  readonly FORM_LABEL_VOLUMENAME = 'Volume Name (customer prefix will be automatically prefixed)';
  readonly FORM_LABEL_SNAPVAULTBACKUP = 'Snapvault Backup';
  readonly FORM_LABEL_RETENTIONTIME = 'Secondary Retention Time (in days)';
  readonly FORM_LABEL_PROTOCOL = 'Protocol';
  readonly FORM_LABEL_LOCALSNAPSHOTPOLICY = 'Local Snapshot Policy';
  readonly FORM_LABEL_PERCENTSNAPSHOTSPACE = 'Percent Snapshot Space';
  readonly FORM_LABEL_VOLUMESIZE = 'Volume Size';
  readonly FORM_LABEL_EXPORTPOLICY = 'Export Policy (IP, List of IPs separeted by comma, subnet, or all separated by comma)';
  readonly FORM_LABEL_STORAGEENVIRONMENT = 'Storage Environment';
  readonly FORM_LABEL_STORAGECLUSTER = 'Storage Cluster';
  readonly FORM_LABEL_SVM = 'SVM';
  readonly FORM_LABEL_STORAGECLASS = 'Storage Class';
  readonly FORM_LABEL_MAILS = 'E-Mail Addresses for Information Sharing';


  constructor(private fb: FormBuilder, private dataService: DataService,
    public validationService: ValidationService, private xaNotifyService: XANotifyService) {
  }

  buildForm() {
    this.form = this.fb.group({
      [this.FORM_KEY_CUSTOMER]: [''],
      [this.FORM_KEY_MODE]: ['basic'],
      [this.FORM_KEY_CUST_SHORT]: [''],
      [this.FORM_KEY_TOGGLE]: [],
      [this.FORM_KEY_SELECTED_VM]: [''],
      [this.FORM_KEY_VOLUMENAME]: [''],
      [this.FORM_KEY_SNAPVAULTBACKUP]: [{ value: '', disabled: true }],
      [this.FORM_KEY_RETENTIONTIME]: [{ value: '', disabled: true }],
      [this.FORM_KEY_PROTOCOL]: [{ value: '', disabled: true }],
      [this.FORM_KEY_EXPORTPOLICY]: [{ value: '', disabled: true }],
      [this.FORM_KEY_STORAGEENVIRONMENT]: [{ value: '', disabled: true }],
      [this.FORM_KEY_STORAGECLUSTER]: [{ value: '', disabled: true }],
      [this.FORM_KEY_SVM]: [{ value: '', disabled: true }],
      [this.FORM_KEY_PERCENTSNAPSHOTSPACE]: [{ value: '', disabled: true }],
      [this.FORM_KEY_LOCALSNAPSHOTPOLICY]: [{ value: '', disabled: true }],
      [this.FORM_KEY_VOLUMESIZE]: ['0'],
      [this.FORM_KEY_STORAGECLASS]: [{ value: '', disabled: true }],
      [this.FORM_KEY_MAILS]: ['']
    });
  }

  ngOnInit() {
    this.buildForm();

    if (this.Context.Validation.requestForm) {
      this.validationService.setValidatorsFromConfig(this.form, this.Context.Validation.requestForm, false);
    }

    this.checkChanges();

    this.form.statusChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(status => this.Context.Valid = status);

    this.Context.OnSubmit(() => this.submitForm());
    this.Context.OnFeedback(() => this.feedback());

    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload);
      // set the BehaviorSubject from the Payload
      if (this.Context.Payload[this.FORM_KEY_SELECTED_VM]) {
        this.selectedVM$.next(this.Context.Payload[this.FORM_KEY_SELECTED_VM]);
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  checkChanges() {

    this.form.get(this.FORM_KEY_TOGGLE).valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(checked => {
        checked === true ? this.form.get(this.FORM_KEY_MODE).patchValue('advanced') : this.form.get(this.FORM_KEY_MODE).patchValue('basic');
      });

    this.form.get(this.FORM_KEY_MODE).valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedMode => {

        // reset all data dropdowns
        this.resetObservablesSnapvaultBackup();
        this.resetObservablesForVolumeData();

        if (selectedMode === 'advanced') {

          this.PercentSnapshotSpaceS$ = this.PercentSnapshotSpaceBehaviorSubject.asObservable()
            .pipe(takeUntil(this.destroy$)).subscribe(
              percentSnapshotSpace => {
                if (percentSnapshotSpace.snapVaultBackup && percentSnapshotSpace.localSnapshotPolicy) {
                  this.enableFormElement(this.FORM_KEY_PERCENTSNAPSHOTSPACE);
                  this.PercentSnapshotSpace$ = this.dataService.getPercentSnapshotSpace(percentSnapshotSpace.snapVaultBackup, percentSnapshotSpace.localSnapshotPolicy).pipe(
                    map(result => {
                      this.form.get(this.FORM_KEY_PERCENTSNAPSHOTSPACE).setValue(result.defaultValue);
                      return result.values;
                    })
                  );
                } else {
                  this.disableFormElement(this.FORM_KEY_PERCENTSNAPSHOTSPACE);
                  this.PercentSnapshotSpace$ = of([]);
                }
              }
            );

          // set new data source for advanced dropdowns
          this.Environment$ = this.dataService.getStorageEnvironment();

          // disable basic form fields
          this.disableFormElement(this.FORM_KEY_SELECTED_VM);
          this.selectedVM$.next(null);

          // enable advanced form fields
          this.enableFormElement(this.FORM_KEY_EXPORTPOLICY);
          this.enableFormElement(this.FORM_KEY_PERCENTSNAPSHOTSPACE);
          this.enableFormElement(this.FORM_KEY_STORAGEENVIRONMENT);
        }

        if (selectedMode === 'basic') {

          this.PercentSnapshotSpaceS$.unsubscribe();

          // enable basic form fields
          this.enableFormElement(this.FORM_KEY_SELECTED_VM);

          // disable advanced form fields
          this.disableFormElement(this.FORM_KEY_EXPORTPOLICY);
          this.disableFormElement(this.FORM_KEY_PERCENTSNAPSHOTSPACE);
          this.disableFormElement(this.FORM_KEY_STORAGEENVIRONMENT);
          this.disableFormElement(this.FORM_KEY_STORAGECLASS);
        }
      });

    this.selectedVM$.asObservable()
      .pipe(takeUntil(this.destroy$)).subscribe(selectedVM => {
        if (selectedVM) {
          //console.debug(selectedVM);

          this.form.get(this.FORM_KEY_SELECTED_VM).patchValue(this.selectedVM$.getValue());
          this.enableFormElement(this.FORM_KEY_SNAPVAULTBACKUP);
          this.setSnapvaultBackup(this.form.get(this.FORM_KEY_SNAPVAULTBACKUP).value);
          this.setObservablesForVolumeData();
        } else {
          this.disableFormElement(this.FORM_KEY_SNAPVAULTBACKUP);
          this.resetObservablesForVolumeData();
          this.resetObservablesSnapvaultBackup();
        }
      });


    this.form.get(this.FORM_KEY_STORAGEENVIRONMENT).valueChanges
      .pipe(takeUntil(this.destroy$),
        distinctUntilChanged()
      )
      .subscribe(storageEnvironment => {
        if (storageEnvironment) {
          this.enableFormElement(this.FORM_KEY_SNAPVAULTBACKUP);
          this.setSnapvaultBackup(this.form.get(this.FORM_KEY_SNAPVAULTBACKUP).value);

          this.enableFormElement(this.FORM_KEY_STORAGECLUSTER);
          this.StorageCluster$ = this.dataService.getStorageCluster(storageEnvironment);

          this.setObservablesForVolumeData();
        } else {
          this.disableFormElement(this.FORM_KEY_SNAPVAULTBACKUP);
          this.disableFormElement(this.FORM_KEY_STORAGECLUSTER);

          this.resetObservablesForVolumeData();
          this.resetObservablesSnapvaultBackup();
        }
      });

    this.form.get(this.FORM_KEY_STORAGECLUSTER).valueChanges
      .pipe(takeUntil(this.destroy$),
        distinctUntilChanged()
      )
      .subscribe(storageCluster => {
        if (storageCluster) {
          this.SVMs$ = this.dataService.getSVMs(storageCluster);
          this.enableFormElement(this.FORM_KEY_SVM);
        } else {
          this.disableFormElement(this.FORM_KEY_SVM);
        }
      });

    this.form.get(this.FORM_KEY_SVM).valueChanges
      .pipe(takeUntil(this.destroy$),
        distinctUntilChanged()
      )
      .subscribe(selectedSVM => {
        //console.debug('set selected SVM');

        this.setCustomerPrefix(this.form.get(this.FORM_KEY_MODE).value, selectedSVM);
      });

    this.form.get(this.FORM_KEY_SNAPVAULTBACKUP).valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(snapvaultBackup => {
        this.PercentSnapshotSpaceBehaviorSubject.next({ snapVaultBackup: snapvaultBackup, localSnapshotPolicy: this.PercentSnapshotSpaceBehaviorSubject.getValue().localSnapshotPolicy })
        this.setSnapvaultBackup(snapvaultBackup);
      });

    this.form.get(this.FORM_KEY_LOCALSNAPSHOTPOLICY).valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(localSnapshotPolicy => {
        this.PercentSnapshotSpaceBehaviorSubject.next({ snapVaultBackup: this.PercentSnapshotSpaceBehaviorSubject.getValue().snapVaultBackup, localSnapshotPolicy: localSnapshotPolicy })
      });

  }

  enableFormElement(formControlElementName: string) {
    this.form.get(formControlElementName).enable();
  }

  disableFormElement(formControlElementName: string) {
    this.form.get(formControlElementName).patchValue(null);
    this.form.get(formControlElementName).disable();
  }

  setCustomerPrefix(mode: string, host: string): void {
    //console.debug('set prefix');

    if (mode && host) {
      this.dataService.getCustomerShortname(mode, host)
        .pipe(
          take(1),
          takeUntil(this.destroy$)
        )
        .subscribe((result: { customerprefix: string, customer: string }) => {

          if (result.customerprefix === 'NONE') {
            window.alert('No customer prefix found, please update CMDB entry!');
          }
          this.form.get(this.FORM_KEY_CUST_SHORT).setValue(result.customerprefix);
          this.form.get(this.FORM_KEY_CUSTOMER).setValue(result.customer);
        }
          , (error => { }), () => {
          });
    } else {
      this.form.get(this.FORM_KEY_CUST_SHORT).setValue('');
    }
  }
  setSnapvaultBackup(snapvaultBackupValue) {
    if ((this.selectedVM$.value || this.form.get(this.FORM_KEY_STORAGEENVIRONMENT).value) && snapvaultBackupValue === 'yes') {
      this.setObservablesSnapvaultBackup();
    } else {
      this.resetObservablesSnapvaultBackup();
    }
  }

  getParameterData() {
    return {
      mode: this.form.get(this.FORM_KEY_MODE).value,
      hostId: this.form.get(this.FORM_KEY_SELECTED_VM).value ? this.form.get(this.FORM_KEY_SELECTED_VM).value['HostID'] : undefined,
      storageEnvironment: this.form.get(this.FORM_KEY_STORAGEENVIRONMENT).value ? this.form.get(this.FORM_KEY_STORAGEENVIRONMENT).value : undefined
    };
  }

  setObservablesForVolumeData(): void {

    this.enableFormElement(this.FORM_KEY_STORAGECLASS);
    this.enableFormElement(this.FORM_KEY_PROTOCOL);
    this.enableFormElement(this.FORM_KEY_LOCALSNAPSHOTPOLICY);

    let parameters = this.getParameterData();
    let mode = this.form.get(this.FORM_KEY_MODE).value;
    if (mode === 'basic') {
      this.Protocol$ = this.dataService.getProtocol(parameters.mode, parameters.hostId, undefined);
      this.LocalSnapshotPolicy$ = this.dataService.getSnapshotPolicy(parameters.mode, parameters.hostId, undefined);
      this.disableFormElement(this.FORM_KEY_STORAGECLASS);
      this.StorageClass$ = of([]);
    }
    if (mode === 'advanced') {
      this.Protocol$ = this.dataService.getProtocol(parameters.mode, undefined, parameters.storageEnvironment);
      this.LocalSnapshotPolicy$ = this.dataService.getSnapshotPolicy(parameters.mode, undefined, parameters.storageEnvironment);
      this.StorageClass$ = this.dataService.getStorageClass(parameters.mode, undefined, parameters.storageEnvironment);
    }
  }

  setObservablesSnapvaultBackup(): void {

    this.enableFormElement(this.FORM_KEY_RETENTIONTIME);

    let parameters = this.getParameterData();
    let mode = this.form.get(this.FORM_KEY_MODE).value;
    if (mode === 'basic') {
      this.RetentionTime$ = this.dataService.getRetentionTime(parameters.mode, parameters.hostId, undefined);
    }
    if (mode === 'advanced') {
      this.RetentionTime$ = this.dataService.getRetentionTime(parameters.mode, undefined, parameters.storageEnvironment);
    }
  }

  resetObservablesForVolumeData(): void {

    this.disableFormElement(this.FORM_KEY_PROTOCOL);
    this.Protocol$ = of([]);
    this.form.get(this.FORM_KEY_PROTOCOL).patchValue('');

    this.disableFormElement(this.FORM_KEY_LOCALSNAPSHOTPOLICY);
    this.LocalSnapshotPolicy$ = of([]);
    this.form.get(this.FORM_KEY_LOCALSNAPSHOTPOLICY).patchValue('');

    this.disableFormElement(this.FORM_KEY_STORAGECLASS);
    this.StorageClass$ = of([]);
    this.form.get(this.FORM_KEY_STORAGECLASS).patchValue('');
  }

  resetObservablesSnapvaultBackup(): void {
    this.disableFormElement(this.FORM_KEY_RETENTIONTIME);
    this.RetentionTime$ = of([]);
    this.form.get(this.FORM_KEY_RETENTIONTIME).patchValue('');
  }

  setSelectedVM(selectedVM: VmDTO) {
    this.xaNotifyService.info('loading VM data ...', { timeout: 0, pauseOnHover: false });

    this.dataService.getHostDetails(selectedVM.HostID).subscribe(
      (hostDetails) => {
        this.form.get(this.FORM_KEY_CUSTOMER).setValue(selectedVM.Customer);
        this.selectedVM$.next(selectedVM);
        this.xaNotifyService.clear();
        this.xaNotifyService.success('successfully loaded VM data', { timeout: 1500, pauseOnHover: false });
      },
      (httpErrorResponse) => {
        this.selectedVM$.next(null);
        this.xaNotifyService.clear();
        this.xaNotifyService.error(httpErrorResponse['error']['Error'][0]['Message'], { timeout: 0, pauseOnHover: true });
      }
    );
    //console.debug('setSelectedVM');

    this.setCustomerPrefix(this.form.get(this.FORM_KEY_MODE).value, selectedVM.HostID);
  }

  isFormElementRequired(elementName: string) {
    return this.validationService.validatorConfigList.get(elementName)
      ? (this.validationService.validatorConfigList.get(elementName).required || this.validationService.validatorConfigList.get(elementName).requiredTrue)
      : false;
  }

  public submitForm() {

    if (this.form.valid) {

      // concat the CUSTOMERSHORT and VolumeName
      this.form.get(this.FORM_KEY_VOLUMENAME).patchValue(this.form.get(this.FORM_KEY_CUST_SHORT).value + this.form.get(this.FORM_KEY_VOLUMENAME).value);

      console.debug(this.form.getRawValue());
    } else {
      console.error('Form is not valid', this.form);
    }

    const model = this.form.value;

    return {
      value: model,
      identifier: `${model.VolumeName}`
    };
  }

  feedback(): FeedbackRequestPayload {
    return this.form.value;
  }

}
