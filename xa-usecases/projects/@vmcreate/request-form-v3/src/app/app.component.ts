import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  FeedbackRequestPayload,
  ICERequest,
  ICERequestContext,
} from '@xa/lib-ui-common';
import { XANotifyService } from '@xa/ui';
import { ValidationService } from '@xa/validation';
import { ValidatorConfig } from '@xa/validation/lib/Validation/ValidatorConfig';
import { NouisliderComponent } from 'ng2-nouislider';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  Observable,
  ObservableInput,
  of,
  Subject,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  switchMap,
  takeUntil,
  tap,
  toArray,
} from 'rxjs/operators';

import { environment } from '../environments/environment';
import { ClusterCapacity } from './cluster-capacity.model';
import { DataService } from './data.service';
import cpuRangeOptions from './default-slider-options.json';
import memoryRangeOptions from './default-slider-options.json';
import { SliderOptionPipe } from './pure-pipes/slider-config.pipe';
import { VMDKStorage } from './vmdk-storage.model';

@Component({
  selector: 'vmcreate-request-form-v3',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy, ICERequest {
  title = 'RequestForm';

  @Input()
  Context!: ICERequestContext;

  @ViewChild('customerDropDown') customerDropDown: any;
  @ViewChild('CPUs')
  public cpuSlider!: NouisliderComponent;
  @ViewChild('RAM')
  public ramSlider!: NouisliderComponent;

  /*
   * List of the formControlName values
   */
  // BASIC SETTINGS
  readonly FORM_KEY_CUSTOMER = 'Customer';
  readonly FORM_KEY_WBS_INSTALL = 'WbsInstall';
  readonly FORM_KEY_WBS_OPERATIONS = 'WbsOperations';
  readonly FORM_KEY_ENVIRONMENT = 'Environment';
  readonly FORM_KEY_CRITICALITY = 'Criticality';
  readonly FORM_KEY_USE_SLA = 'UseSLA';
  readonly FORM_KEY_SLA = 'SLA';
  // PLATFORM SPECIFICATION
  readonly FORM_KEY_SPECIFIC_INFRASTRUCTURE_SELECTION =
    'SpecificInfrastructureSelection';
  readonly FORM_KEY_DATACENTER = 'Datacenter';
  readonly FORM_KEY_INFRASTRUCTURE = 'Infrastructure';
  readonly FORM_KEY_ESX_CLUSTER = 'ESXCluster';
  readonly FORM_KEY_DATASTORE_TYPE = 'DatastoreType';
  readonly FORM_KEY_AGREE = 'AgreeToDiscussion';
  // OPERATING SYSTEM
  readonly FORM_KEY_OS = 'OS';
  readonly FORM_KEY_OS_VERSION = 'OSVersion';
  readonly FORM_KEY_OS_RELEASE = 'Release';
  readonly FORM_KEY_LICENSE_TYPE = 'LicenseType';
  readonly FORM_KEY_KMS_IP = 'KmsIP';
  readonly FORM_KEY_LICENSE_KEY = 'LicenseKey';
  readonly FORM_KEY_HOSTNAME = 'Hostname';
  readonly FORM_KEY_DOMAIN = 'Domain';
  readonly FORM_KEY_PATCH_MODE = 'Patchmode';
  readonly FORM_KEY_PATCH_TIME = 'PatchTime';
  readonly FORM_KEY_FQDN = 'FQDN';
  // SUPPORT TEAMS
  readonly FORM_KEY_OS_SUPPORTED_BY = 'OSSupportedBy';
  readonly FORM_KEY_APP_SUPPORTED_BY = 'AppSupportedBy';
  readonly FORM_KEY_SERVICE_TIME_OS_SUPPORT = 'ServiceTimeOS';
  readonly FORM_KEY_SERVICE_TIME_APP_SUPPORT = 'ServiceTimeAppSupport';
  // VM SETTINGS
  readonly FORM_KEY_EXPERT_MODE = 'ExpertMode';
  readonly FORM_KEY_CPUS = 'CPUs';
  readonly FORM_KEY_RAM = 'RAM';
  readonly FORM_KEY_CPUS_MANUAL_INPUT = 'CPUsm';
  readonly FORM_KEY_RAM_MANUAL_INPUT = 'RAMm';
  readonly FORM_KEY_EXPERT_LIMITS_UNIT = 'ExpertLimitsUnit';
  readonly FORM_KEY_EXPERT_LOWER_LIMIT = 'ExpertLowerLimit';
  readonly FORM_KEY_EXPERT_LOWER_LIMIT_CHECKBOX = 'LowerLimitCheckBox';
  readonly FORM_KEY_MIN_MHZ = 'MinMHz';
  readonly FORM_KEY_EXPERT_UPPER_LIMIT = 'ExpertUpperLimit';
  readonly FORM_KEY_EXPERT_UPPER_LIMIT_CHECKBOX = 'UpperLimitCheckBox';
  readonly FORM_KEY_MAX_MHZ = 'MaxMHz';
  readonly FORM_KEY_VMDK = 'VMDK';
  // NETWORK OPTIONS
  readonly FORM_KEY_CUSTOMER_LAN = 'CustomerLAN';
  readonly FORM_KEY_CUSTOMER_LAN_IPV4 = 'CustomerLAN_IPv4';
  readonly FORM_KEY_CUSTOMER_LAN_IPV6 = 'CustomerLAN_IPv6';

  readonly FORM_KEY_ADMIN_LAN = 'AdminLAN';
  readonly FORM_KEY_ADMIN_LAN_IPV4 = 'AdminLAN_IPv4';
  readonly FORM_KEY_ADMIN_LAN_IPV6 = 'AdminLAN_IPv6';

  readonly FORM_KEY_NAS_LAN_CHECK = 'NASLANCHECK';
  readonly FORM_KEY_NAS_LAN = 'NASLAN';
  readonly FORM_KEY_NAS_LAN_IPV4 = 'NASLAN_IPv4';
  readonly FORM_KEY_NAS_LAN_IPV6 = 'NASLAN_IPv6';

  readonly FORM_KEY_CUSTOMER_SPECIFIC_IPv4 = 'CustomerSpecificIPv4';
  readonly FORM_KEY_CUSTOMER_SPECIFIC_IPv6 = 'CustomerSpecificIPv6';

  // Information sharing - Email section
  readonly FORM_KEY_EMAIL_ADDRESSES_SHARING_INFORMATION =
    'MailAddressesShareInformation';

  form!: FormGroup;
  destroy$ = new Subject();
  sliderOptionPipe: SliderOptionPipe = new SliderOptionPipe();
  naslanlabel?: string = '';
  naslanId?: string;
  showAdminLan: any;
  kms?: string = '';
  kmsIP?: string = '';
  initialCPUSliderOptions: any = null;
  currentCPUSliderOptions: any = null;
  initialMemorySliderOptions: any = null;
  currentMemorySliderOptions: any = null;

  /* Basic settings */
  Customers$: Observable<Array<string>>;
  SelectedCustomer$!: BehaviorSubject<string>;

  // Dropdown config for custom WBS input
  dropDownConfig: any = {
    selectOnKeydown: true,
    allowAdditions: true,
    hideAdditions: false,
    templates: {
      addition: (search: string) => {
        return 'use custom WBS ' + search.substring(4);
      },
    },
  };

  domainDropDownConfig: any = {
    selectOnKeydown: true,
    allowAdditions: true,
    hideAdditions: false,
    templates: {
      addition: (search: string) => {
        return 'use custom Domain ' + search.substring(4);
      },
    },
  };

  WbsInstalls$!: Observable<Array<string>>;
  WbsOperations$!: Observable<Array<string>>;
  OSSupportedBy$!: Observable<Array<string>>;
  AppSupportedBy$: Observable<Array<string>>;
  ServiceTimeOS$!: Observable<Array<string>>;
  ServiceTimeAppSupport$!: Observable<Array<string>>;
  Environment$: Observable<Array<string>>;
  Criticality$: Observable<Array<string>>;
  SLA$!: Observable<Array<string>>;

  /* Platform specification */
  /* Platform specification */
  IsSpecificInfrastructureChecked$!: Observable<boolean>;
  ClusterCapacity$!: Observable<ClusterCapacity>;

  ReceivedSimpleDatacenters$!: Observable<{ vCenter: string; cluster: string }>;
  Infrastructures$!: Observable<
    Array<
      | { vCenter: string; platformType: string; vCenterLabel: string }
      | { vCenter: string; cluster: string; vCenterLabel: string }
    >
  >;
  ESXClusters$!: Observable<Array<string>>;
  isESXClusterSelected!: boolean;
  DatastoreTypes$!: Observable<Array<string>>;
  SelectedPlatform!: Observable<string>;
  missingClusterVCenterData = false;

  /* Operating system specification */
  OSs$: Observable<Array<string>>;
  OSVersions$!: Observable<Array<string>>;
  Releases$!: Observable<Array<string>>;
  osTypes = ['Windows', 'Linux'];
  OSIcon$: Observable<string>;
  Hostname$: BehaviorSubject<string> = new BehaviorSubject('');
  TypedHostname$!: Observable<string>;
  IsHostnameAvailable$!: Observable<boolean>;
  Domains$!: Observable<Array<string>>;
  showCustomerDomains!: boolean;
  Patchmodes$: Observable<Array<string>>;
  PatchTimes$: Observable<Array<string>>;
  CustomerSubdomains$!: Observable<Array<string>>;
  customerUANSubdomainAsString!: string;
  FQDNs$: Observable<Array<string>>;
  hostnameLength$ = new BehaviorSubject<number>(0);
  KMS$: BehaviorSubject<string> = new BehaviorSubject('');

  /* VM settings
   */
  // expertMode$: Observable<boolean>;
  /* VM settings
   */
  // expertMode$: Observable<boolean>;
  expertLimitsUnits$!: Observable<Array<string>>;
  limitsUnit = ['SAPS', 'Slices', 'tpmC'];
  MinCPUExpertMode$ = new BehaviorSubject(1);
  MaxCPUExpertMode$ = new BehaviorSubject(1);
  MaxMemory$ = new BehaviorSubject(1);
  MinMHz$: BehaviorSubject<{
    cluster: string;
    unit: string;
    limit: number;
    updateMinCPU: boolean;
  }> = new BehaviorSubject(null);
  MaxMHz$: BehaviorSubject<{
    cluster: string;
    unit: string;
    limit: number;
    updateMinCPU: boolean;
  }> = new BehaviorSubject(null);
  CalculateMHz$: BehaviorSubject<{
    cluster: string;
    unit: string;
    lowerLimit: number;
    upperLimit: number;
  }> = new BehaviorSubject({
    cluster: null,
    unit: null,
    lowerLimit: null,
    upperLimit: null,
  });
  minExpertUpperLimit = new BehaviorSubject(null);
  maxExpertLowerLimit = new BehaviorSubject(null);
  missingCPUCapacityData = false;

  // prop to set the first cell of the VMDK storage header depending on the selected OS
  // prop to set the first cell of the VMDK storage header depending on the selected OS
  patchOrName!: string;

  // VM settings Expert mode
  // UANSubdomain$: Observable<string>;
  // Default subdomain for FQDN calculation
  readonly defaultSubDomain = new RegExp(/\.uan\.cleannet\.int$/g);
  readonly defaultSubDomainString = 'uan.cleannet.int';

  /* Network Options */
  CustomerLANs$: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([
    '',
  ]);
  isCustomerLanIPVersionsSelectable$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  showCustomerLANInformation!: boolean;

  AdminLANs$: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([
    '',
  ]);
  isAdminLanIPVersionsSelectable$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  NASLANs$: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>(['']);
  isNasLanIPVersionsSelectable$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private validationService: ValidationService,
    private fb: FormBuilder,
    private dataService: DataService,
    private xaNotifyService: XANotifyService,
    private cref: ChangeDetectorRef
  ) {
    this.Customers$ = this.dataService.getCustomers();
    this.AppSupportedBy$ = this.dataService.getAppSupportedBy();
    this.Environment$ = dataService.getEnvironments();
    this.Criticality$ = dataService.getCriticality();
    this.OSs$ = of(this.osTypes);
    this.OSIcon$ = of('question circle outline');
    this.Patchmodes$ = dataService.getPatchModes();
    this.PatchTimes$ = dataService.getPatchTimes();
    this.FQDNs$ = of(['Fetching data ...']);
  }

  buildForm() {
    this.form = this.fb.group({
      Customer: [''],
      WbsInstall: [{ value: '', disabled: true }],
      WbsOperations: [{ value: '', disabled: true }],
      OSSupportedBy: [{ value: '', disabled: true }],
      AppSupportedBy: [''],
      ServiceTimeOS: [{ value: '', disabled: true }],
      ServiceTimeAppSupport: [{ value: '', disabled: true }],
      Environment: [''],
      Criticality: [''],
      UseSLA: [''],
      SLA: [{ value: '', disabled: true }],
      SpecificInfrastructureSelection: [''],
      AgreeToDiscussion: [''],
      Datacenter: [{ value: 'odc' }],
      Infrastructure: [{ value: '', disabled: true }],
      ESXCluster: [{ value: '', disabled: true }],
      DatastoreType: [{ value: '', disabled: true }],
      OS: [''],
      LicenseType: [{ value: '', disabled: true }],
      LicenseKey: [{ value: '', disabled: true }],
      KmsIP: [{ value: '', disabled: true }],
      OSVersion: [{ value: '', disabled: true }],
      Release: [{ value: '', disabled: true }],
      Hostname: [''],
      Domain: [''],
      Patchmode: [''],
      PatchTime: [''],
      FQDN: [{ value: '', disabled: true }],
      ExpertMode: [''],
      CPUs: [''],
      RAM: [''],
      CPUsm: [''],
      RAMm: [''],
      ExpertLimitsUnit: [''],
      LowerLimitCheckBox: [''],
      UpperLimitCheckBox: [''],
      ExpertLowerLimit: [{ value: '', disabled: true }],
      ExpertUpperLimit: [{ value: '', disabled: true }],
      CustomerLAN: [{ value: '', disabled: true }],
      AdminLAN: [{ value: '', disabled: true }],
      NASLAN: [''],
      NASLANCHECK: [{ value: '', disabled: true }],
      CustomerLanIpam: [''],
      CustomerSpecificIPv4: [''],
      CustomerSpecificIPv6: [''],
      VMDK: this.fb.array([]),
      CustomerLAN_IPv4: [''],
      CustomerLAN_IPv6: [false],
      AdminLAN_IPv4: [''],
      AdminLAN_IPv6: [false],
      NASLAN_IPv4: [''],
      NASLAN_IPv6: [false],
      MinMHz: [''],
      MaxMHz: [''],
      LBU: ['AT'],
      MailAddressesShareInformation: [''],
    });
  }

  // Getter for the vmdks
  get vmdks(): FormArray {
    return this.form.get(this.FORM_KEY_VMDK) as FormArray;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit(): void {
    // Storing the initial slider options
    if (
      this.Context.ConfigPayload &&
      this.Context.ConfigPayload.SliderOptions
    ) {
      if (this.Context.ConfigPayload.SliderOptions.cpuRangeOptions) {
        this.currentCPUSliderOptions =
          this.Context.ConfigPayload.SliderOptions.cpuRangeOptions;
      } else {
        this.currentCPUSliderOptions = cpuRangeOptions;
      }
      if (this.Context.ConfigPayload.SliderOptions.memoryRangeOptions) {
        this.currentMemorySliderOptions =
          this.Context.ConfigPayload.SliderOptions.memoryRangeOptions;
      } else {
        this.currentMemorySliderOptions = memoryRangeOptions;
      }

      this.initialCPUSliderOptions = this.cloneJSON(
        this.currentCPUSliderOptions
      );
      this.initialMemorySliderOptions = this.cloneJSON(
        this.currentMemorySliderOptions
      );

      this.MinCPUExpertMode$.next(this.currentCPUSliderOptions.range.min);
      this.MaxCPUExpertMode$.next(this.currentCPUSliderOptions.range.max);
    }

    this.buildForm();

    if (this.Context.Validation.requestForm) {
      this.validationService.setValidatorsFromConfig(
        this.form,
        this.Context.Validation.requestForm,
        false
      );
    }

    this.checkChanges();

    this.form.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => (this.Context.Valid = status));

    this.Context.OnSubmit(() => this.submit());
    this.Context.OnFeedback(() => this.feedback());

    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload);
    }

    if (!this.Context.Payload['Datacenter']) {
      this.form.get(this.FORM_KEY_DATACENTER)?.patchValue('odc');
    }
  }

  get getValidationService() {
    return this.validationService;
  }

  // Checker function if Windows is the selected OS
  isWindowsOSSelected(): boolean {
    return this.form.get(this.FORM_KEY_OS)?.value === 'Windows';
  }

  enableFormElement(formControlName: string, defaultValue?: any) {
    this.form.get(formControlName)?.enable();
    this.form
      .get(formControlName)
      ?.patchValue(defaultValue ? defaultValue : '');
  }

  disableFormElement(formControlName: string) {
    this.form.get(formControlName)?.patchValue('');
    this.form.get(formControlName)?.disable();
  }

  updateDomainFormControl() {
    if (
      this.isWindowsOSSelected() &&
      this.form.get(this.FORM_KEY_CUSTOMER)?.value
    ) {
      this.enableFormElement(this.FORM_KEY_DOMAIN);
      this.Domains$ = this.dataService.getDomains(
        this.form.get(this.FORM_KEY_CUSTOMER)?.value
      );
    } else {
      this.disableFormElement(this.FORM_KEY_DOMAIN);
    }
  }

  isExpertMode() {
    return this.form.get(this.FORM_KEY_EXPERT_MODE)?.value;
  }

  logger(level: string, message: string): void {
    if (!environment.production) {
      console.debug('[' + level + ']: ' + message);
    }
  }

  UpdateView() {
    if (this.form.get(this.FORM_KEY_CPUS)?.value) {
      this.form
        .get(this.FORM_KEY_CPUS_MANUAL_INPUT)
        ?.patchValue(this.form.get(this.FORM_KEY_CPUS)?.value);
    }
    if (this.form.get(this.FORM_KEY_RAM)?.value) {
      this.form
        .get(this.FORM_KEY_RAM_MANUAL_INPUT)
        ?.patchValue(this.form.get(this.FORM_KEY_RAM)?.value);
    }
  }

  UpdateRAM() {
    this.form
      .get(this.FORM_KEY_RAM)
      ?.patchValue(this.form.get(this.FORM_KEY_RAM_MANUAL_INPUT)?.value);
  }
  UpdateCPUs() {
    this.form
      .get(this.FORM_KEY_CPUS)
      ?.patchValue(this.form.get(this.FORM_KEY_CPUS_MANUAL_INPUT)?.value);
  }

  // https://stackoverflow.com/questions/28150967/typescript-cloning-object
  cloneJSON(originalJSONObject: any) {
    return JSON.parse(JSON.stringify(originalJSONObject));
  }

  resetSliderOptionsFromCurrentToInit() {
    this.MinCPUExpertMode$.next(this.initialCPUSliderOptions.range.min);
    this.MaxCPUExpertMode$.next(this.initialCPUSliderOptions.range.max);
    this.updateSliderRange(this.cpuSlider, {
      min: this.initialCPUSliderOptions.range.min,
      max: this.initialCPUSliderOptions.range.max,
    });
    this.updateSliderRange(this.ramSlider, {
      min: this.initialMemorySliderOptions.range.min,
      max: this.initialMemorySliderOptions.range.max,
    });
  }

  updateSliderMaxValue(sliderViewCild: NouisliderComponent, maxValue: number) {
    if (sliderViewCild) {
      sliderViewCild.slider.updateOptions({
        range: { min: sliderViewCild.config.range.min, max: maxValue },
      });
    }
  }

  updateSliderRange(
    sliderViewCild: NouisliderComponent,
    range: { min: number; max: number }
  ) {
    if (sliderViewCild) {
      sliderViewCild.slider.updateOptions({ range });
    }
  }

  customerSelected() {}

  checkChanges() {
    this.CalculateMHz$.subscribe((value) => {
      if (value.cluster && value.unit && value.lowerLimit && value.upperLimit) {
        this.MinMHz$.next({
          cluster: value.cluster,
          unit: value.unit,
          limit: value.lowerLimit,
          updateMinCPU: false,
        });
        this.MaxMHz$.next({
          cluster: value.cluster,
          unit: value.unit,
          limit: value.upperLimit,
          updateMinCPU: true,
        });
      } else if (value.cluster && value.unit && value.lowerLimit) {
        this.MinMHz$.next({
          cluster: value.cluster,
          unit: value.unit,
          limit: value.lowerLimit,
          updateMinCPU: true,
        });
      } else if (value.cluster && value.unit && value.upperLimit) {
        this.MaxMHz$.next({
          cluster: value.cluster,
          unit: value.unit,
          limit: value.upperLimit,
          updateMinCPU: true,
        });
      } else {
        this.MinMHz$.next(null);
        this.MaxMHz$.next(null);
        this.form.get(this.FORM_KEY_MIN_MHZ)?.patchValue(null);
        this.form.get(this.FORM_KEY_MAX_MHZ)?.patchValue(null);
        this.MinCPUExpertMode$.next(this.initialCPUSliderOptions.range.min);
      }
    });

    this.MinMHz$.asObservable()
      .pipe(
        debounceTime(500),
        switchMap((value) => {
          if (value) {
            //this.logger('DEBUG', 'calculateMHz LOWER: ' + JSON.stringify(value));
            return this.dataService
              .getMHzCalculation(value.cluster, value.unit, value.limit)
              .pipe(
                map(({ mhz, minCPUs }) => {
                  //this.logger('DEBUG', 'LOWER calculatedMHz: ' + JSON.stringify({ mhz, minCPUs }));

                  if (value.updateMinCPU) {
                    this.MinCPUExpertMode$.next(minCPUs);
                  }

                  if (minCPUs < this.MaxCPUExpertMode$.value) {
                    if (
                      this.form.get(this.FORM_KEY_CPUS_MANUAL_INPUT)?.value <
                      minCPUs
                    ) {
                      this.form.get(this.FORM_KEY_CPUS_MANUAL_INPUT)?.reset();
                    }
                    return { mhz, minCPUs, resetCalculatedMHz: false };
                  } else {
                    this.xaNotifyService.error(
                      'Invalid Lower Limit value! minCPUs (' +
                        minCPUs +
                        ') is higher than max CPUs (' +
                        this.MaxCPUExpertMode$.value +
                        ')! Select a smaller Lower Limit!'
                    );
                    this.form.get(this.FORM_KEY_EXPERT_LOWER_LIMIT)?.reset();
                    return { mhz, minCPUs, resetCalculatedMHz: true };
                  }
                })
              );
          } else {
            this.form.get(this.FORM_KEY_MIN_MHZ)?.patchValue('');
            return EMPTY;
          }
        })
      )
      ?.subscribe((value) => {
        if (value) {
          value.resetCalculatedMHz
            ? this.form.get(this.FORM_KEY_MIN_MHZ)?.patchValue(null)
            : this.form.get(this.FORM_KEY_MIN_MHZ)?.patchValue(value.mhz);
        }
      });

    this.MaxMHz$.asObservable()
      .pipe(
        debounceTime(500),
        switchMap((value) => {
          if (value) {
            //this.logger('DEBUG', 'calculateMHz UPPER: ' + JSON.stringify(value));
            return this.dataService
              .getMHzCalculation(value.cluster, value.unit, value.limit)
              .pipe(
                map(({ mhz, minCPUs }) => {
                  //this.logger('DEBUG', 'UPPER calculatedMHz: ' + JSON.stringify({ mhz, minCPUs }));

                  if (value.updateMinCPU) {
                    this.MinCPUExpertMode$.next(minCPUs);
                  }

                  if (minCPUs < this.MaxCPUExpertMode$.value) {
                    if (
                      this.form.get(this.FORM_KEY_CPUS_MANUAL_INPUT)?.value <
                      minCPUs
                    ) {
                      this.form.get(this.FORM_KEY_CPUS_MANUAL_INPUT)?.reset();
                    }
                    return { mhz, minCPUs, resetCalculatedMHz: false };
                  } else {
                    this.xaNotifyService.error(
                      'Invalid Upper Limit value! minCPUs (' +
                        minCPUs +
                        ') is higher than max CPUs (' +
                        this.MaxCPUExpertMode$.value +
                        ')! Select a smaller Upper Limit!'
                    );
                    this.form.get(this.FORM_KEY_EXPERT_UPPER_LIMIT)?.reset();
                    return { mhz, minCPUs, resetCalculatedMHz: true };
                  }
                })
              );
          } else {
            this.form.get(this.FORM_KEY_MAX_MHZ)?.patchValue('');
            return EMPTY;
          }
        })
      )
      ?.subscribe((value) => {
        if (value) {
          value.resetCalculatedMHz
            ? this.form.get(this.FORM_KEY_MAX_MHZ)?.patchValue(null)
            : this.form.get(this.FORM_KEY_MAX_MHZ)?.patchValue(value.mhz);
        }
      });

    // Customer change listener
    this.subscribeUntilDestroyed(
      this.form.get(this.FORM_KEY_CUSTOMER)?.valueChanges,
      (selectedCustomer) => {
        this.logger('DEBUG', `ChangeListener: ${this.FORM_KEY_CUSTOMER}`);

        if (!this.Context.Payload['Customer']) {
          if (selectedCustomer) {
            if (!this.Context.Payload['Datacenter']) {
              this.form.get(this.FORM_KEY_DATACENTER)?.patchValue('odc');
            }

            this.SelectedCustomer$ = selectedCustomer;
            this.FQDNs$ = of(null);

            this.WbsInstalls$ =
              this.dataService.getWBSInstallations(selectedCustomer);
            this.WbsOperations$ =
              this.dataService.getWBSInstallations(selectedCustomer);
            // Specific Infrastructure option is checked
            if (
              this.form.get(this.FORM_KEY_SPECIFIC_INFRASTRUCTURE_SELECTION)
                ?.value
            ) {
              // Calling the new customer specific platforms endpoint
              this.Infrastructures$ =
                this.dataService.getPlatforms(selectedCustomer);
              this.enableFormElement(this.FORM_KEY_INFRASTRUCTURE);
            } else {
              this.Infrastructures$ = this.dataService
                .getPreferredPlatformSpecification(
                  this.form.get(this.FORM_KEY_DATACENTER)?.value
                )
                ?.pipe(
                  toArray(),
                  tap((val) => {
                    this.form
                      .get(this.FORM_KEY_INFRASTRUCTURE)
                      ?.patchValue(val[0]['vCenter']);
                  })
                );
            }

            //subscribing to the customer KMS
            this.dataService.getKMSFor(selectedCustomer)?.subscribe((res) => {
              let str = res.split(' - ');
              this.kms = res;
              this.kmsIP = str[1];
              this.KMS$.next(str);
              this.KMS$.pipe(takeUntil(this.destroy$))?.subscribe((res) => {
                if (res.length > 1) {
                  this.form.get('KmsIP')?.patchValue(this.kmsIP);
                } else {
                  this.form.get('KmsIP')?.patchValue('');
                }
              });
            });
            // Subscribing to the customerLans
            this.dataService
              .getCustomerLANsFor(selectedCustomer, 4)
              ?.subscribe((result) => {
                this.CustomerLANs$.next(result);
                this.disableFormElement(this.FORM_KEY_NAS_LAN_CHECK);
                this.form.get(this.FORM_KEY_NAS_LAN)?.patchValue('');
                this.naslanlabel = '';
              });

            this.dataService
              .getAdminLANCustomer(selectedCustomer)
              ?.subscribe((res) => {
                this.showAdminLan = res;
              });

            // Subscribing to AdminLANs
            this.dataService
              .getAdminLANsFor(selectedCustomer, 4)
              ?.subscribe((result) => this.AdminLANs$.next(result));

            // Subscribing to NASLANs
            // this.dataService.getNASLANsFor(selectedCustomer, 4)?.subscribe(
            //   result => this.NASLANs$.next(result)
            // );

            // Fetching customer's dns subdomains
            this.CustomerSubdomains$ = this.dataService
              .getCustomerDNSSubdomains(selectedCustomer)
              ?.pipe(shareReplay(1));

            this.enableFormElement(this.FORM_KEY_WBS_INSTALL);
            this.enableFormElement(this.FORM_KEY_WBS_OPERATIONS);
            this.enableFormElement(this.FORM_KEY_CUSTOMER_LAN);
            this.enableFormElement(this.FORM_KEY_ADMIN_LAN);
            //this.enableFormElement(this.FORM_KEY_NAS_LAN);
            this.enableFormElement(this.FORM_KEY_HOSTNAME);
            this.disableFormElement(this.FORM_KEY_FQDN);

            if (this.form.get(this.FORM_KEY_USE_SLA)?.value) {
              this.enableFormElement(this.FORM_KEY_SLA);
              this.SLA$ = this.dataService.getSLA(
                this.form.get(this.FORM_KEY_CUSTOMER)?.value
              );
            }
          } else {
            this.SelectedCustomer$ = null;
            this.showAdminLan = '';
            this.disableFormElement(this.FORM_KEY_WBS_INSTALL);
            this.disableFormElement(this.FORM_KEY_WBS_OPERATIONS);
            // We should disable and reset the infrastructure dropdown box here only when
            // specific infrastructure option is selected.
            if (
              this.form.get(this.FORM_KEY_SPECIFIC_INFRASTRUCTURE_SELECTION)
                ?.value
            ) {
              this.disableFormElement(this.FORM_KEY_INFRASTRUCTURE);
            }
            this.disableFormElement(this.FORM_KEY_SLA);
            this.disableFormElement(this.FORM_KEY_CUSTOMER_LAN);
            this.disableFormElement(this.FORM_KEY_ADMIN_LAN);
            this.disableFormElement(this.FORM_KEY_NAS_LAN_CHECK);
            this.form.get(this.FORM_KEY_NAS_LAN)?.patchValue('');
            this.naslanlabel = '';
            this.disableFormElement(this.FORM_KEY_FQDN);
            this.disableFormElement(this.FORM_KEY_HOSTNAME);
          }

          this.updateDomainFormControl();
        }
        //If there is a Payload for Cloningfeature
        else {
          if (selectedCustomer) {
            this.WbsInstalls$ =
              this.dataService.getWBSInstallations(selectedCustomer);
            this.WbsOperations$ =
              this.dataService.getWBSInstallations(selectedCustomer);
            this.form.get('WbsInstall')?.enable();
            this.form.get('WbsOperations')?.enable();

            if (
              this.form.get(this.FORM_KEY_SPECIFIC_INFRASTRUCTURE_SELECTION)
                ?.value
            ) {
              // Calling the new customer specific platforms endpoint
              this.Infrastructures$ =
                this.dataService.getPlatforms(selectedCustomer);
              this.enableFormElement(this.FORM_KEY_INFRASTRUCTURE);
              this.form
                .get('Infrastructure')
                ?.patchValue(this.Context.Payload['Infrastructure']);
            } else {
              this.Infrastructures$ = this.dataService
                .getPreferredPlatformSpecification(
                  this.form.get(this.FORM_KEY_DATACENTER)?.value
                )
                ?.pipe(
                  toArray(),
                  tap((val) => {
                    this.form
                      .get(this.FORM_KEY_INFRASTRUCTURE)
                      ?.patchValue(val[0]['vCenter']);
                  })
                );
            }

            this.enableFormElement(this.FORM_KEY_CUSTOMER_LAN);
            this.enableFormElement(this.FORM_KEY_ADMIN_LAN);
            this.form.get(this.FORM_KEY_NAS_LAN_CHECK)?.disable();
            this.form.get(this.FORM_KEY_NAS_LAN)?.patchValue('');

            if (this.form.get(this.FORM_KEY_USE_SLA)?.value) {
              this.enableFormElement(this.FORM_KEY_SLA);
              this.form.get('SLA')?.patchValue(this.Context.Payload['SLA']);
              this.SLA$ = this.dataService.getSLA(
                this.form.get(this.FORM_KEY_CUSTOMER)?.value
              );
            }

            // Subscribing to the customerLans
            this.dataService
              .getCustomerLANsFor(selectedCustomer, 4)
              ?.subscribe((result) => {
                this.CustomerLANs$.next(result);
                this.form
                  .get('CustomerLAN')
                  ?.patchValue(this.Context.Payload['CustomerLAN']);
              });

            this.dataService
              .getAdminLANCustomer(selectedCustomer)
              ?.subscribe((res) => {
                this.showAdminLan = res;
              });
            // Subscribing to AdminLANs
            this.dataService
              .getAdminLANsFor(selectedCustomer, 4)
              ?.subscribe((result) => {
                this.AdminLANs$.next(result);
                this.form
                  .get('AdminLAN')
                  ?.patchValue(this.Context.Payload['AdminLAN']);
              });

            // Subscribing to NASLANs
            // this.dataService.getNASLANsFor(selectedCustomer, 4)?.subscribe(
            //   result => {
            //     this.NASLANs$.next(result);
            //     this.form.get('NASLAN')?.patchValue(this.Context.Payload['NASLAN']);
            //   }
            // );

            // Fetching customer's dns subdomains
            this.CustomerSubdomains$ = this.dataService
              .getCustomerDNSSubdomains(selectedCustomer)
              ?.pipe(shareReplay(1));
          } else {
            this.SelectedCustomer$ = null;
            this.showAdminLan = '';
            this.disableFormElement(this.FORM_KEY_WBS_INSTALL);
            this.disableFormElement(this.FORM_KEY_WBS_OPERATIONS);
            // We should disable and reset the infrastructure dropdown box here only when
            // specific infrastructure option is selected.
            if (
              this.form.get(this.FORM_KEY_SPECIFIC_INFRASTRUCTURE_SELECTION)
                ?.value
            ) {
              this.disableFormElement(this.FORM_KEY_INFRASTRUCTURE);
            }
            this.disableFormElement(this.FORM_KEY_SLA);
            this.disableFormElement(this.FORM_KEY_CUSTOMER_LAN);
            this.disableFormElement(this.FORM_KEY_ADMIN_LAN);
            //this.disableFormElement(this.FORM_KEY_NAS_LAN);
            this.disableFormElement(this.FORM_KEY_FQDN);
            this.disableFormElement(this.FORM_KEY_HOSTNAME);
          }

          this.updateDomainFormControl();
          this.form.get('Domain')?.patchValue(this.Context.Payload['Domain']);
        }
      },
      (error) => this.errorHandlingRxJS(error)
    );

    // OS Supported by change listener
    this.subscribeUntilDestroyed(
      this.form.get(this.FORM_KEY_OS_SUPPORTED_BY)!.valueChanges,
      (selectedOSgroup) => {
        this.logger(
          'DEBUG',
          `ChangeListener: ${this.FORM_KEY_OS_SUPPORTED_BY}`
        );

        if (!this.Context.Payload['ServiceTimeOS']) {
          if (selectedOSgroup) {
            this.ServiceTimeOS$ =
              this.dataService.getServiceTimeByOSGroup(selectedOSgroup);
            this.enableFormElement(this.FORM_KEY_SERVICE_TIME_OS_SUPPORT);
          } else {
            this.disableFormElement(this.FORM_KEY_SERVICE_TIME_OS_SUPPORT);
          }
          //If there is a Payload for Cloningfeature
        } else {
          this.ServiceTimeOS$ =
            this.dataService.getServiceTimeByOSGroup(selectedOSgroup);
          this.form.get('ServiceTimeOS')?.enable();
          this.form
            .get('ServiceTimeOS')
            ?.patchValue(this.Context.Payload['ServiceTimeOS']);
        }
      },
      (error) => this.errorHandlingRxJS(error)
    );

    // App supported by change listener
    this.subscribeUntilDestroyed(
      this.form.get(this.FORM_KEY_APP_SUPPORTED_BY)!.valueChanges,
      (selectedApp) => {
        this.logger(
          'DEBUG',
          `ChangeListener: ${this.FORM_KEY_APP_SUPPORTED_BY}`
        );
        if (!this.Context.Payload['ServiceTimeAppSupport']) {
          if (selectedApp) {
            this.ServiceTimeAppSupport$ =
              this.dataService.getServiceTimeByAPPGroup(selectedApp);
            this.enableFormElement(this.FORM_KEY_SERVICE_TIME_APP_SUPPORT);
          } else {
            this.disableFormElement(this.FORM_KEY_SERVICE_TIME_APP_SUPPORT);
          }
          //If there is a Payload for Cloningfeature
        } else {
          this.ServiceTimeAppSupport$ =
            this.dataService.getServiceTimeByAPPGroup(selectedApp);
          this.form.get('ServiceTimeAppSupport')?.enable();
          this.form
            .get('ServiceTimeAppSupport')
            ?.patchValue(this.Context.Payload['ServiceTimeAppSupport']);
        }
      },
      (error) => this.errorHandlingRxJS(error)
    );

    // Use SLA checkbox listener
    this.subscribeUntilDestroyed(
      this.form.get(this.FORM_KEY_USE_SLA)!.valueChanges,
      (checkboxState) => {
        this.logger('DEBUG', `ChangeListener: ${this.FORM_KEY_USE_SLA}`);

        if (checkboxState) {
          if (this.form.get(this.FORM_KEY_CUSTOMER)?.value) {
            this.enableFormElement(this.FORM_KEY_SLA);
            this.SLA$ = this.dataService.getSLA(
              this.form.get(this.FORM_KEY_CUSTOMER)?.value
            );
          }
        } else {
          this.disableFormElement(this.FORM_KEY_SLA);
        }
      },
      (error) => this.errorHandlingRxJS(error)
    );

    // TODO: Enable Specific Selection checkbox listener
    this.subscribeUntilDestroyed(
      this.form.get(this.FORM_KEY_SPECIFIC_INFRASTRUCTURE_SELECTION)!
        .valueChanges,
      (status) => {
        this.logger(
          'DEBUG',
          `ChangeListener: ${this.FORM_KEY_SPECIFIC_INFRASTRUCTURE_SELECTION}`
        );
        if (!this.Context.Payload['Infrastructure']) {
          if (status) {
            // removing the errors from the datacenter formControl manually
            // - otherwise the form remains invalid after an empty response from the datacenter ep see #1580 in redmine
            this.form.get(this.FORM_KEY_DATACENTER)?.setErrors(null);
            // resetting the boolean flag representing the availability of cluster vcenter data
            this.missingClusterVCenterData = false;
            this.resetSliderOptionsFromCurrentToInit();
            // We need to fetch the data from the custom specific platforms' endpoint
            this.Infrastructures$ = this.dataService.getPlatforms(
              this.form.get(this.FORM_KEY_CUSTOMER)?.value
            );
            this.enableFormElement(this.FORM_KEY_INFRASTRUCTURE);
            this.enableFormElement(this.FORM_KEY_AGREE);
          } else {
            this.form.get(this.FORM_KEY_DATACENTER)?.reset('odc');
            this.disableFormElement(this.FORM_KEY_INFRASTRUCTURE);
            this.disableFormElement(this.FORM_KEY_AGREE);

            this.Infrastructures$ = this.dataService
              .getPreferredPlatformSpecification(
                this.form.get(this.FORM_KEY_DATACENTER)?.value
              )
              ?.pipe(
                toArray(),
                tap((val) => {
                  this.form
                    .get(this.FORM_KEY_INFRASTRUCTURE)
                    ?.patchValue(val[0]['vCenter']);
                })
              );
          }
          this.IsSpecificInfrastructureChecked$ = of(status);
        } //If there is a Payload for Cloningfeature
        if (this.Context.Payload['Infrastructure']) {
          if (status) {
            this.enableFormElement(this.FORM_KEY_INFRASTRUCTURE);
            this.Infrastructures$ = this.dataService.getPlatforms(
              this.Context.Payload['Customer']
            );
            this.form
              .get('Infrastructure')
              ?.patchValue(this.Context.Payload['Infrastructure']);

            this.enableFormElement(this.FORM_KEY_AGREE);
            this.form
              .get('AgreeToDiscussion')
              ?.patchValue(this.Context.Payload['AgreeToDiscussion']);
          } else {
            this.form.get(this.FORM_KEY_DATACENTER)?.reset('odc');
            this.disableFormElement(this.FORM_KEY_INFRASTRUCTURE);
            this.disableFormElement(this.FORM_KEY_AGREE);

            this.Infrastructures$ = this.dataService
              .getPreferredPlatformSpecification(
                this.form.get(this.FORM_KEY_DATACENTER)?.value
              )
              ?.pipe(
                toArray(),
                tap((val) => {
                  this.form
                    .get(this.FORM_KEY_INFRASTRUCTURE)
                    ?.patchValue(val[0]['vCenter']);
                })
              );
          }
          this.IsSpecificInfrastructureChecked$ = of(status);
        }
      },
      (error) => this.errorHandlingRxJS(error)
    );

    // Datacenter radiobox formgroup listener
    this.subscribeUntilDestroyedWithSwitchMap(
      this.form.get(this.FORM_KEY_DATACENTER)?.valueChanges,
      (datacenter) => {
        if (datacenter) {
          this.missingClusterVCenterData = false;
          return (this.ReceivedSimpleDatacenters$ =
            this.dataService.getPreferredPlatformSpecification(datacenter));
        }
      },
      ({ vCenter, cluster }) => {
        this.logger('DEBUG', `ChangeListener: ${this.FORM_KEY_DATACENTER}`);

        if (vCenter && cluster) {
          this.missingClusterVCenterData = false;
          this.form.get(this.FORM_KEY_INFRASTRUCTURE)?.patchValue(vCenter);
          this.ESXClusters$ = of([cluster]);
          this.form.get(this.FORM_KEY_ESX_CLUSTER)?.patchValue(cluster);

          if (this.form.get(this.FORM_KEY_CUSTOMER)?.value) {
            this.DatastoreTypes$ = this.dataService.getDatastoreTypes(
              vCenter,
              this.form.get(this.FORM_KEY_CUSTOMER)?.value
            );
          }
        } else {
          this.disableFormElement(this.FORM_KEY_INFRASTRUCTURE);
          this.missingClusterVCenterData = true;
          // TODO: here we set the form invalid but the label does not appear...
          this.form.get(this.FORM_KEY_DATACENTER)?.setErrors({
            uniqueName: {
              message:
                'Cluster and/or vCenter data cannot be retrieved from the database!',
            },
          });
        }
      },
      (error) => this.errorHandlingRxJS(error)
    );

    // Infrastructure (Platform change listener)
    this.subscribeUntilDestroyed(
      this.form.get(this.FORM_KEY_INFRASTRUCTURE)!.valueChanges,
      (selectedInfrastructure) => {
        this.logger('DEBUG', `ChangeListener: ${this.FORM_KEY_INFRASTRUCTURE}`);

        if (!this.Context.Payload['ESXCluster']) {
          if (
            selectedInfrastructure &&
            !this.missingClusterVCenterData &&
            this.form.get(this.FORM_KEY_CUSTOMER)?.value
          ) {
            if (
              this.form.get(this.FORM_KEY_SPECIFIC_INFRASTRUCTURE_SELECTION)
                ?.value
            ) {
              this.ESXClusters$ = this.dataService.getClusters(
                selectedInfrastructure
              );
              this.DatastoreTypes$ = this.dataService.getDatastoreTypes(
                selectedInfrastructure,
                this.form.get(this.FORM_KEY_CUSTOMER)?.value
              );
              this.missingCPUCapacityData = false;
            }
            // We should only enable the cluster dropdown box when specific infrastructure selection was chosen
            if (
              this.form.get(this.FORM_KEY_SPECIFIC_INFRASTRUCTURE_SELECTION)
                ?.value
            ) {
              this.enableFormElement(this.FORM_KEY_ESX_CLUSTER);
            } else {
              this.form.get(this.FORM_KEY_ESX_CLUSTER)?.disable();
            }
            this.enableFormElement(this.FORM_KEY_DATASTORE_TYPE);
          } else {
            this.disableFormElement(this.FORM_KEY_ESX_CLUSTER);
            this.disableFormElement(this.FORM_KEY_DATASTORE_TYPE);
          }
          //If there is a Payload for Cloningfeature
        }
        if (this.Context.Payload['ESXCluster']) {
          if (
            selectedInfrastructure &&
            !this.missingClusterVCenterData &&
            this.form.get(this.FORM_KEY_CUSTOMER)?.value
          ) {
            this.form.get('DatastoreType')?.enable();
            this.DatastoreTypes$ = this.dataService.getDatastoreTypes(
              selectedInfrastructure,
              this.form.get(this.FORM_KEY_CUSTOMER)?.value
            );
            this.form
              .get('DatastoreType')
              ?.patchValue(this.Context.Payload['DatastoreType']);
            if (
              this.form.get(this.FORM_KEY_SPECIFIC_INFRASTRUCTURE_SELECTION)
                ?.value
            ) {
              this.form.get('ESXCluster')?.enable();
              this.form
                .get('ESXCluster')
                ?.patchValue(this.Context.Payload['ESXCluster']);
              this.ESXClusters$ = this.dataService.getClusters(
                this.Context.Payload['Infrastructure']
              );
              this.missingCPUCapacityData = false;
            } else {
              this.form.get('ESXCluster')?.disable();
            }
          } else {
            this.disableFormElement(this.FORM_KEY_ESX_CLUSTER);
            this.disableFormElement(this.FORM_KEY_DATASTORE_TYPE);
          }
        }
      },
      (error) => this.errorHandlingRxJS(error)
    );

    // Cluster change listener
    this.subscribeUntilDestroyedWithSwitchMap(
      this.form.get(this.FORM_KEY_ESX_CLUSTER)!.valueChanges,
      (selectedCluster) => {
        this.logger(
          'DEBUG',
          `ChangeListener: ${this.FORM_KEY_ESX_CLUSTER} SWITCHMAP: ` +
            selectedCluster
        );
        if (!this.Context.Payload['CPUs'] && !this.Context.Payload['RAM']) {
          this.CalculateMHz$.next({
            cluster: selectedCluster,
            unit: this.CalculateMHz$.value.unit,
            lowerLimit: this.CalculateMHz$.value.lowerLimit,
            upperLimit: this.CalculateMHz$.value.upperLimit,
          });

          if (selectedCluster) {
            this.form.get(this.FORM_KEY_CPUS)?.disable();
            this.form.get(this.FORM_KEY_RAM)?.disable();
            this.form.get(this.FORM_KEY_CPUS_MANUAL_INPUT)?.disable();
            this.form.get(this.FORM_KEY_RAM_MANUAL_INPUT)?.disable();
            this.isESXClusterSelected = true;
            return (this.ClusterCapacity$ = this.dataService
              .getClusterCapacity(selectedCluster)
              ?.pipe(
                map(({ maxCPUs, maxMemory }) => ({
                  selectedCluster,
                  maxCPUs,
                  maxMemory,
                }))
              ));
          } else {
            this.resetSliderOptionsFromCurrentToInit();
            this.form.get(this.FORM_KEY_CPUS)?.disable();
            this.form.get(this.FORM_KEY_RAM)?.disable();
            this.form.get(this.FORM_KEY_CPUS_MANUAL_INPUT)?.disable();
            this.form.get(this.FORM_KEY_RAM_MANUAL_INPUT)?.disable();
            this.isESXClusterSelected = false;
            return EMPTY;
          }
        }
        //If there is a Payload for Cloningfeature
        else {
          if (this.Context.Payload['CPUs'] && this.Context.Payload['RAM']) {
            this.CalculateMHz$.next({
              cluster: selectedCluster,
              unit: this.CalculateMHz$.value.unit,
              lowerLimit: this.CalculateMHz$.value.lowerLimit,
              upperLimit: this.CalculateMHz$.value.upperLimit,
            });
            if (selectedCluster) {
              this.form.get('CPUs')?.patchValue(this.Context.Payload['CPUs']);
              this.form.get('RAM')?.patchValue(this.Context.Payload['RAM']);
              this.form.get('CPUs')?.disable();
              this.form.get('RAM')?.disable();
              this.form.get('CPUsm')?.disable();
              this.form.get('RAMm')?.disable();
              this.isESXClusterSelected = true;
              return (this.ClusterCapacity$ = this.dataService
                .getClusterCapacity(selectedCluster)
                ?.pipe(
                  map(({ maxCPUs, maxMemory }) => ({
                    selectedCluster,
                    maxCPUs,
                    maxMemory,
                  }))
                ));
            } else {
              this.resetSliderOptionsFromCurrentToInit();
              this.form.get(this.FORM_KEY_CPUS)?.disable();
              this.form.get(this.FORM_KEY_RAM)?.disable();
              this.form.get(this.FORM_KEY_CPUS_MANUAL_INPUT)?.disable();
              this.form.get(this.FORM_KEY_RAM_MANUAL_INPUT)?.disable();
              this.isESXClusterSelected = false;
              return EMPTY;
            }
          }
        }
      },

      (clusterCapacity: ClusterCapacity) => {
        this.logger('DEBUG', `ChangeListener: ${this.FORM_KEY_ESX_CLUSTER}`);

        if (
          clusterCapacity &&
          clusterCapacity.maxCPUs &&
          clusterCapacity.maxMemory
        ) {
          //this.sliderOptionPipe.transform(this.Context, 'cpuRangeOptions')?.range.max = value.maxCPUs;
          this.missingCPUCapacityData = false;
          this.MaxCPUExpertMode$.next(clusterCapacity.maxCPUs);
          this.form.get(this.FORM_KEY_CPUS)?.enable();
          this.form.get(this.FORM_KEY_RAM)?.enable();
          this.form.get(this.FORM_KEY_CPUS_MANUAL_INPUT)?.enable();
          this.form.get(this.FORM_KEY_RAM_MANUAL_INPUT)?.enable();
          this.updateSliderMaxValue(this.cpuSlider, clusterCapacity.maxCPUs);
          this.updateSliderMaxValue(this.ramSlider, clusterCapacity.maxMemory);
        } else {
          this.missingCPUCapacityData = true;
          this.form.get(this.FORM_KEY_CPUS)?.patchValue('');
          this.form.get(this.FORM_KEY_RAM)?.patchValue('');
          this.disableFormElement(this.FORM_KEY_EXPERT_LIMITS_UNIT);
        }
      },
      (error) => this.errorHandlingRxJS(error),
      () => {
        this.logger(
          'DEBUG',
          `ChangeListener: ${this.FORM_KEY_ESX_CLUSTER} COMPLETED`
        );
      }
    );

    // OS change listener
    this.subscribeUntilDestroyed(
      this.form.get(this.FORM_KEY_OS)?.valueChanges,
      (selectedOS) => {
        this.logger('DEBUG', `ChangeListener: ${this.FORM_KEY_OS}`);

        if (!this.Context.Payload['OS']) {
          if (selectedOS) {
            const selectedOSLowerCase = (selectedOS as string)?.toLowerCase();

            // Setting the OS icon class and calling the OS versions endpoint
            this.OSIcon$ = of(selectedOSLowerCase);
            this.OSVersions$ =
              this.dataService.getOSVersions(selectedOSLowerCase);

            // Calling OS supportedBy endpoint based on the type of the OS
            this.OSSupportedBy$ =
              this.dataService.getOSSupportedBy(selectedOSLowerCase);
            this.enableFormElement(this.FORM_KEY_OS_SUPPORTED_BY);
            this.enableFormElement(this.FORM_KEY_HOSTNAME);

            // clearing the vmdks formArray
            this.vmdks.clear();

            // Setting the VMDK storage slider section's name based on the selected OS
            if (selectedOS === 'Windows') {
              this.hostnameLength$.next(15);
              this.enableFormElement(this.FORM_KEY_LICENSE_TYPE, 'spla');

              // setting 'Name' in the table header & initializing the first Windows vmdk storage
              this.patchOrName = 'Name';
              // Initializing the first windows storage (Name: C)
              this.vmdks.push(
                this.createDrive({
                  size: 100,
                  mandatory: true,
                  name: 'C',
                })
              );
            } else if (selectedOS === 'Linux') {
              this.hostnameLength$.next(20);
              this.disableFormElement(this.FORM_KEY_LICENSE_TYPE);

              // setting 'Path' the table header
              this.patchOrName = 'Path';

              // Initializing the only one VMDK storage when Linux was selected
              this.vmdks.push(
                this.createDrive({
                  size: 10,
                  mandatory: true,
                  name: '/data',
                })
              );
            }

            this.enableFormElement(this.FORM_KEY_OS_VERSION);
          } else {
            this.disableFormElement(this.FORM_KEY_LICENSE_TYPE);
            this.disableFormElement(this.FORM_KEY_OS_SUPPORTED_BY);
            this.disableFormElement(this.FORM_KEY_OS_VERSION);
            this.disableFormElement(this.FORM_KEY_HOSTNAME);

            this.vmdks.clear();
          }
          this.updateDomainFormControl();
        }
        //If there is a Payload for Cloningfeature
        else {
          if (selectedOS) {
            const selectedOSLowerCase = (selectedOS as string)?.toLowerCase();
            this.OSIcon$ = of(selectedOSLowerCase);
            this.OSVersions$ =
              this.dataService.getOSVersions(selectedOSLowerCase);
            this.OSSupportedBy$ =
              this.dataService.getOSSupportedBy(selectedOSLowerCase);
            this.form.get('OSSupportedBy')?.enable();
            this.form
              .get('OSSupportedBy')
              ?.patchValue(this.Context.Payload['OSSupportedBy']);

            this.enableFormElement(this.FORM_KEY_HOSTNAME);
            //this.form.get('Hostname')?.patchValue(this.Context.Payload['Hostname'])

            if (selectedOS === 'Windows') {
              this.hostnameLength$.next(15);

              this.patchOrName = 'Name';
              if (this.vmdks.length == 0) {
                this.Context.Payload['VMDK'].forEach((element) => {
                  this.vmdks.push(
                    this.createDrive(this.Context.Payload['VMDK'])
                  );
                });
              }

              this.form.get('OSVersion')?.enable();
              this.form
                .get('OSVersion')
                ?.patchValue(this.Context.Payload['OSVersion']);
              this.form.get('Domain')?.enable();
              this.form
                .get('Domain')
                ?.patchValue(this.Context.Payload['Domain']);
              this.enableFormElement(
                this.FORM_KEY_LICENSE_TYPE,
                this.Context.Payload['LicenseType']
              );
            } else if (selectedOS === 'Linux') {
              this.hostnameLength$.next(20);
              this.disableFormElement(this.FORM_KEY_LICENSE_TYPE);

              // setting 'Path' the table header
              this.patchOrName = 'Path';

              if (this.vmdks.length == 0) {
                this.vmdks.push(this.createDrive(this.Context.Payload['VMDK']));
              }
              this.form.get('Domain')?.disable();
            }
            this.form.get('OSVersion')?.enable();
            this.form
              .get('OSVersion')
              ?.patchValue(this.Context.Payload['OSVersion']);
          } else {
            this.disableFormElement(this.FORM_KEY_LICENSE_TYPE);
            this.disableFormElement(this.FORM_KEY_OS_SUPPORTED_BY);
            this.disableFormElement(this.FORM_KEY_OS_VERSION);
            this.disableFormElement(this.FORM_KEY_HOSTNAME);

            this.vmdks.clear();
          }
          this.updateDomainFormControl();
        }
      },
      (error) => this.errorHandlingRxJS(error)
    );

    // OS release change listener
    this.subscribeUntilDestroyed(
      this.form.get(this.FORM_KEY_OS_VERSION)?.valueChanges,
      (selectedOSVersion) => {
        this.logger('DEBUG', `ChangeListener: ${this.FORM_KEY_OS_VERSION}`);

        if (!this.Context.Payload['OSVersion']) {
          const selectedOSType = this.form.get(this.FORM_KEY_OS)?.value;
          // Selecting release is only applicable if Linux was chosen as OS
          if (selectedOSVersion && selectedOSType === 'Linux') {
            this.Releases$ = this.dataService.getOSReleases(
              this.form.get(this.FORM_KEY_OS)?.value.toLowerCase(),
              this.form.get(this.FORM_KEY_OS_VERSION)?.value
            );
            this.enableFormElement(this.FORM_KEY_OS_RELEASE);
          } else {
            this.disableFormElement(this.FORM_KEY_OS_RELEASE);
          }
          //If there is a Payload for Cloningfeature
        } else {
          const selectedOSType = this.form.get(this.FORM_KEY_OS)?.value;
          // Selecting release is only applicable if Linux was chosen as OS

          if (selectedOSVersion && selectedOSType === 'Linux') {
            this.enableFormElement(this.FORM_KEY_OS_RELEASE);
            this.Releases$ = this.dataService.getOSReleases(
              this.form.get(this.FORM_KEY_OS)?.value.toLowerCase(),
              this.form.get(this.FORM_KEY_OS_VERSION)?.value
            );
            this.form
              .get('Release')
              ?.patchValue(this.Context.Payload['Release']);
          } else {
            this.disableFormElement(this.FORM_KEY_OS_RELEASE);
          }
        }
      },
      (error) => this.errorHandlingRxJS(error)
    );

    // LicenseType change listener
    this.subscribeUntilDestroyed(
      this.form.get(this.FORM_KEY_LICENSE_TYPE)!.valueChanges,
      (licenseType) => {
        this.logger('DEBUG', `ChangeListener: ${this.FORM_KEY_LICENSE_TYPE}`);
        if (!this.Context.Payload['LicenseKey']) {
          if (licenseType === 'kms') {
            this.enableFormElement(this.FORM_KEY_KMS_IP);
            if (this.kmsIP) {
              this.form.get(this.FORM_KEY_KMS_IP)?.patchValue(this.kmsIP);
            } else {
              this.form.get(this.FORM_KEY_KMS_IP)?.patchValue('');
            }
            this.disableFormElement(this.FORM_KEY_LICENSE_KEY);
          } else if (licenseType === 'spla') {
            this.disableFormElement(this.FORM_KEY_KMS_IP);
            this.enableFormElement(this.FORM_KEY_LICENSE_KEY);
          } else {
            this.disableFormElement(this.FORM_KEY_KMS_IP);
            this.disableFormElement(this.FORM_KEY_LICENSE_KEY);
          }
          //If there is a Payload for Cloningfeature
        }
        if (this.Context.Payload['LicenseKey']) {
          if (licenseType === 'kms') {
            this.enableFormElement(this.FORM_KEY_KMS_IP);
            this.form.get('KmsIP')?.patchValue(this.Context.Payload['KmsIP']);
            this.disableFormElement(this.FORM_KEY_LICENSE_KEY);
          } else if (licenseType === 'spla') {
            this.disableFormElement(this.FORM_KEY_KMS_IP);

            this.enableFormElement(this.FORM_KEY_LICENSE_KEY);
            this.form
              .get('LicenseKey')
              ?.patchValue(this.Context.Payload['LicenseKey']);
          } else {
            this.disableFormElement(this.FORM_KEY_KMS_IP);
            this.disableFormElement(this.FORM_KEY_LICENSE_KEY);
          }
        }
      }
    );

    // Hostname change listener
    this.form
      .get(this.FORM_KEY_HOSTNAME)
      ?.valueChanges.pipe(
        takeUntil(this.destroy$),
        // We should continue only when we have a customer selected
        filter(() => Boolean(this.form.get(this.FORM_KEY_CUSTOMER)?.value)),
        debounceTime(500),
        distinctUntilChanged(),
        tap((hname) => {
          if (hname) {
            this.FQDNs$ = of(null);
            this.enableFormElement(this.FORM_KEY_FQDN);
          } else {
            this.disableFormElement(this.FORM_KEY_FQDN);
          }
        }),
        // Skip or stop the process from this point if hname is undefined
        filter((hname) => Boolean(hname)),

        switchMap((hname) => {
          if (hname) {
            return (this.IsHostnameAvailable$ =
              this.dataService.getHostnameAvailability(hname));
          }
        }),

        switchMap((isHostnameAvailable) => {
          if (isHostnameAvailable) {
            return this.CustomerSubdomains$;
          } else {
            this.form.get(this.FORM_KEY_HOSTNAME)?.setErrors({
              uniqueName: {
                message: 'Hostname is reserved! Please enter another one.',
              },
            });
            return (this.IsHostnameAvailable$ = of(false));
          }
        })
      )
      ?.subscribe((result) => {
        this.logger('DEBUG', `ChangeListener: ${this.FORM_KEY_HOSTNAME}`);

        const hname = this.form.get(this.FORM_KEY_HOSTNAME)?.value;

        if (result && result.length > 0) {
          this.disableFormElement(this.FORM_KEY_FQDN);
          if (hname) {
            const mappedResult = result.map((domain) => hname + '.' + domain);
            this.FQDNs$ = of(mappedResult);
            this.enableFormElement(this.FORM_KEY_FQDN);
          } else {
            this.disableFormElement(this.FORM_KEY_FQDN);
          }
        } else {
          this.disableFormElement(this.FORM_KEY_FQDN);
        }
      });

    // Expert Mode checkbox listener
    this.subscribeUntilDestroyed(
      this.form.get(this.FORM_KEY_EXPERT_MODE)?.valueChanges,
      (result) => {
        this.logger('DEBUG', `ChangeListener: ${this.FORM_KEY_EXPERT_MODE}`);

        if (!this.Context.Payload['ExpertLimitsUnit']) {
          if (result && !this.missingCPUCapacityData) {
            this.expertLimitsUnits$ = of(this.limitsUnit);
            this.enableFormElement(this.FORM_KEY_EXPERT_LIMITS_UNIT);
          } else {
            this.disableFormElement(this.FORM_KEY_MIN_MHZ);
            this.disableFormElement(this.FORM_KEY_MAX_MHZ);
            this.disableFormElement(this.FORM_KEY_EXPERT_LIMITS_UNIT);
            this.disableFormElement(this.FORM_KEY_EXPERT_UPPER_LIMIT);
            this.disableFormElement(this.FORM_KEY_EXPERT_LOWER_LIMIT);
            this.disableFormElement(this.FORM_KEY_EXPERT_LOWER_LIMIT_CHECKBOX);
            this.disableFormElement(this.FORM_KEY_EXPERT_UPPER_LIMIT_CHECKBOX);
            this.form
              .get(this.FORM_KEY_CPUS)
              ?.patchValue(this.initialCPUSliderOptions.range.min);
            this.form
              .get(this.FORM_KEY_RAM)
              ?.patchValue(this.initialMemorySliderOptions.range.min);
          }
          //If there is a Payload for Cloningfeature
        }
        if (this.Context.Payload['ExpertLimitsUnit']) {
          if (result && !this.missingCPUCapacityData) {
            this.form.get('ExpertLimitsUnit')?.enable();
            this.expertLimitsUnits$ = of(this.limitsUnit);
            this.form
              .get('ExpertLimitsUnit')
              ?.patchValue(this.Context.Payload['ExpertLimitsUnit']);

            this.form
              .get('LowerLimitCheckBox')
              ?.patchValue(this.Context.Payload['LowerLimitCheckBox']);
            this.form.get('ExpertLowerLimit')?.enable();
            this.form
              .get('ExpertLowerLimit')
              ?.patchValue(this.Context.Payload['ExpertLowerLimit']);

            this.form
              .get('UpperLimitCheckBox')
              ?.patchValue(this.Context.Payload['UpperLimitCheckBox']);
            this.form.get('ExpertUpperLimit')?.enable();
            this.form
              .get('ExpertUpperLimit')
              ?.patchValue(this.Context.Payload['ExpertUpperLimit']);

            this.form.get('CPUs')?.enable();
            this.form.get('CPUs')?.patchValue(this.Context.Payload['CPUs']);
            this.form.get('RAM')?.enable();
            this.form.get('RAM')?.patchValue(this.Context.Payload['RAM']);
          } else {
            this.disableFormElement(this.FORM_KEY_MIN_MHZ);
            this.disableFormElement(this.FORM_KEY_MAX_MHZ);
            this.disableFormElement(this.FORM_KEY_EXPERT_LIMITS_UNIT);
            this.disableFormElement(this.FORM_KEY_EXPERT_UPPER_LIMIT);
            this.disableFormElement(this.FORM_KEY_EXPERT_LOWER_LIMIT);
            this.disableFormElement(this.FORM_KEY_EXPERT_LOWER_LIMIT_CHECKBOX);
            this.disableFormElement(this.FORM_KEY_EXPERT_UPPER_LIMIT_CHECKBOX);
            this.form
              .get(this.FORM_KEY_CPUS)
              ?.patchValue(this.initialCPUSliderOptions.range.min);
            this.form
              .get(this.FORM_KEY_RAM)
              ?.patchValue(this.initialMemorySliderOptions.range.min);
          }
        }
      },
      (error) => this.errorHandlingRxJS(error)
    );

    //LowerLimit checkbox listener
    this.subscribeUntilDestroyed(
      this.form.get(this.FORM_KEY_EXPERT_LOWER_LIMIT_CHECKBOX)?.valueChanges,
      (result) => {
        this.logger(
          'DEBUG',
          `ChangeListener: ${this.FORM_KEY_EXPERT_LOWER_LIMIT_CHECKBOX}`
        );
        if (!this.Context.Payload['ExpertLowerLimit']) {
          if (result) {
            this.enableFormElement(this.FORM_KEY_EXPERT_LOWER_LIMIT);
            this.enableFormElement(this.FORM_KEY_MIN_MHZ);
          } else {
            this.disableFormElement(this.FORM_KEY_EXPERT_LOWER_LIMIT);
            this.disableFormElement(this.FORM_KEY_MIN_MHZ);
          }
        }
        //If there is a Payload for Cloningfeature
        if (this.Context.Payload['ExpertLowerLimit']) {
          if (result) {
            this.enableFormElement(this.FORM_KEY_EXPERT_LOWER_LIMIT);
            this.enableFormElement(this.FORM_KEY_MIN_MHZ);
            this.form
              .get('ExpertLowerLimit')
              ?.patchValue(this.Context.Payload['ExpertLowerLimit']);
          } else {
            this.disableFormElement(this.FORM_KEY_EXPERT_LOWER_LIMIT);
            this.disableFormElement(this.FORM_KEY_MIN_MHZ);
          }
        }
      },
      (error) => this.errorHandlingRxJS(error)
    );

    //UpperLimit checkbox listener
    this.subscribeUntilDestroyed(
      this.form.get(this.FORM_KEY_EXPERT_UPPER_LIMIT_CHECKBOX)?.valueChanges,
      (result) => {
        this.logger(
          'DEBUG',
          `ChangeListener: ${this.FORM_KEY_EXPERT_UPPER_LIMIT_CHECKBOX}`
        );
        if (!this.Context.Payload['ExpertUpperLimit']) {
          if (result) {
            this.enableFormElement(this.FORM_KEY_EXPERT_UPPER_LIMIT);
            this.enableFormElement(this.FORM_KEY_MAX_MHZ);
          } else {
            this.disableFormElement(this.FORM_KEY_EXPERT_UPPER_LIMIT);
            this.disableFormElement(this.FORM_KEY_MAX_MHZ);
          }
        } //If there is a Payload for Cloningfeature
        if (this.Context.Payload['ExpertUpperLimit']) {
          if (result) {
            this.enableFormElement(this.FORM_KEY_EXPERT_UPPER_LIMIT);
            this.enableFormElement(this.FORM_KEY_MAX_MHZ);
            this.form
              .get('ExpertUpperLimit')
              ?.patchValue(this.Context.Payload['ExpertUpperLimit']);
          } else {
            this.disableFormElement(this.FORM_KEY_EXPERT_UPPER_LIMIT);
            this.disableFormElement(this.FORM_KEY_MAX_MHZ);
          }
        }
      },
      (error) => this.errorHandlingRxJS(error)
    );

    //CalculateMHz: Set listener for the required values
    this.subscribeUntilDestroyed(
      this.form.get(this.FORM_KEY_EXPERT_LOWER_LIMIT)?.valueChanges,
      (expertLowerLimit) => {
        this.logger(
          'DEBUG',
          `ChangeListener: ${this.FORM_KEY_EXPERT_LOWER_LIMIT}`
        );

        // if (expertLowerLimit && this.form.get('ExpertUpperLimit')?.value && (expertLowerLimit > this.form.get('ExpertUpperLimit')?.value)) {
        //   this.xaNotifyService.error('Lower Limit can not be greater than Upper Limit!');
        //   this.minExpertUpperLimit.next(null);
        // }

        this.minExpertUpperLimit.next(expertLowerLimit);
        this.CalculateMHz$.next({
          cluster: this.CalculateMHz$.value.cluster,
          unit: this.CalculateMHz$.value.unit,
          lowerLimit: expertLowerLimit,
          upperLimit: this.CalculateMHz$.value.upperLimit,
        });
      },
      (error) => this.errorHandlingRxJS(error),
      () => {
        this.logger('DEBUG', `${this.FORM_KEY_EXPERT_LOWER_LIMIT}: COMPLETED`);
      }
    );

    this.subscribeUntilDestroyed(
      this.form.get(this.FORM_KEY_EXPERT_UPPER_LIMIT)?.valueChanges,
      (expertUpperLimit) => {
        this.logger(
          'DEBUG',
          `ChangeListener: ${this.FORM_KEY_EXPERT_UPPER_LIMIT}`
        );

        // if (expertUpperLimit && this.form.get('ExpertLowerLimit')?.value && (expertUpperLimit < this.form.get('ExpertLowerLimit')?.value)) {
        //   this.xaNotifyService.error('Upper Limit can not be smaller than Lower Limit!');
        //   this.maxExpertLowerLimit.next(null);
        // }

        this.maxExpertLowerLimit.next(expertUpperLimit);
        this.CalculateMHz$.next({
          cluster: this.CalculateMHz$.value.cluster,
          unit: this.CalculateMHz$.value.unit,
          lowerLimit: this.CalculateMHz$.value.lowerLimit,
          upperLimit: expertUpperLimit,
        });
      },
      (error) => this.errorHandlingRxJS(error),
      () => {
        this.logger('DEBUG', `${this.FORM_KEY_EXPERT_UPPER_LIMIT}: COMPLETED`);
      }
    );

    this.subscribeUntilDestroyed(
      this.form.get(this.FORM_KEY_EXPERT_LIMITS_UNIT)?.valueChanges,
      (selectedUnit) => {
        if (!this.Context.Payload) {
          if (selectedUnit) {
            this.enableFormElement(this.FORM_KEY_EXPERT_LOWER_LIMIT_CHECKBOX);
            this.enableFormElement(this.FORM_KEY_EXPERT_UPPER_LIMIT_CHECKBOX);

            this.logger(
              'DEBUG',
              `ChangeListener: ${this.FORM_KEY_EXPERT_LIMITS_UNIT}`
            );
            this.CalculateMHz$.next({
              cluster: this.CalculateMHz$.value.cluster,
              unit: selectedUnit,
              lowerLimit: this.CalculateMHz$.value.lowerLimit,
              upperLimit: this.CalculateMHz$.value.upperLimit,
            });
            this.logger('selectedUnit: ', selectedUnit);
          } else {
            this.disableFormElement(this.FORM_KEY_EXPERT_LOWER_LIMIT_CHECKBOX);
            this.disableFormElement(this.FORM_KEY_EXPERT_UPPER_LIMIT_CHECKBOX);
            this.logger('DEBUG', 'empty result');
          }
        }
        //If there is a Payload for Cloningfeature
        else {
          if (selectedUnit) {
            this.enableFormElement(this.FORM_KEY_EXPERT_LOWER_LIMIT_CHECKBOX);
            this.form
              .get('LowerLimitCheckBox')
              ?.patchValue(this.Context.Payload['LowerLimitCheckBox']);
            this.enableFormElement(this.FORM_KEY_EXPERT_UPPER_LIMIT_CHECKBOX);
            this.form
              .get('UpperLimitCheckBox')
              ?.patchValue(this.Context.Payload['UpperLimitCheckBox']);

            this.logger(
              'DEBUG',
              `ChangeListener: ${this.FORM_KEY_EXPERT_LIMITS_UNIT}`
            );
            this.CalculateMHz$.next({
              cluster: this.CalculateMHz$.value.cluster,
              unit: this.Context.Payload['ExpertLimitsUnit'],
              lowerLimit: this.CalculateMHz$.value.lowerLimit,
              upperLimit: this.CalculateMHz$.value.upperLimit,
            });
            this.logger('selectedUnit: ', selectedUnit);
          } else {
            this.disableFormElement(this.FORM_KEY_EXPERT_LOWER_LIMIT_CHECKBOX);
            this.disableFormElement(this.FORM_KEY_EXPERT_UPPER_LIMIT_CHECKBOX);
            this.logger('DEBUG', 'empty result');
          }
        }
      },
      (error) => this.errorHandlingRxJS(error),
      () => {
        this.logger('DEBUG', `${this.FORM_KEY_EXPERT_LIMITS_UNIT}: COMPLETED`);
      }
    );

    this.subscribeUntilDestroyed(
      this.form.get(this.FORM_KEY_NAS_LAN_CHECK)?.valueChanges,
      (result) => {
        if (result == true) {
          this.form.get(this.FORM_KEY_NAS_LAN)?.enable();
          this.form.get(this.FORM_KEY_NAS_LAN)?.patchValue(this.naslanId);
        } else {
          this.form.get(this.FORM_KEY_NAS_LAN)?.patchValue('');
        }
      }
    );

    // Network Options CustomerLan change listener
    this.subscribeUntilDestroyed(
      combineLatest([
        this.form.get(this.FORM_KEY_CUSTOMER_LAN)?.valueChanges,
        this.CustomerLANs$,
      ]),

      ([selected, lans]) => {
        this.logger('DEBUG', `ChangeListener: ${this.FORM_KEY_CUSTOMER_LAN}`);

        if (selected && lans) {
          const lan = lans.find((l) => l.ID === selected);
          if (this.form.get('Customer')?.value && lan) {
            console.log(lan);
            this.dataService
              .getLANsForCustomerWithCustomerLANId(
                this.form.get('Customer')?.value,
                lan.ID
              )
              ?.pipe(takeUntil(this.destroy$))
              .subscribe((res) => {
                if (res.length > 0) {
                  let FK_NAS_NET = res[0]['FK_NAS_NET'];
                  let ipam = res[0]['IPAM'];

                  if (ipam == '0') {
                    this.form.get('CustomerLanIpam')?.patchValue(false);
                    this.form.get('CustomerSpecificIPv4')?.enable();
                  } else {
                    this.form.get('CustomerLanIpam')?.patchValue(true);
                    this.form.get('CustomerSpecificIPv4')?.patchValue('');
                    this.form.get('CustomerSpecificIPv4')?.enable();
                  }
                 

                  this.dataService
                    .getNASLAN(this.form.get('Customer')?.value, FK_NAS_NET)
                    ?.pipe(takeUntil(this.destroy$))
                    .subscribe((res) => {
                      console.log(res);

                      if (res.length > 0) {
                        this.NASLANs$.next(res);
                        this.NASLANs$.subscribe((res) => console.log(res));
                        this.naslanlabel = res[0].label;
                        this.naslanId = res[0].ID;
                        this.form.get('NASLAN')?.patchValue(this.naslanId);
                        this.form.get('NASLANCHECK')?.enable();
                      } else {
                        this.naslanlabel = 'No NAS LAN available';
                        this.form.get('NASLANCHECK')?.patchValue(false);
                        this.form.get('NASLANCHECK')?.disable();
                        this.form.get('NASLAN')?.patchValue('');
                      }
                    });
                } else {
                  return;
                }
              });
            // If DNS and or NTP information is missing then we need to display an information label to the users
            if (
              (lan.IPV4 && (!lan.IPV4_DNS || !lan.IPV4_NTP)) ||
              (lan.IPV6 && (!lan.IPV6_DNS || !lan.IPV6_NTP))
            ) {
              // TODO: SHOW information paragraph
              this.showCustomerLANInformation = true;
            } else {
              this.showCustomerLANInformation = false;
            }
            // this.handleIpCheckboxes(this.FORM_KEY_CUSTOMER_LAN, lan.RequestIpVersion, this.isCustomerLanIPVersionsSelectable$);
            // for now, only user IPv4 version, force IPv4 checkbox with hardcoded 4 value instead of lan.RequestIpVersion
            this.handleIpCheckboxes(
              this.FORM_KEY_CUSTOMER_LAN,
              4,
              this.isCustomerLanIPVersionsSelectable$
            );
          }
        } else {
          this.resetIpCheckboxes(
            this.FORM_KEY_CUSTOMER_LAN_IPV4,
            this.FORM_KEY_CUSTOMER_LAN_IPV6,
            this.isCustomerLanIPVersionsSelectable$
          );
          this.showCustomerLANInformation = false;
          this.disableFormElement(this.FORM_KEY_NAS_LAN_CHECK);
          this.form.get(this.FORM_KEY_NAS_LAN)?.patchValue('');
          this.naslanlabel = '';
        }
      }
    );

    // Network Options AdminLan change listener
    this.subscribeUntilDestroyed(
      combineLatest([
        this.form.get(this.FORM_KEY_ADMIN_LAN)?.valueChanges,
        this.AdminLANs$,
      ]),

      ([selected, lans]) => {
        this.logger('DEBUG', `ChangeListener: ${this.FORM_KEY_ADMIN_LAN}`);

        if (selected && lans) {
          const lan = lans.find((l) => l.ID === selected);
          if (lan) {
            // this.handleIpCheckboxes(this.FORM_KEY_ADMIN_LAN, lan.RequestIpVersion, this.isAdminLanIPVersionsSelectable$);
            // for now, only user IPv4 version, force IPv4 checkbox with hardcoded 4 value instead of lan.RequestIpVersion
            this.handleIpCheckboxes(
              this.FORM_KEY_ADMIN_LAN,
              4,
              this.isAdminLanIPVersionsSelectable$
            );
          }
        } else {
          this.resetIpCheckboxes(
            this.FORM_KEY_ADMIN_LAN_IPV4,
            this.FORM_KEY_ADMIN_LAN_IPV6,
            this.isAdminLanIPVersionsSelectable$
          );
        }
      }
    );

    // Network Options NASLAN change listener
    this.subscribeUntilDestroyed(
      combineLatest([
        this.form.get(this.FORM_KEY_NAS_LAN)?.valueChanges,
        this.NASLANs$,
      ]),

      ([selected, lans]) => {
        this.logger('DEBUG', `ChangeListener: ${this.FORM_KEY_NAS_LAN}`);

        if (selected && lans) {
          const lan = lans.find((l) => l.ID === selected);
          if (lan) {
            // this.handleIpCheckboxes(this.FORM_KEY_NAS_LAN, lan.RequestIpVersion, this.isNasLanIPVersionsSelectable$);
            // for now, only user IPv4 version, force IPv4 checkbox with hardcoded 4 value instead of lan.RequestIpVersion
            this.handleIpCheckboxes(
              this.FORM_KEY_NAS_LAN,
              4,
              this.isNasLanIPVersionsSelectable$
            );
          }
        } else {
          this.resetIpCheckboxes(
            this.FORM_KEY_NAS_LAN_IPV4,
            this.FORM_KEY_NAS_LAN_IPV6,
            this.isNasLanIPVersionsSelectable$
          );
        }
      }
    );
  }

  resetIpCheckboxes(
    ipv4CheckboxFormName: string,
    ipv6CheckboxFormName: string,
    isIPVersionsSelectableFormName$: BehaviorSubject<boolean>
  ) {
    this.form.get(ipv4CheckboxFormName)?.patchValue(false);
    this.form.get(ipv6CheckboxFormName)?.patchValue(false);
    isIPVersionsSelectableFormName$.next(false);
  }

  /**
   * Function to handle the clickable and ticked properties of IPv4 and IPv6 checkboxes
   *
   * @param {string} formControlName
   * @param {number} requestIpVersion - 0 | 4 | 6 | 10
   *                                    - 0: checkboxes are not clickable and neither IPv4 nor IPv6 is ticked
   *                                    - 4: checkboxes are not clickable and only IPv4 is ticked
   *                                    - 6: checkboxes are not clickable and only IPv6 is ticked
   *                                    - 10: checkboxes are clickable and both IPv4 and IPv6 can be selected
   * @param {BehaviorSubject<boolean>} clickableSwitcher
   * @memberof AppComponent
   */
  handleIpCheckboxes(
    formControlName: string,
    requestIpVersion: number,
    clickableSwitcher: BehaviorSubject<boolean>
  ) {
    switch (requestIpVersion) {
      case 0: {
        this.form.get(`${formControlName}_IPv4`)?.patchValue(false);
        this.form.get(`${formControlName}_IPv6`)?.patchValue(false);
        clickableSwitcher.next(false);
        break;
      }
      case 4: {
        this.form.get(`${formControlName}_IPv4`)?.patchValue(true);
        this.form.get(`${formControlName}_IPv6`)?.patchValue(false);
        clickableSwitcher.next(false);
        break;
      }
      case 6: {
        this.form.get(`${formControlName}_IPv4`)?.patchValue(false);
        this.form.get(`${formControlName}_IPv6`)?.patchValue(true);
        clickableSwitcher.next(false);
        break;
      }
      case 10: {
        this.form.get(`${formControlName}_IPv4`)?.patchValue(false);
        this.form.get(`${formControlName}_IPv6`)?.patchValue(false);
        clickableSwitcher.next(true);
        break;
      }
    }
  }

  /**
   * Function to check if the input subdomain list has UAN default subdomain
   *
   * @param subDomainList - Incoming subdomain list to be tested
   * @return true if incoming subdomain contains the UAN default subdomain
   */
  subdomainListContainsDefaultSubdomain(subdomainList: string[]): boolean {
    subdomainList.forEach((subdomain) => {
      if (this.defaultSubDomain.test(subdomain)) {
        return true;
      }
    });
    return false;
  }

  /**
   * General RxJs method for handling all subscriptions equal.
   */
  subscribeUntilDestroyed<T>(
    observable: Observable<T>,
    next?: (value: T) => void,
    error?: (error: any) => void,
    complete?: () => void
  ): void {
    observable.pipe(takeUntil(this.destroy$)).subscribe(next, error, complete);
  }

  errorHandlingRxJS(error: any): void {
    console.error('HTTP Error', error);
    this.xaNotifyService.error(error);
  }

  /**
   * General RxJs method for handling all subscriptions equal.
   */
  subscribeUntilDestroyedWithSwitchMap<T>(
    observable: Observable<T>,
    callback?: (value: T, index: number) => ObservableInput<T>,
    next?: (value: T) => void,
    error?: (error: any) => void,
    complete?: () => void
  ): void {
    observable
      .pipe(takeUntil(this.destroy$), switchMap(callback))
      .subscribe(next, error, complete);
  }

  // Function to add new storage to the vmdks array
  addStorage() {
    const nextFreeDriveLetter = this.getNextFreeLetter();
    if (this.vmdks.length < 3) {
      // C storage drive always should be 100 GB
      if (nextFreeDriveLetter === 'C') {
        this.vmdks.push(
          this.createDrive({
            size: 100,
            mandatory: true,
            name: nextFreeDriveLetter,
          })
        );
      } else {
        this.vmdks.push(
          this.createDrive({
            size: 10,
            mandatory: false,
            name: nextFreeDriveLetter,
          })
        );
      }
    }
  }

  // TODO https://redmine.int.neonet.at/issues/1398
  createDrive(vmdkStorage: VMDKStorage): FormGroup {
    return this.fb.group({
      size: [
        vmdkStorage.size || 0,
        this.getValidationConfigElement('VMDKSize'),
      ],
      mandatory: [
        vmdkStorage.mandatory || false,
        this.getValidationConfigElement('VMDKMandatory'),
      ],
      name: [
        vmdkStorage.name || '',
        this.getValidationConfigElement('VMDKName'),
      ],
    });
  }

  getDependendObjectsByElement(formElement: string, dependendValue: string) {
    return this.validationService.validatorConfigList.get(formElement)
      ?.dependencies[dependendValue];
  }

  getElementFromDependendObjectsByElement(
    formElement: string,
    dependendValue: string,
    varName: string
  ): ValidatorConfig {
    return this.validationService.validatorConfigList
      .get(formElement)
      ?.dependencies[dependendValue].filter(
        (element: ValidatorConfig) => element.varName === varName
      )[0];
  }

  getFieldsValidatorsFromValidatorArray(
    validatorArray: ValidatorConfig,
    fieldElement: string
  ): ValidatorConfig {
    return validatorArray
      ? validatorArray.fields.filter(
          (element: ValidatorConfig) => element.varName === fieldElement
        )[0]
      : null;
  }

  getValidationConfigElement(formElement: string): ValidatorConfig {
    return this.validationService.validatorConfigList.get(formElement) || null;
  }

  // Function to remove the specific storage from the vmdks array
  removeStorage(index: number) {
    this.vmdks.removeAt(index);
  }

  getNextFreeLetter() {
    return this.getFreeLetters()?.filter((l) => l !== 'A' && l !== 'B')[0];
  }

  getFreeLetters() {
    const codes = (this.vmdks.value as unknown as VMDKStorage[])?.map((v) =>
      v.name.charCodeAt(0)
    );
    const freeLetters = [];
    for (let i = 65; i <= 90; i++) {
      if (codes.findIndex((c) => c === i) === -1) {
        freeLetters.push(i);
      }
    }
    return freeLetters.map((l) => String.fromCharCode(l));
  }

  submit() {
    if (!this.form.valid) {
      console.error('Form is not valid', this.form);
      this.xaNotifyService.error('Form is not valid! ' + this.form);
    }

    return {
      value: this.form.getRawValue(),
      identifier: `${this.form.get(this.FORM_KEY_HOSTNAME)?.value}`,
    };
  }

  feedback(): FeedbackRequestPayload {
    return this.form.value;
  }
}
