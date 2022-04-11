import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { FeedbackRequestPayload, ICERequest, ICERequestContext } from '@xa/lib-ui-common';
import { XANotifyService } from '@xa/ui';
import { ValidationService } from '@xa/validation';
import { AgGridColumn } from 'ag-grid-angular';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CmdbModel } from './model/cmdb.model';
import { HostModel } from './model/host.model';
import { HostsModel } from './model/hosts.model';
import { NASVolumeModel } from './model/nas-volume.model';
import { NASVolumesModel } from './model/nas-volumes.model';
import { NetworkZoneModel } from './model/network-zone.model';
import { SAPServiceModel } from './model/sap-service.model';
import { SAPServicesModel } from './model/sap-services.model';
import { DataService } from './service/data.service';

@Component({
  selector: "sap-startup-request-form",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements ICERequest, OnInit, OnDestroy {
  // form keys for Basic Settings
  readonly FORM_KEY_SAP_CUSTOMER = "SAPCustomer";
  readonly FORM_KEY_SAP_CUSTOMER_SHORTNAME = "SAPCustomerShortname";
  readonly FORM_KEY_SAP_OPERATING_SYSTEM = "SAPOperatingSystem";
  readonly FORM_KEY_SAP_DATABASE_TYPE = "SAPDatabaseType";

  // form keys for General
  readonly FORM_KEY_USE_SLA = "UseSLA";
  readonly FORM_KEY_SLA = "SLA";
  readonly FORM_KEY_WBS = "WBS";
  readonly FORM_KEY_BESTSHORE = "Bestshore";
  readonly FORM_KEY_DOMAIN_CUSTOMER_LAN = "DomainCustomerLan";
  readonly FORM_KEY_COMMENT_CMDB = "CommentCMDB";
  readonly FORM_KEY_DOMAIN_UAN = "DomainUAN";
  readonly FORM_KEY_ENVIRONMENT = "Environment";
  readonly FORM_KEY_CRITICALITY = "Criticality";
  readonly FORM_KEY_ASSIGNMENT_GROUP = "AssignmentGroup";
  readonly FORM_KEY_SERVICE_TIME = "ServiceTime";
  readonly FORM_KEY_ATTENDED_OPERATION_TIME = "AttendedOperationTime";
  readonly FORM_KEY_HOST_ASSIGNMENT_GROUP = "HostAssignmentGroup";
  readonly FORM_KEY_HOST_SERVICE_TIME = "HostServiceTime";

  // form keys for SAP
  readonly FORM_KEY_SAP_SYSTEM_TYPE = "SAPSystemType";
  readonly FORM_KEY_SID = "SID";
  readonly FORM_KEY_SAP_INSTANCE_NR = "SAPInstanceNr";
  readonly FORM_KEY_SAP_CLIENTS = "SAPClients";
  readonly FORM_KEY_SAP_CENTRAL_SERVICES_INSTANCE_NR =
    "SAPCentralServicesInstanceNr";
  readonly FORM_KEY_HANA_SID = "HANA_SID";
  readonly FORM_KEY_HANA_INSTANCE_NR = "HANAInstanceNr";
  readonly FORM_KEY_HANA_MEMORY_SIZE = "HANAMemorySize";
  readonly FORM_KEY_DB_SIZE_GB = "DBSizeGB";

  // form keys for Infrastructure
  readonly FORM_KEY_DATA_CENTER = "DataCenter";
  readonly FORM_KEY_DR_LEVEL = "DRLevel";
  readonly FORM_KEY_V_CENTER = "VCenter";
  readonly FORM_KEY_DSI_BLOCK = "DSIBlock";
  readonly FORM_KEY_SAP_NETWORK_ZONE = "SAPNetworkZone";
  readonly FORM_KEY_CUSTOMER_LAN = "CustomerLAN";
  readonly FORM_KEY_NAS_LAN = "NAS_LAN";
  readonly FORM_KEY_SHARED_NAS_IP = "SharedNASIP";
  readonly FORM_KEY_CHOOSE_DSI_BLOCK_MANUALLY = "ChooseDSIBlockManually";
  readonly FORM_KEY_CUSTOMER_SPECIFIC_IPS = "CustomerSpecificIPs";

  // form keys for Operating System
  readonly FORM_KEY_VERSION = "Version";
  readonly FORM_KEY_HOSTNAME = "Hostname";
  readonly FORM_KEY_DOMAIN = "Domain";
  readonly FORM_KEY_LICENSE_TYPE = "LicenseType";
  readonly FORM_KEY_LICENSE_VALUE = "LicenseValue";
  readonly FORM_KEY_TIMEZONE = "Timezone";
  readonly FORM_KEY_PATCH_MODE = "PatchMode";
  readonly FORM_KEY_PATCH_TIME = "PatchTime";

  // form keys for VM Settings
  readonly FORM_KEY_PAY_PER_USE = "PayPerUse";
  readonly FORM_KEY_VRAM = "VRAM";
  readonly FORM_KEY_VCPU = "VCPU";
  readonly FORM_KEY_LIMITS_UNIT = "LimitsUnit";
  readonly FORM_KEY_LOWER_LIMIT = "LowerLimit";
  readonly FORM_KEY_UPPER_LIMIT = "UpperLimit";

  // form keys for Generated Lists
  readonly FORM_KEY_SAP_SERVICES = "SAPServices";
  readonly FORM_KEY_NAS_VOLUMES = "NASVolumes";
  readonly FORM_KEY_HOSTS = "Hosts";

  @Input() Context: ICERequestContext;

  form: FormGroup;
  destroy$ = new Subject();
  identifier: string = null;

  processDescriptionLink: string;
  platformTypeForVCenters: string;

  // Basic Settings data
  sapCustomerAbbreviations = {}; // JSON which caches the abbreviation of selected customers, such that the data must only be fetched once per customer
  sapCustomers$ = new BehaviorSubject<Array<string>>(null);
  sapDBTypes$ = new BehaviorSubject<Array<string>>(null);
  isLoadingSapDBTypes$ = new BehaviorSubject<boolean>(false);

  // General, SLA data
  slas$ = new BehaviorSubject<Array<CmdbModel>>(null);
  environments$ = new BehaviorSubject<Array<string>>(null);
  criticality$ = new BehaviorSubject<Array<string>>(null);
  serviceTimes$ = new BehaviorSubject<Array<string>>(null);
  attendedOperationTimes$ = new BehaviorSubject<Array<string>>(null);
  hostServiceTimes$ = new BehaviorSubject<Array<string>>(null);
  isLoadingWBS$ = new BehaviorSubject<boolean>(false);
  isLoadingBestshore$ = new BehaviorSubject<boolean>(false);
  isLoadingDomainCustomerLAN$ = new BehaviorSubject<boolean>(false);
  isLoadingDomainUAN$ = new BehaviorSubject<boolean>(false);
  isLoadingSLAs$ = new BehaviorSubject<boolean>(false);
  isLoadingServiceTimes$ = new BehaviorSubject<boolean>(false);
  isLoadingAttendedOperationTimes$ = new BehaviorSubject<boolean>(false);
  isLoadingHostServiceTimes$ = new BehaviorSubject<boolean>(false);
  isLoadingServiceTime$ = new BehaviorSubject<boolean>(false);
  isLoadingAttendedOperationTime$ = new BehaviorSubject<boolean>(false);

  // SAP data
  sapClients = new BehaviorSubject<Array<string>>([]);
  sapInstanceNrFormattedAfter0Add = false;
  sapCentralServicesInstanceNrFormattedAfter0Add = false;
  sapHANAInstanceNrFormattedAfter0Add = false;

  // Infrastructure data
  vCenters$ = new BehaviorSubject<Array<string>>(null);
  dsiBlocks$ = new BehaviorSubject<Array<string>>(null);
  sapNetworkZones$ = new BehaviorSubject<Array<NetworkZoneModel>>(null);
  isLoadingDRLevel$ = new BehaviorSubject<boolean>(false);
  isLoadingDSIBlocks$ = new BehaviorSubject<boolean>(false);
  isLoadingDefaultDSIBlock$ = new BehaviorSubject<boolean>(false);
  isLoadingNetworkZoneDescriptions$ = new BehaviorSubject<boolean>(false);

  // Operating System data
  versions$ = new BehaviorSubject<Array<string>>(null);
  timezones$ = new BehaviorSubject<Array<string>>(null);
  patchModes$ = new BehaviorSubject<Array<CmdbModel>>(null);
  patchTimes$ = new BehaviorSubject<Array<CmdbModel>>(null);

  // VM Settings data
  cpuRangeOptions: any;
  memoryRangeOptionsNonHana: any;
  memoryRangeOptionsHana: any;

  // Generated Lists data
  sapServices$ = new BehaviorSubject<Array<SAPServiceModel>>(null);
  nasVolumes$ = new BehaviorSubject<Array<NASVolumeModel>>(null);
  hosts$ = new BehaviorSubject<Array<HostModel>>(null);
  isLoadingSAPServices$ = new BehaviorSubject<boolean>(false);
  isLoadingNASVolumes$ = new BehaviorSubject<boolean>(false);
  isLoadingHosts$ = new BehaviorSubject<boolean>(false);
  columnDefsSAPService: Array<AgGridColumn>;
  columnDefsNASVolumes: Array<AgGridColumn>;
  columnDefsHosts: Array<AgGridColumn>;

  constructor(
    private fb: FormBuilder,
    private cref: ChangeDetectorRef,
    public dataService: DataService,
    private validationService: ValidationService,
    private xaNotifyService: XANotifyService
  ) {}

  /**
   * overall methods
   */
  ngOnInit() {
    this.buildForm();

    if (this.Context.Validation.requestForm) {
      this.validationService.setValidatorsFromConfig(
        this.form,
        this.Context.Validation.requestForm,
        false
      );
    }

    // initialise non dependent stuff and submit to value changes of the form fields
    this.initialiseRequestForm();
    this.submitToFieldChanges();

    // define time, how long toasts should stay, if set
    const customToastTimeout = this.Context.ConfigPayload.toast.timeout;
    if (customToastTimeout) {
      this.xaNotifyService.config.toast.timeout = customToastTimeout;
    }

    // subscribe to status changes of the form until the Request Form is destroyed
    this.form.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        if (this.form.get(this.FORM_KEY_DSI_BLOCK).errors) {
          status = "INVALID";
        }
        this.Context.Valid = status;
      });

    // set Submit and Feedback behavior
    this.Context.OnSubmit(() => this.submitForm());
    this.Context.OnFeedback(() => this.feedback());

    // set values of form fields, which are provided in the payload
    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload, {
        emitEvent: true,
        onlySelf: false,
      });

    }
  }

  /**
   * Set {@link destroy$} if the component is destroyed.
   */
  ngOnDestroy() {
    this.destroy$.next();
  }

  /**
   * Submits the {@link FORM_KEY_HOSTNAME} as identifier and the raw value of the form as value.
   */
  public submitForm() {
    if (this.form.valid) {
      console.debug("Form is valid:", this.form.value);
    } else {
      console.error("Form is not valid", this.form);
    }

    const formRawValue = this.form.getRawValue();

    // convert SAPClients string to array
    formRawValue.SAPClients = this.transformSAPClientsToArray();

    // set the raw value of the form as value
    // (this is needed because if the VRAM slider is disabled (-> readonly), its value would not be submitted)
    // and sets the selected hostname as identifier
    return {
      value: formRawValue,
      identifier: this.form.get(this.FORM_KEY_HOSTNAME).value,
    };
  }

  /**
   * Gets the raw value (incl. disabled values due to {@link FORM_KEY_VRAM} field) for feedback.
   */
  feedback(): FeedbackRequestPayload {
    return this.form.getRawValue();
  }

  /**
   * Checks if a form element (e.g. checkbox group) is required
   */
  isFormElementRequired(elementName: string) {
    return this.validationService.validatorConfigList.get(elementName)
      ? this.validationService.validatorConfigList.get(elementName).required ||
          this.validationService.validatorConfigList.get(elementName)
            .requiredTrue
      : false;
  }

  /**
   * Defines the fields of the form.
   */
  private buildForm() {
    this.form = this.fb.group({
      // field for identifying SAP Use Case (will not be further used in the frontend, but in the BPMN)
      UseCaseType: [""],

      // Basic Settings form elements
      Customer: [""],
      SAPCustomer: [""],
      SAPCustomerShortname: [""],
      SAPOperatingSystem: [""],
      SAPDatabaseType: [""],

      // General, SLA form elements
      UseSLA: [""],
      SLA: [{ value: "", disabled: true }],
      WBS: [""],
      Bestshore: [""],
      DomainCustomerLan: [""],
      CommentCMDB: [""],
      DomainUAN: [""],
      Environment: [""],
      Criticality: [""],
      AssignmentGroup: [""],
      ServiceTime: [""],
      AttendedOperationTime: [""],
      HostAssignmentGroup: [""],
      HostServiceTime: [""],

      // SAP form elements
      SAPSystemType: [""],
      SID: [""],
      SAPInstanceNr: [""],
      SAPClients: [""],

      SAPCentralServicesInstanceNr: [""],
      HANA_SID: [""],
      HANAInstanceNr: [""],
      HANAMemorySize: [""],
      DBSizeGB: [""],

      // Infrastructure form elements
      DataCenter: [""],
      DRLevel: [""],
      VCenter: [""],
      DSIBlock: [{ value: "", disabled: true }],
      SAPNetworkZone: [""],
      CustomerLAN: [{ value: "", disabled: true }],
      NAS_LAN: [{ value: "", disabled: true }],
      SharedNASIP: [{ value: "", disabled: true }],
      ChooseDSIBlockManually: [false],
      CustomerSpecificIPs: [""],

      // Operating System form elements
      Version: [""],
      Hostname: [{ value: "", disabled: true }],
      Domain: [""],
      LicenseType: [""],
      LicenseValue: [""],
      Timezone: [""],
      PatchMode: [""],
      PatchTime: [""],

      // VM Settings form elements
      PayPerUse: [""],
      VRAM: [""],
      VCPU: [""],
      LimitsUnit: [{ value: "", disabled: true }],
      LowerLimit: [{ value: "", disabled: false }],
      UpperLimit: [""],

      // Generated Lists form elements
      SAPServices: [""],
      NASVolumes: [""],
      Hosts: [""],
    });
  }

  /**
   * Initialises selection lists and other stuff which can be loaded at Request Form startup.
   */
  private initialiseRequestForm(): void {
    this.processDescriptionLink =
      this.Context.ConfigPayload.processDescriptionLink;
    this.platformTypeForVCenters =
      this.Context.ConfigPayload.platformTypeForVCenters;

    // get column definitions for Generated Lists
    this.columnDefsSAPService = this.getSAPServiceColumnDefs();
    this.columnDefsNASVolumes = this.getNASVolumeColumnDefs();
    this.columnDefsHosts = this.getHostsColumnDefs();

    // get data for Basic Settings form elements
    this.setSAPCustomers();
    this.setSupportedDBTypes();

    // get data for General, SLA form elements
    this.setCriticality();
    this.setEnvironments();
    if (this.Context.Payload && this.Context.Payload["ServiceTime"]) {
      this.form
        .get(this.FORM_KEY_SERVICE_TIME)
        .patchValue(this.Context.Payload["ServiceTime"]);
    } else {
      this.setServiceTimes();
    }

    if (this.Context.Payload && this.Context.Payload["AttendedOperationTime"]) {
      this.form
        .get(this.FORM_KEY_ATTENDED_OPERATION_TIME)
        .patchValue(this.Context.Payload["AttendedOperationTime"]);
    } else {
      this.setAttendedOperationTimes();
    }

    if (this.Context.Payload && this.Context.Payload["HostServiceTime"]) {
      this.form
        .get(this.FORM_KEY_HOST_SERVICE_TIME)
        .patchValue(this.Context.Payload["HostServiceTime"]);
    } else {
      this.setHostServiceTimes();
    }

    // get data for Infrastructure
    this.setVCenters();
    this.setDSIBlocks();

    // get data for Operating System
    if (this.Context.Payload && this.Context.Payload["PatchMode"]) {
      this.setPatchModes();
      this.form
        .get(this.FORM_KEY_PATCH_MODE)
        .patchValue(this.Context.Payload["PatchMode"]);
    } else {
      this.setPatchModes();
    }

    if (this.Context.Payload && this.Context.Payload["PatchTime"]) {
      this.setPatchTimes();
      this.form
        .get(this.FORM_KEY_PATCH_TIME)
        .patchValue(this.Context.Payload["PatchTime"]);
    } else {
      this.setPatchTimes();
    }

    this.setTimezones();

    // get data for VM Settings form elements
    this.cpuRangeOptions = this.getCPURangeOptions();
    this.memoryRangeOptionsNonHana = this.getMemoryRangeOptionsNonHana();
    this.memoryRangeOptionsHana = this.getMemoryRangeOptionsHana();

    if (this.form.get(this.FORM_KEY_PAY_PER_USE).value) {
      this.form.get(this.FORM_KEY_LOWER_LIMIT).enable();
    }
  }

  /**
   * Splits the value of {@link FORM_KEY_SAP_CLIENTS} at ",", puts the values into an array (no duplicates) and
   * sets the created array as new value of {@link FORM_KEY_SAP_CLIENTS}.
   */
  private transformSAPClientsToArray(): Array<string> {
    if (typeof this.form.get(this.FORM_KEY_SAP_CLIENTS).value === "string") {
      const sapClientsString: string = this.form.get(
        this.FORM_KEY_SAP_CLIENTS
      ).value;
      const sapClients = new Array<string>();

      sapClientsString.split(",").forEach((sapClient) => {
        sapClient = sapClient.trim();
        if (sapClient && !sapClients.includes(sapClient)) {
          sapClients.push(sapClient);
        }
      });

      return sapClients;
    }
  }

  /**
   * Define behaviour of form elements when their data is changed.
   */
  private submitToFieldChanges() {
    this.submitToFieldChangesBasicSettings();

    this.submitToFieldChangesGeneral();
    this.submitToFieldChangesSAP();
    this.submitToFieldChangesInfrastructure();
    this.submitToFieldChangesVMSettings();

    this.submitToFieldChangesToResetGeneratedLists(
      this.FORM_KEY_SID,
      this.FORM_KEY_SAP_SYSTEM_TYPE,
      this.FORM_KEY_SAP_INSTANCE_NR,
      this.FORM_KEY_SAP_CENTRAL_SERVICES_INSTANCE_NR,
      this.FORM_KEY_HANA_SID,
      this.FORM_KEY_DB_SIZE_GB,
      this.FORM_KEY_SAP_DATABASE_TYPE,
      this.FORM_KEY_HANA_INSTANCE_NR,
      this.FORM_KEY_SAP_CUSTOMER,
      this.FORM_KEY_NAS_LAN
    );

    this.form.get(this.FORM_KEY_HOSTS).valueChanges.subscribe((hosts) => {
      if (hosts && hosts.length === 1) {
        this.form.get(this.FORM_KEY_HOSTNAME).setValue(hosts[0].hostname);
      }
    });

    this.form.get(this.FORM_KEY_HOSTNAME).valueChanges.subscribe((hostname) => {
      if (hostname) {
        this.setSAPServices();
      }
    });
  }

  /**
   * Subscribes to value changes of the forms {@link FORM_KEY_SAP_CUSTOMER}, {@link FORM_KEY_SAP_OPERATING_SYSTEM}
   * and {@link FORM_KEY_SAP_DATABASE_TYPE}.
   */
  private submitToFieldChangesBasicSettings(): void {
    // set SAP Customer dependencies
    this.form.get(this.FORM_KEY_SAP_CUSTOMER).valueChanges.subscribe(() => {
      // reset values of CustomerLAN, NAS_LAN and SharedNASIP
      if (!this.Context.Payload) {
        this.form.get(this.FORM_KEY_CUSTOMER_LAN).setValue("");
        this.form.get(this.FORM_KEY_NAS_LAN).setValue("");
        this.form.get(this.FORM_KEY_SHARED_NAS_IP).setValue("");
        this.form
          .get("Customer")
          .patchValue(this.form.get(this.FORM_KEY_SAP_CUSTOMER).value);
        // sets the abbreviation of the customer stored in the CMDB in sapCustomerAbbreviations

        this.setCustomerAbbreviation();

        // set the following defaults from CatDB and CMDB for a specific customer:
        // WBS, Bestshore, Domain Customer LAN, Domain UAN, DR Level, Service Time, Attended Operation Time and Network Zones

        this.setDefaultServiceTime();
        this.setDefaultAttendedOperationTime();
        this.setDefaultHostServiceTime();
        this.setDefaultWBS();
        this.setDefaultBestshore();
        this.setDefaultDomainCustomerLan();
        this.setDefaultDomainUAN();
        this.setDefaultDRLevel();
        this.setNetworkZones();
        this.setCustomerSLAs();
      }
      this.form
        .get("Customer")
        .patchValue(this.form.get(this.FORM_KEY_SAP_CUSTOMER).value);
      this.setCustomerAbbreviation();
      this.setDefaultWBS();
      this.setDefaultBestshore();
      this.setDefaultDomainCustomerLan();
      this.setDefaultDomainUAN();
      this.setDefaultDRLevel();
      this.setNetworkZones();
      this.setCustomerSLAs();

      this.submitToFieldChangesToResetGeneratedLists(
        this.FORM_KEY_SAP_CUSTOMER
      );
    });

    // set OS dependencies
    this.form
      .get(this.FORM_KEY_SAP_OPERATING_SYSTEM)
      .valueChanges.subscribe((os) => {
        // sets the following defaults dependent of the selected OS:
        // DB Types which are supported, available Service Times and Attended Operation Times,
        // List of available Versions of selected DBType available in the OS
        this.setSupportedDBTypes();
        this.setServiceTimes();
        this.setAttendedOperationTimes();
        this.setHostServiceTimes();
        this.setVersions();

        // if the selected os type is windows
        if (os === "windows") {
          // enable the form fields LicenseType and LicenseValue
          // and set the default value of the form field LicenseType
          this.form.get(this.FORM_KEY_LICENSE_TYPE).enable();
          this.form.get(this.FORM_KEY_LICENSE_TYPE).setValue("SPLA");
          this.form.get(this.FORM_KEY_LICENSE_VALUE).enable();
          if (this.Context.Payload && this.Context.Payload["LicenseType"]) {
            this.form
              .get(this.FORM_KEY_LICENSE_TYPE)
              .patchValue(this.Context.Payload["LicenseType"]);
          }

          // enable and reset form field Domain
          this.form.get(this.FORM_KEY_DOMAIN).enable();
          this.form.get(this.FORM_KEY_DOMAIN).setValue("");
          if (this.Context.Payload && this.Context.Payload["Domain"]) {
            this.form
              .get(this.FORM_KEY_DOMAIN)
              .patchValue(this.Context.Payload["Domain"]);
          }
        } else {
          // the selected os type is linux
          // disable and reset the form fields LicenseType and LicenseValue
          this.form.get(this.FORM_KEY_LICENSE_TYPE).disable();
          this.form.get(this.FORM_KEY_LICENSE_TYPE).setValue("");
          this.form.get(this.FORM_KEY_LICENSE_VALUE).disable();
          this.form.get(this.FORM_KEY_LICENSE_VALUE).setValue("");

          // disable and set form field Domain equal to form field DomainUAN
          this.form.get(this.FORM_KEY_DOMAIN).disable();
          this.form.get(this.FORM_KEY_DOMAIN).setValue("");
        }
      });

    // sets DB dependencies
    this.form
      .get(this.FORM_KEY_SAP_DATABASE_TYPE)
      .valueChanges.subscribe(() => {
        this.setDSIBlocks();

        // set dependencies, if the selected DB Type is 'hana'
        if (this.isDBTypeHana()) {
          // enable all HANA specific fields (will be shown in HTML)
          this.form.get(this.FORM_KEY_HANA_SID).enable();
          this.form.get(this.FORM_KEY_HANA_INSTANCE_NR).enable();
          if (this.Context.Payload && this.Context.Payload.HANAInstanceNr) {
            this.form
              .get(this.FORM_KEY_HANA_INSTANCE_NR)
              .setValue(this.Context.Payload.HANAInstanceNr);
          }
          this.form.get(this.FORM_KEY_HANA_MEMORY_SIZE).enable();

          // set DB Size equal to HANA Memory Size (field for DB Size set to readonly in HTML)
          this.form
            .get(this.FORM_KEY_DB_SIZE_GB)
            .setValue(this.form.get(this.FORM_KEY_HANA_MEMORY_SIZE).value);

          // disable and reset VCPU (will be hidden in HTML)
          this.form.get(this.FORM_KEY_VCPU).setValue("");
          this.form.get(this.FORM_KEY_VCPU).disable();

          // disable PayPerUse and set to false
          this.form.get(this.FORM_KEY_PAY_PER_USE).setValue(false);
          this.form.get(this.FORM_KEY_PAY_PER_USE).disable();

          // set RAM value according to DB Size
          this.form
            .get(this.FORM_KEY_VRAM)
            .setValue(
              this.calculateHanaRAM(
                this.form.get(this.FORM_KEY_DB_SIZE_GB).value
              )
            );

          // disables and resets the lower and upper limit of SAPs (will be hidden in HTML)
          this.form.get(this.FORM_KEY_LOWER_LIMIT).disable();
          this.form.get(this.FORM_KEY_LOWER_LIMIT).setValue("");
          this.form.get(this.FORM_KEY_UPPER_LIMIT).disable();
          this.form.get(this.FORM_KEY_UPPER_LIMIT).setValue("");

          // disables DB size in GB form field
          this.form.get(this.FORM_KEY_DB_SIZE_GB).disable();

          // set DRLevel to default
          this.form.get(this.FORM_KEY_DR_LEVEL).setValue("default");
        } else {
          // set dependencies, if selected DB Type is not 'hana'
          // disable and reset HANA specific fields (will be hidden in HTML)
          this.form.get(this.FORM_KEY_HANA_SID).disable();
          this.form.get(this.FORM_KEY_HANA_INSTANCE_NR).disable();
          this.form.get(this.FORM_KEY_HANA_MEMORY_SIZE).disable();
          this.form.get(this.FORM_KEY_HANA_SID).setValue("");
          this.form.get(this.FORM_KEY_HANA_INSTANCE_NR).setValue("");
          this.form.get(this.FORM_KEY_HANA_MEMORY_SIZE).setValue("");

          // enables the selection of VCPU number (will be shown in HTML)
          this.form
            .get(this.FORM_KEY_VCPU)
            .setValue(this.getCPURangeOptions().range.min);
          this.form.get(this.FORM_KEY_VCPU).enable();

          if (this.Context.Payload && this.Context.Payload["VCPU"]) {
            this.form.get(this.FORM_KEY_VCPU).enable();
            this.form
              .get(this.FORM_KEY_VCPU)
              .patchValue(this.Context.Payload["VCPU"]);
          }

          // enable PayPerUse and set default value
          this.form.get(this.FORM_KEY_PAY_PER_USE).enable();
          if (this.Context.Payload && this.Context.Payload["PayPerUse"]) {
            this.form
              .get(this.FORM_KEY_PAY_PER_USE)
              .setValue(this.Context.Payload.PayPerUse);
          }

          // set min value of non hana range options
          if (!this.Context.Payload) {
            this.form
              .get(this.FORM_KEY_VRAM)
              .setValue(this.getMemoryRangeOptionsNonHana().range.min);
          }

          // enables the lower and upper limit (will be shown in HTML)
          if (this.Context.Payload && this.Context.Payload.PayPerUse) {
            this.form.get(this.FORM_KEY_LOWER_LIMIT).enable();
          } else {
            this.form.get(this.FORM_KEY_LOWER_LIMIT).disable();
          }

          this.form.get(this.FORM_KEY_UPPER_LIMIT).enable();

          if (this.Context.Payload && this.Context.Payload["DBSizeGB"]) {
            this.form.get(this.FORM_KEY_DB_SIZE_GB).enable();
            this.form
              .get(this.FORM_KEY_DB_SIZE_GB)
              .patchValue(this.Context.Payload["DBSizeGB"]);
          }

          // enables DB size in GB form field
          this.form.get(this.FORM_KEY_DB_SIZE_GB).enable();

          // set the default DR Level (request is only performed if DB is not hana (if hana -> always "default")
          if (!this.Context.Payload) {
            this.setDefaultDRLevel();
          }

          if (!this.Context.Payload) {
            this.submitToFieldChangesToResetGeneratedLists(
              this.FORM_KEY_SAP_DATABASE_TYPE
            );
          }
        }

        // set the default DSI Block
        // this.setDefaultDSIBlock();

        // set available DBType Versions
        this.setVersions();
      });
  }

  /**
   * Subscribes to value changes of the forms {@link FORM_KEY_BESTSHORE}, {@link FORM_KEY_ENVIRONMENT}
   * {@link FORM_KEY_USE_SLA} {@link FORM_KEY_DOMAIN_UAN}.
   */
  private submitToFieldChangesGeneral(): void {
    // set Bestshore dependencies
    this.form.get(this.FORM_KEY_BESTSHORE).valueChanges.subscribe(() => {
      if (this.Context.Payload && this.Context.Payload["ServiceTime"]) {
        this.form
          .get(this.FORM_KEY_SERVICE_TIME)
          .patchValue(this.Context.Payload["ServiceTime"]);
        this.Context.Payload["ServiceTime"] == "";
      } else {
        this.setServiceTimes();
      }
      if (
        this.Context.Payload &&
        this.Context.Payload["AttendedOperationTime"]
      ) {
        this.form
          .get(this.FORM_KEY_ATTENDED_OPERATION_TIME)
          .patchValue(this.Context.Payload["AttendedOperationTime"]);
        this.Context.Payload["AttendedOperationTime"] == "";
      } else {
        this.setAttendedOperationTimes();
      }
    });

    // set Environment dependencies
    this.form.get(this.FORM_KEY_ENVIRONMENT).valueChanges.subscribe(() => {
      if (this.Context.Payload && this.Context.Payload["ServiceTime"]) {
        this.form
          .get(this.FORM_KEY_SERVICE_TIME)
          .patchValue(this.Context.Payload["ServiceTime"]);
      } else {
        this.setDefaultServiceTime();
      }

      if (
        this.Context.Payload &&
        this.Context.Payload["AttendedOperationTime"]
      ) {
        this.form
          .get(this.FORM_KEY_ATTENDED_OPERATION_TIME)
          .patchValue(this.Context.Payload["AttendedOperationTime"]);
      } else {
        this.setDefaultAttendedOperationTime();
      }

      if (this.Context.Payload && this.Context.Payload["HostServiceTime"]) {
        this.form
          .get(this.FORM_KEY_HOST_SERVICE_TIME)
          .patchValue(this.Context.Payload["HostServiceTime"]);
      } else {
        this.setDefaultHostServiceTime();
      }
      this.setDSIBlocks();
      this.setDefaultDRLevel();
    });

    // set Use SLA dependencies
    this.form
      .get(this.FORM_KEY_USE_SLA)
      .valueChanges.subscribe((useSla: boolean) => {
        if (useSla) {
          // enable SLA selection (will be shown in HTML) and set usable SLAs according to selected customer
          this.form.get(this.FORM_KEY_SLA).enable();
          this.setCustomerSLAs();
        } else {
          // disable and reset SLA selection (will be hidden in HTML)
          this.form.get(this.FORM_KEY_SLA).setValue("");
          this.form.get(this.FORM_KEY_SLA).disable();
        }
      });

    // set Environment dependencies
    this.form.get(this.FORM_KEY_DOMAIN_UAN).valueChanges.subscribe(() => {
      this.setLinuxDomain();
    });
  }

  /**
   * Subscribes to value changes of the forms {@link FORM_KEY_SAP_SYSTEM_TYPE}, {@link FORM_KEY_DB_SIZE_GB}
   * and {@link FORM_KEY_HANA_MEMORY_SIZE}.
   */
  private submitToFieldChangesSAP(): void {
    // set SAP System Type dependencies
    this.form
      .get(this.FORM_KEY_SAP_SYSTEM_TYPE)
      .valueChanges.subscribe((systemType) => {
        // if the selected system type is Java, disable and reset the SAP Clients
        if (systemType === "Java") {
          this.form.get(this.FORM_KEY_SAP_CLIENTS).disable();
          this.form.get(this.FORM_KEY_SAP_CLIENTS).setValue("");
        } else {
          // otherwise set
          this.form.get(this.FORM_KEY_SAP_CLIENTS).enable();
          this.form
            .get(this.FORM_KEY_SAP_CLIENTS)
            .setValue(this.Context.Payload.SAPClients);
        }

        if (!this.Context.Payload) {
          this.submitToFieldChangesToResetGeneratedLists(
            this.FORM_KEY_SAP_SYSTEM_TYPE
          );
        }
      });

    // set DB Size dependencies
    this.form
      .get(this.FORM_KEY_DB_SIZE_GB)
      .valueChanges.subscribe((dbSizeInGB) => {
        // if DB Type equals hana, set VRAM equals to DB Size + 64
        if (this.isDBTypeHana()) {
          this.form
            .get(this.FORM_KEY_VRAM)
            .setValue(this.calculateHanaRAM(dbSizeInGB));
        }
        if (!this.Context.Payload) {
          this.submitToFieldChangesToResetGeneratedLists(
            this.FORM_KEY_DB_SIZE_GB
          );
        }
      });

    // set HANA Memory Size dependencies
    this.form
      .get(this.FORM_KEY_HANA_MEMORY_SIZE)
      .valueChanges.subscribe((hanaMemorySize) => {
        // set value of the DB Size equal to the HANA Memory Size and disable the form field
        this.form.get(this.FORM_KEY_DB_SIZE_GB).setValue(hanaMemorySize);
      });

    // set SAP Instance Nr dependencies
    this.form.get(this.FORM_KEY_SAP_INSTANCE_NR).valueChanges.subscribe(() => {
      // if the value is one digit long, add 0 at the beginning
      this.constructInstanceNr(this.FORM_KEY_SAP_INSTANCE_NR);
      if (!this.Context.Payload) {
        this.submitToFieldChangesToResetGeneratedLists(
          this.FORM_KEY_SAP_INSTANCE_NR
        );
      }
    });

    // set SAP Central Services Instance Nr dependencies
    this.form
      .get(this.FORM_KEY_SAP_CENTRAL_SERVICES_INSTANCE_NR)
      .valueChanges.subscribe(() => {
        // if the value is one digit long, add 0 at the beginning
        this.constructInstanceNr(
          this.FORM_KEY_SAP_CENTRAL_SERVICES_INSTANCE_NR
        );
        if (!this.Context.Payload) {
          this.submitToFieldChangesToResetGeneratedLists(
            this.FORM_KEY_SAP_CENTRAL_SERVICES_INSTANCE_NR
          );
        }
      });

    // set HANA Instance Nr dependencies
    this.form.get(this.FORM_KEY_HANA_INSTANCE_NR).valueChanges.subscribe(() => {
      // if the value is one digit long, add 0 at the beginning
      this.constructInstanceNr(this.FORM_KEY_HANA_INSTANCE_NR);

      if (!this.Context.Payload) {
        this.submitToFieldChangesToResetGeneratedLists(
          this.FORM_KEY_HANA_INSTANCE_NR
        );
      }
    });

    // set SID dependencies
    this.form.get(this.FORM_KEY_SID).valueChanges.subscribe((sid) => {
      if (sid && this.hasLowerCase(sid)) {
        this.form.get(this.FORM_KEY_SID).setValue(sid.toUpperCase());
      }

      if (!this.Context.Payload) {

        this.submitToFieldChangesToResetGeneratedLists(this.FORM_KEY_SID);
      }
    });

    // set HANA SID dependencies
    this.form.get(this.FORM_KEY_HANA_SID).valueChanges.subscribe((hanaSID) => {
      if (hanaSID && this.hasLowerCase(hanaSID)) {
        this.form.get(this.FORM_KEY_HANA_SID).setValue(hanaSID.toUpperCase());
      }
      if (!this.Context.Payload) {

        this.submitToFieldChangesToResetGeneratedLists(this.FORM_KEY_HANA_SID);
      }
    });
  }

  /**
   * Subscribes to value changes of the forms {@link FORM_KEY_DATA_CENTER}, {@link FORM_KEY_CHOOSE_DSI_BLOCK_MANUALLY}
   * and {@link FORM_KEY_SAP_NETWORK_ZONE}.
   */
  private submitToFieldChangesInfrastructure(): void {
    // set DataCenter dependencies
    this.form.get(this.FORM_KEY_DATA_CENTER).valueChanges.subscribe(() => {
      this.setDSIBlocks();
    });

    // set VCenter dependencies
    this.form.get(this.FORM_KEY_V_CENTER).valueChanges.subscribe(() => {
      this.setDSIBlocks();
    });

    // set Choose DSI Block manually dependencies
    this.form
      .get(this.FORM_KEY_CHOOSE_DSI_BLOCK_MANUALLY)
      .valueChanges.subscribe((chooseDSIBlockManually) => {
        // if the DSI Block should be chosen manually, enable the DSI Block field
        if (chooseDSIBlockManually) {
          this.form.get(this.FORM_KEY_DSI_BLOCK).enable();
        } else {
          // otherwise disable the DSI Block field and set the Default Block
          this.form.get(this.FORM_KEY_DSI_BLOCK).disable();
          this.setDefaultDSIBlock();
        }
      });

    // set SAP Network Zone dependencies
    this.form.get(this.FORM_KEY_SAP_NETWORK_ZONE).valueChanges.subscribe(() => {
      // set Customer LAN, NAS LAN and shared IP according to selected SAP Network Zone
      const selectedNetworkZone: NetworkZoneModel =
        this.getSelectedNetworkZone();
      if (selectedNetworkZone) {
        this.form
          .get(this.FORM_KEY_SHARED_NAS_IP)
          .setValue(selectedNetworkZone.shared_ip);
        this.setCustAndNas();
      }
    });
  }

  /**
   * Subscribes to value changes of the form {@link FORM_KEY_PAY_PER_USE}.
   */
  private submitToFieldChangesVMSettings(): void {
    // set Pay per Use dependencies
    this.form
      .get(this.FORM_KEY_PAY_PER_USE)
      .valueChanges.subscribe((payPerUse) => {
        // if Pay per Use is selected, enable Lower Limit selection (and show in HTML)
        if (payPerUse && !this.isDBTypeHana()) {
          this.form.get(this.FORM_KEY_LOWER_LIMIT).enable();
        } else {
          // otherwise disable Lower Limit selection (and hide in HTML)
          this.form.get(this.FORM_KEY_LOWER_LIMIT).disable();
        }
      });
  }

  private submitToFieldChangesToResetGeneratedLists(...formFieldKeys): void {
    if (!this.Context.Payload) {

      for (const formFieldKey of formFieldKeys) {
        this.form
          .get(formFieldKey)
          .valueChanges.pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            if (
              this.sapServices$.value ||
              this.nasVolumes$.value ||
              this.hosts$.value
            ) {
              this.sapServices$.next(null);
              this.nasVolumes$.next(null);
              this.hosts$.next(null);
              this.form.get(this.FORM_KEY_SAP_SERVICES).reset();
              this.form.get(this.FORM_KEY_NAS_VOLUMES).reset();
              this.form.get(this.FORM_KEY_HOSTS).reset();
              this.form.get(this.FORM_KEY_HOSTNAME).reset();
            }
          });
      }
    }
  }

  /**
   * Checks if the Basic Settings section in the form is valid.
   */
  private isBasicSettingsValid(): boolean {
    return (
      !this.form.get(this.FORM_KEY_SAP_CUSTOMER).errors &&
      !this.form.get(this.FORM_KEY_SAP_OPERATING_SYSTEM).errors &&
      !this.form.get(this.FORM_KEY_SAP_DATABASE_TYPE).errors
    );
  }

  /**
   * Checks if the Basic Settings and General, SLA sections in the form are valid.
   */
  private isGeneralValid(): boolean {
    return (
      this.isBasicSettingsValid() &&
      !this.form.get(this.FORM_KEY_WBS).errors &&
      !this.form.get(this.FORM_KEY_BESTSHORE).errors &&
      !this.form.get(this.FORM_KEY_DOMAIN_CUSTOMER_LAN).errors &&
      !this.form.get(this.FORM_KEY_DOMAIN_UAN).errors &&
      !this.form.get(this.FORM_KEY_COMMENT_CMDB).errors &&
      !this.form.get(this.FORM_KEY_ENVIRONMENT).errors &&
      !this.form.get(this.FORM_KEY_CRITICALITY).errors &&
      !this.form.get(this.FORM_KEY_SERVICE_TIME).errors &&
      !this.form.get(this.FORM_KEY_ATTENDED_OPERATION_TIME).errors &&
      !this.form.get(this.FORM_KEY_USE_SLA).errors &&
      !this.form.get(this.FORM_KEY_SLA).errors
    );
  }

  /**
   * Checks if the Basic Settings, General, SLA and SAP sections in the form are valid.
   */
  private isSAPValid(): boolean {
    return (
      this.isGeneralValid() &&
      !this.form.get(this.FORM_KEY_SAP_SYSTEM_TYPE).errors &&
      !this.form.get(this.FORM_KEY_SID).errors &&
      !this.form.get(this.FORM_KEY_DB_SIZE_GB).errors &&
      !this.form.get(this.FORM_KEY_SAP_INSTANCE_NR).errors &&
      !this.form.get(this.FORM_KEY_SAP_CENTRAL_SERVICES_INSTANCE_NR).errors &&
      !this.form.get(this.FORM_KEY_SAP_CLIENTS).errors &&
      !this.form.get(this.FORM_KEY_HANA_SID).errors &&
      !this.form.get(this.FORM_KEY_HANA_INSTANCE_NR).errors &&
      !this.form.get(this.FORM_KEY_HANA_MEMORY_SIZE).errors
    );
  }

  /**
   * Checks if the Basic Settings, General, SLA, SAP and Infrastructure sections in the form are valid.
   */
  private isInfrastructureValid(): boolean {
    return (
      this.isSAPValid() &&
      !this.form.get(this.FORM_KEY_DATA_CENTER).errors &&
      !this.form.get(this.FORM_KEY_DR_LEVEL).errors &&
      !this.form.get(this.FORM_KEY_DSI_BLOCK).errors &&
      !this.form.get(this.FORM_KEY_CHOOSE_DSI_BLOCK_MANUALLY).errors &&
      !this.form.get(this.FORM_KEY_SAP_NETWORK_ZONE).errors &&
      !this.form.get(this.FORM_KEY_DOMAIN_CUSTOMER_LAN).errors &&
      !this.form.get(this.FORM_KEY_NAS_LAN).errors &&
      !this.form.get(this.FORM_KEY_SHARED_NAS_IP).errors
    );
  }

  /**
   * Checks if the Basic Settings, General, SLA, SAP, Infrastructure and Operating System sections in the form are valid.
   */
  private isOperatingSystemValid(): boolean {
    return (
      this.isInfrastructureValid() &&
      !this.form.get(this.FORM_KEY_VERSION).errors &&
      !this.form.get(this.FORM_KEY_DOMAIN).errors &&
      !this.form.get(this.FORM_KEY_TIMEZONE).errors &&
      !this.form.get(this.FORM_KEY_PATCH_MODE).errors
    );
  }

  /**
   * Checks if the Basic Settings, General, SLA, SAP, Infrastructure, Operating System and VM Settings sections in the form are valid.
   */
  isVMSettingsValid(): boolean {
    return (
      this.isOperatingSystemValid() &&
      !this.form.get(this.FORM_KEY_PAY_PER_USE).errors &&
      !this.form.get(this.FORM_KEY_VCPU).errors &&
      !this.form.get(this.FORM_KEY_VRAM).errors &&
      !this.form.get(this.FORM_KEY_LIMITS_UNIT).errors &&
      (this.form.get(this.FORM_KEY_LOWER_LIMIT).value ||
        this.form.get(this.FORM_KEY_LOWER_LIMIT).disabled) &&
      (this.form.get(this.FORM_KEY_UPPER_LIMIT).value ||
        this.form.get(this.FORM_KEY_UPPER_LIMIT).disabled)
    );
  }

  /**
   * Adds a new error message to an AbstractControl.
   *
   * @param abstractControl which should receive the error message
   * @param errorMessage which should be shown
   */
  private setGeneralErrorMessage(
    abstractControl: AbstractControl,
    errorMessage: string
  ): void {
    const validationErrors = abstractControl.errors || {};
    validationErrors.validNumber = { message: errorMessage };
    abstractControl.markAsTouched();
    abstractControl.setErrors(validationErrors);
  }

  /**
   * Checks if a string has lower case characters.
   *
   * @param str which should be checked
   */
  private hasLowerCase(str: string): boolean {
    return /[a-z]/.test(str);
  }

  /**
   * Basic Settings methods
   */

  /**
   * Get SAP Customers from CatDB and sets value of sapCustomers$.
   */
  private setSAPCustomers(): void {
    this.dataService
      .getCustomers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (customers) => {
          // set retrieved Customers
          this.sapCustomers$.next(customers);
          this.setOnlyOccurrence(customers, this.FORM_KEY_SAP_CUSTOMER);
        },
        (error) => {
          // TODO
          console.error(error);
        }
      );
  }

  /**
   * Sets the abbreviation of the customer stored in the CMDB in sapCustomerAbbreviations
   */
  private setCustomerAbbreviation(): void {
    const customer = this.form.get(this.FORM_KEY_SAP_CUSTOMER).value;
    if (customer) {
      if (!this.sapCustomerAbbreviations[customer]) {
        this.dataService
          .getCustomerAbbreviation(customer)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (cmdbCustomer) => {
              const shortname = cmdbCustomer.CUSTOMERSAPABBR || "";
              if (shortname) {
                this.sapCustomerAbbreviations[customer] = shortname;
              } else {
                this.xaNotifyService.error(
                  `The field CUSTOMERSAPABBR for customer ${customer} was not found in CMDB!.`
                );
              }
              this.form
                .get(this.FORM_KEY_SAP_CUSTOMER_SHORTNAME)
                .setValue(shortname);
            },
            (error) => {
              // TODO
              console.error(error);
            }
          );
      } else {
        this.form
          .get(this.FORM_KEY_SAP_CUSTOMER_SHORTNAME)
          .setValue(this.sapCustomerAbbreviations[customer]);
      }
    }
  }

  /**
   * Gets the supported DB types from CatDB and sets value of sapDBTypes$.
   */
  private setSupportedDBTypes(): void {
    this.isLoadingSapDBTypes$.next(true);

    // check if an OS is selected
    if (this.form.get(this.FORM_KEY_SAP_OPERATING_SYSTEM).value) {
      // get db types for selectedOS
      this.dataService
        .getDBTypeByOS(this.form.get(this.FORM_KEY_SAP_OPERATING_SYSTEM).value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (dbTypes) => {
            // set retrieved DB Types
            this.sapDBTypes$.next(dbTypes);
            this.setOnlyOccurrence(dbTypes, this.FORM_KEY_SAP_DATABASE_TYPE);
            this.isLoadingSapDBTypes$.next(false);
          },
          (error) => {
            // TODO
            console.error(error);
            this.isLoadingSapDBTypes$.next(false);
          }
        );
    }
  }

  /**
   * Checks if the selected SAPDatabaseType is a HANA DB.
   */
  isDBTypeHana(): boolean {
    return (
      this.form.get(this.FORM_KEY_SAP_DATABASE_TYPE).value.toLowerCase() ===
      "hana"
    );
  }

  private setOnlyOccurrence(possibleValues: any[], formKey: string): void {
    if (possibleValues.length === 1) {
      this.form.get(formKey).setValue(possibleValues[0]);
    }
  }

  /**
   * Sets the value of the form field with key formFieldKey.
   * If the instanceNr is only one digit, a 0 will be added at the beginning.
   * If the instanceNr is a 0 with two digits following, the 0 at the beginning will be cut away.
   * IMPORTANT: if the number was filled up with a 0 at the front, then the 0 would stay, even if a 2 digit number was provided
   *            e.g. Input 22 -> 022 would have been shown
   *            therefore the two digit number must be set programically again, if the first input was a 1 digit number
   *            to prevent and endless recursion (because the value would have been changed),
   *            the flags and the switches will be used to check if the previous input was 1 digit or two
   *            (the problem would occur if the first input was e.g. 1 and the second 2, to get the number 12)
   *
   * @param formFieldKey where the formatted instanceNr should be set as value
   */
  private constructInstanceNr(formFieldKey: string): void {
    const instanceNr = this.form.get(formFieldKey).value.toString();
    let instanceNrFormattedAfter0Add;

    // get flag indicating if a 0 was currently added at the specific instance number
    // IMPORTANT: DO NOT REMOVE, this is necessary to prevent an endless recursion!
    switch (formFieldKey) {
      case this.FORM_KEY_SAP_INSTANCE_NR:
        instanceNrFormattedAfter0Add = this.sapInstanceNrFormattedAfter0Add;
        break;

      case this.FORM_KEY_SAP_CENTRAL_SERVICES_INSTANCE_NR:
        instanceNrFormattedAfter0Add =
          this.sapCentralServicesInstanceNrFormattedAfter0Add;
        break;

      case this.FORM_KEY_HANA_INSTANCE_NR:
        instanceNrFormattedAfter0Add = this.sapHANAInstanceNrFormattedAfter0Add;
        break;

      default:
        instanceNrFormattedAfter0Add = false;
    }

    if (instanceNr) {
      // only 1 digit was provided to the input
      if (instanceNr.length === 1) {
        // set flag indicating if a 0 was currently added at the specific instance number
        // IMPORTANT: DO NOT REMOVE OR CHANGE SEQUENCE, this is necessary to prevent an endless recursion!
        switch (formFieldKey) {
          case this.FORM_KEY_SAP_INSTANCE_NR:
            this.sapInstanceNrFormattedAfter0Add = true;
            break;

          case this.FORM_KEY_SAP_CENTRAL_SERVICES_INSTANCE_NR:
            this.sapCentralServicesInstanceNrFormattedAfter0Add = true;
            break;

          case this.FORM_KEY_HANA_INSTANCE_NR:
            this.sapHANAInstanceNrFormattedAfter0Add = true;
            break;

          default:
            break;
        }
        // add 0 at the beginning of the instance number
        // IMPORTANT: DO NOT CHANGE SEQUENCE, this is necessary to prevent an endless recursion!
        this.form.get(formFieldKey).setValue("0" + instanceNr);
      }
      // leading 0's will be removed at the value, but will be shown in the input field
      // therefore, the instance number must be set again in the code
      // to prevent an endless recursion, the instance nr will be set again, only if the previous action was to add a leading 0
      else if (
        instanceNrFormattedAfter0Add &&
        instanceNr.length === 2 &&
        !instanceNr.startsWith("0")
      ) {
        // set flag indicating that no leading 0 was added to the specific instance nr
        // IMPORTANT: DO NOT REMOVE OR CHANGE SEQUENCE, this is necessary to prevent an endless recursion!
        switch (formFieldKey) {
          case this.FORM_KEY_SAP_INSTANCE_NR:
            this.sapInstanceNrFormattedAfter0Add = false;
            break;

          case this.FORM_KEY_SAP_CENTRAL_SERVICES_INSTANCE_NR:
            this.sapCentralServicesInstanceNrFormattedAfter0Add = false;
            break;

          case this.FORM_KEY_HANA_INSTANCE_NR:
            this.sapHANAInstanceNrFormattedAfter0Add = false;
            break;

          default:
            break;
        }
        // set the instance nr again to prevent showing the previously added leading 0
        // IMPORTANT: DO NOT CHANGE SEQUENCE, this is necessary to prevent an endless recursion
        this.form.get(formFieldKey).setValue(instanceNr);
      }
    }
  }

  /**
   * General, SLA methods
   */

  /**
   * Gets the default WBS and sets the value of the 'WBS' form.
   */
  private setDefaultWBS(): void {
    // check if a Customer is selected
    if (this.form.get(this.FORM_KEY_SAP_CUSTOMER).value) {
      this.isLoadingWBS$.next(true);

      // retrieve the default WBS of the customer
      this.dataService
        .getDefaultWBS(this.form.get(this.FORM_KEY_SAP_CUSTOMER).value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (defaultWBS) => {
            if (defaultWBS && defaultWBS.length > 0 && defaultWBS[0]) {
              // set the retrieved WBS in the field
              this.form.get(this.FORM_KEY_WBS).setValue(defaultWBS[0]);
            } else {
              this.form.get(this.FORM_KEY_WBS).setValue("");
              this.xaNotifyService.warning(
                `No default WBS found for Customer ${
                  this.form.get(this.FORM_KEY_SAP_CUSTOMER).value
                }".`
              );
            }

            this.isLoadingWBS$.next(false);
          },
          (error) => {
            // TODO
            console.error(error);
            this.isLoadingWBS$.next(false);
          }
        );
    }
  }

  /**
   * Gets the default bestshore and sets the value of the 'Bestshore' form.
   */
  private setDefaultBestshore(): void {
    // check if a Customer is selected
    if (this.form.get(this.FORM_KEY_SAP_CUSTOMER).value) {
      this.isLoadingBestshore$.next(true);

      // get the default Bestshore selection of the Customer
      this.dataService
        .getDefaultBestshored(this.form.get(this.FORM_KEY_SAP_CUSTOMER).value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (bestshored) => {
            if (bestshored && bestshored.length > 0 && bestshored[0]) {
              // set the retrieved Bestshore selection in the field
              this.form.get(this.FORM_KEY_BESTSHORE).setValue(bestshored[0]);
            } else {
              this.form.get(this.FORM_KEY_BESTSHORE).setValue("");
              this.xaNotifyService.warning(
                `No default bestshored selection found for Customer ${
                  this.form.get(this.FORM_KEY_SAP_CUSTOMER).value
                }".`
              );
            }

            this.isLoadingBestshore$.next(false);
          },
          (error) => {
            // TODO
            console.error(error);
            this.isLoadingBestshore$.next(false);
          }
        );
    }
  }

  /**
   * Gets the default domain customer lan and sets the value of the 'DomainCustomerLan' form.
   */
  private setDefaultDomainCustomerLan(): void {
    // check if a Customer is selected
    if (this.form.get(this.FORM_KEY_SAP_CUSTOMER).value) {
      this.isLoadingDomainCustomerLAN$.next(true);

      // get the default Domain Customer LAN of the Customer
      this.dataService
        .getDefaultDomainCustomerLAN(
          this.form.get(this.FORM_KEY_SAP_CUSTOMER).value
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (defaultDomainCustomerLAN) => {
            if (
              defaultDomainCustomerLAN &&
              defaultDomainCustomerLAN.length > 0 &&
              defaultDomainCustomerLAN[0]
            ) {
              // set the retrieved Domain Customer LAN in the field
              this.form
                .get(this.FORM_KEY_DOMAIN_CUSTOMER_LAN)
                .setValue(defaultDomainCustomerLAN[0]);
            } else {
              this.form.get(this.FORM_KEY_DOMAIN_CUSTOMER_LAN).setValue("");
              this.xaNotifyService.warning(
                `No default Domain Customer LAN found for Customer ${
                  this.form.get(this.FORM_KEY_SAP_CUSTOMER).value
                }".`
              );
            }

            this.isLoadingDomainCustomerLAN$.next(false);
          },
          (error) => {
            // TODO
            console.error(error);
            this.isLoadingDomainCustomerLAN$.next(false);
          }
        );
    }
  }

  /**
   * Gets the default domain uan and sets the value of the 'DomainUAN' form.
   */
  private setDefaultDomainUAN(): void {
    // check if a Customer is selected
    if (this.form.get(this.FORM_KEY_SAP_CUSTOMER).value) {
      this.isLoadingDomainUAN$.next(true);

      // retrieve the default Domain UAN of the Customer
      this.dataService
        .getDefaultDomainUAN(this.form.get(this.FORM_KEY_SAP_CUSTOMER).value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (defaultDomainUAN) => {
            // set the retrieved Domain UAN in the field, or set '' and show info message, if nothing was found
            if (defaultDomainUAN && defaultDomainUAN.CUSTOMERUANDNSSUBDOMAIN) {
              this.form
                .get(this.FORM_KEY_DOMAIN_UAN)
                .setValue(defaultDomainUAN.CUSTOMERUANDNSSUBDOMAIN);
            } else {
              this.form.get(this.FORM_KEY_DOMAIN_UAN).setValue("");
              this.xaNotifyService.info(
                `No default Domain UAN found for Customer ${
                  this.form.get(this.FORM_KEY_SAP_CUSTOMER).value
                }".`
              );
            }

            this.isLoadingDomainUAN$.next(false);
          },
          (error) => {
            // TODO
            console.error(error);
            this.isLoadingDomainUAN$.next(false);
          }
        );
    }
  }

  /**
   * Sets the list of available Environments.
   */
  private setEnvironments(): void {
    // retrieve list of available Environments
    this.dataService
      .getEnvironments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (environments) => {
          // set retrieved Environments in list
          this.environments$.next(environments);
          this.setOnlyOccurrence(environments, this.FORM_KEY_ENVIRONMENT);
        },
        (error) => {
          // TODO
          console.error(error);
        }
      );
  }

  /**
   * Sets the list of available Criticality.
   */
  private setCriticality(): void {
    // retrieve list of available Criticality
    this.dataService
      .getCriticality()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (criticality) => {
          // set retrieved Criticality
          this.criticality$.next(criticality);
          this.setOnlyOccurrence(criticality, this.FORM_KEY_CRITICALITY);
        },
        (error) => {
          // TODO
          console.error(error);
        }
      );
  }

  /**
   * Sets the default Service Time of a selected Customer and Environment.
   */
  private setDefaultServiceTime(): void {
    this.setDefaultTime(
      this.FORM_KEY_SERVICE_TIME,
      this.serviceTimes$,
      this.isLoadingServiceTimes$,
      this.dataService.getDefaultServiceTime(
        this.form.get(this.FORM_KEY_SAP_CUSTOMER).value,
        this.form.get(this.FORM_KEY_ENVIRONMENT).value
      )
    );
  }

  /**
   * Sets the default Attended Operation Time of a selected Customer and Environment.
   */
  private setDefaultAttendedOperationTime(): void {
    this.setDefaultTime(
      this.FORM_KEY_ATTENDED_OPERATION_TIME,
      this.attendedOperationTimes$,
      this.isLoadingAttendedOperationTime$,
      this.dataService.getDefaultAttendedOperationTime(
        this.form.get(this.FORM_KEY_SAP_CUSTOMER).value,
        this.form.get(this.FORM_KEY_ENVIRONMENT).value
      )
    );
  }

  /**
   * Sets the default Attended Operation Time of a selected Customer and Environment.
   */
  private setDefaultHostServiceTime(): void {
    this.setDefaultTime(
      this.FORM_KEY_HOST_SERVICE_TIME,
      this.hostServiceTimes$,
      this.isLoadingHostServiceTimes$,
      this.dataService.getDefaultServiceTime(
        this.form.get(this.FORM_KEY_SAP_CUSTOMER).value,
        this.form.get(this.FORM_KEY_ENVIRONMENT).value
      )
    );
  }

  /**
   * Sets the default Time of a selected Customer and Environment.
   */
  private setDefaultTime(
    formKeyField: string,
    times: BehaviorSubject<string[]>,
    isLoadingForm: BehaviorSubject<boolean>,
    timesListObservable: Observable<string[]>
  ): void {
    // check if a Customer and an Environment is selected
    if (
      this.form.get(this.FORM_KEY_SAP_CUSTOMER).value &&
      this.form.get(this.FORM_KEY_ENVIRONMENT).value
    ) {
      isLoadingForm.next(true);

      // retrieve the default Attended Operation Time according to the selected Customer and Environment
      timesListObservable.pipe(takeUntil(this.destroy$)).subscribe(
        (timesList) => {
          if (timesList && timesList.length > 0 && timesList[0]) {
            if (times.value) {
              if (times.value.includes(timesList[0])) {
                // set the retrieved Service Time in the field
                this.form.get(formKeyField).setValue(timesList[0]);
              } else {
                this.form.get(formKeyField).setValue("");
                this.xaNotifyService.warning(
                  `The found default Attended Operation Time "${timesList[0]}" is not a valid selection.`
                );
              }
            }
          } else {
            this.xaNotifyService.warning(
              `No default Attended Operation Time found for Customer ${
                this.form.get(this.FORM_KEY_SAP_CUSTOMER).value
              }" and Environment "${
                this.form.get(this.FORM_KEY_ENVIRONMENT).value
              }".`
            );
          }
          isLoadingForm.next(false);
        },
        (error) => {
          // TODO
          console.error(error);
          isLoadingForm.next(false);
        }
      );
    }
  }

  /**
   * Sets the supported Service Times of a specific Assignment Group (by selected OS and Bestshore selection).
   */
  private setServiceTimes(): void {
    // check if an OS is selected and the Bestshore selection is made
    if (
      this.form.get(this.FORM_KEY_SAP_OPERATING_SYSTEM).value &&
      this.form.get(this.FORM_KEY_BESTSHORE).value
    ) {
      // set the value of the form field AssignmentGroup and the serviceTimes$
      this.setAssignmentGroupAndServiceTimes(
        this.serviceTimes$,
        this.isLoadingServiceTimes$,
        this.dataService.getAssignmentGroup(
          this.form.get(this.FORM_KEY_SAP_OPERATING_SYSTEM).value,
          this.form.get(this.FORM_KEY_BESTSHORE).value
        ),
        this.FORM_KEY_ASSIGNMENT_GROUP,
        this.FORM_KEY_SERVICE_TIME
      );
    }
  }

  /**
   * Sets the supported Attended Operation Times of a specific Assignment Group (by selected OS and Bestshore selection).
   */
  private setAttendedOperationTimes(): void {
    // check if an OS is selected and the Bestshore selection is made
    if (
      this.form.get(this.FORM_KEY_SAP_OPERATING_SYSTEM).value &&
      this.form.get(this.FORM_KEY_BESTSHORE).value
    ) {
      // set the value of the form field AssignmentGroup and the attendedOperationTimes$
      this.setAssignmentGroupAndServiceTimes(
        this.attendedOperationTimes$,
        this.isLoadingAttendedOperationTimes$,
        this.dataService.getAssignmentGroup(
          this.form.get(this.FORM_KEY_SAP_OPERATING_SYSTEM).value,
          this.form.get(this.FORM_KEY_BESTSHORE).value
        ),
        this.FORM_KEY_ASSIGNMENT_GROUP,
        this.FORM_KEY_ATTENDED_OPERATION_TIME
      );
    }
  }

  /**
   * Sets the supported Host Service Times of a specific Assignment Group (by selected OS).
   */
  private setHostServiceTimes(): void {
    // check if an OS is selected
    if (this.form.get(this.FORM_KEY_SAP_OPERATING_SYSTEM).value) {
      // set the value of the form field HostAssignmentGroup and the hostServiceTimes$
      this.setAssignmentGroupAndServiceTimes(
        this.hostServiceTimes$,
        this.isLoadingHostServiceTimes$,
        this.dataService.getHostAssignmentGroup(
          this.form.get(this.FORM_KEY_SAP_OPERATING_SYSTEM).value
        ),
        this.FORM_KEY_HOST_ASSIGNMENT_GROUP,
        this.FORM_KEY_HOST_SERVICE_TIME
      );
    }
  }

  /**
   * Sets the Assignment Group and the supported Service Times of the Assignment Group.
   * If the Assignment Group and Service Time should be set for a Host, by selected OS.
   * Otherwise by selected OS and the Bestshore selection.
   *
   * @param times$ where the Assignment Groups should be stored
   * @param isLoading$ indicator whether the data will still be retrieved
   * @param assignmentGroupsObservable observable which holds the needed assignment group
   * @param assignmentGroupFormFieldKey form field key where the assignment group should be stored
   * @param defaultValueForFormField form field key where the default value should be stored
   */
  private setAssignmentGroupAndServiceTimes(
    times$: BehaviorSubject<Array<string>>,
    isLoading$: BehaviorSubject<boolean>,
    assignmentGroupsObservable: Observable<Array<string>>,
    assignmentGroupFormFieldKey: string,
    defaultValueForFormField: string
  ): void {
    isLoading$.next(true);

    assignmentGroupsObservable.pipe(takeUntil(this.destroy$)).subscribe(
      (assignmentGroups) => {
        if (assignmentGroups.length > 0) {
          const assignmentGroup = assignmentGroups[0].trim();

          // set retrieved AssignmentGroup in the field
          this.form.get(assignmentGroupFormFieldKey).setValue(assignmentGroup);

          // retrieve available Service Times according to retrieved Assignment Group
          this.dataService
            .getServiceTimes(assignmentGroup)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              (serviceTimes) => {
                // set retrieved Service Times in list
                times$.next(serviceTimes);

                // set default value for form field if available
                switch (defaultValueForFormField) {
                  case this.FORM_KEY_SERVICE_TIME:
                    if (!this.Context.Payload) {
                      this.setDefaultServiceTime();
                    }
                    if (
                      this.Context.Payload &&
                      this.Context.Payload["ServiceTime"]
                    ) {

                      this.form
                        .get(this.FORM_KEY_SERVICE_TIME)
                        .patchValue(this.Context.Payload["ServiceTime"]);
                    }
                    break;
                  case this.FORM_KEY_ATTENDED_OPERATION_TIME:
                    if (!this.Context.Payload) {
                      this.setDefaultAttendedOperationTime();
                    }
                    if (
                      this.Context.Payload &&
                      this.Context.Payload["AttendedOperationTime"]
                    ) {
                      this.form
                        .get(this.FORM_KEY_ATTENDED_OPERATION_TIME)
                        .patchValue(
                          this.Context.Payload["AttendedOperationTime"]
                        );
                    }
                    break;
                  case this.FORM_KEY_HOST_SERVICE_TIME:
                    if (!this.Context.Payload) {
                      this.setDefaultHostServiceTime();
                    }
                    if (
                      this.Context.Payload &&
                      this.Context.Payload["HostServiceTime"]
                    ) {
                      this.form
                        .get(this.FORM_KEY_HOST_SERVICE_TIME)
                        .patchValue(this.Context.Payload["HostServiceTime"]);
                    }
                    break;
                  default:
                    break;
                }

                isLoading$.next(false);
              },
              (error) => {
                // TODO
                console.error(error);
                isLoading$.next(false);
              }
            );
        }
      },
      (error) => {
        // TODO
        console.error(error);
        isLoading$.next(false);
      }
    );
  }

  /**
   * Sets the SLAs which can be used by a selected Customer.
   */
  private setCustomerSLAs(): void {
    // check if a Customer is selected
    if (
      this.form.get(this.FORM_KEY_USE_SLA).value &&
      this.form.get(this.FORM_KEY_SAP_CUSTOMER).value
    ) {
      this.isLoadingSLAs$.next(true);

      // retrieve the usable SLAs of the Customer
      this.dataService
        .getCustomerSLAs(this.form.get(this.FORM_KEY_SAP_CUSTOMER).value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (slas) => {
            // set retrieved SLAs in the list
            this.slas$.next(slas);
            this.setOnlyOccurrence(slas, this.FORM_KEY_SLA);
            this.isLoadingSLAs$.next(false);
          },
          (error) => {
            // TODO
            console.error(error);
            this.isLoadingSLAs$.next(false);
          }
        );
    }
  }

  /**
   * SAP methods
   */

  /**
   * Infrastructure methods
   */

  /**
   * Sets the default DR Level according to the selected Customer and Environment.
   */
  private setDefaultDRLevel(): void {
    // if a customer and environment is selected AND if the selected DB is not HANA (then must be always "default")
    if (
      this.form.get(this.FORM_KEY_SAP_CUSTOMER).value &&
      this.form.get(this.FORM_KEY_ENVIRONMENT).value &&
      !this.isDBTypeHana()
    ) {
      this.isLoadingDRLevel$.next(true);

      if (this.Context.Payload && this.Context.Payload["DRLevel"]) {
        this.form
          .get(this.FORM_KEY_DR_LEVEL)
          .setValue(this.Context.Payload["DRLevel"]);
      } else {
        // retrieve default DR Level according to selected Customer and Environment
        this.dataService
          .getDefaultDRLevel(
            this.form.get(this.FORM_KEY_SAP_CUSTOMER).value,
            this.form.get(this.FORM_KEY_ENVIRONMENT).value
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (drLevels) => {
              if (drLevels && drLevels.length > 0 && drLevels[0]) {
                // set retrieved DR Level in field
                this.form.get(this.FORM_KEY_DR_LEVEL).setValue(drLevels[0]);
                this.isLoadingDRLevel$.next(false);
              } else {
                this.form.get(this.FORM_KEY_DR_LEVEL).setValue("");
                this.xaNotifyService.warning(
                  `No default DRLevel found for Customer ${
                    this.form.get(this.FORM_KEY_SAP_CUSTOMER).value
                  }" and Environment "${
                    this.form.get(this.FORM_KEY_ENVIRONMENT).value
                  }".`
                );
              }
            },
            (error) => {
              // TODO
              console.error(error);
              this.isLoadingDRLevel$.next(false);
            }
          );
      }
    }
  }

  /**
   * Sets the default DSI Block according to the selected Environment, DB Type, Data Center and VCenter.
   */
  private setDefaultDSIBlock(): void {
    // check if an Environment, a DB Type and Data Center is selected
    if (
      this.form.get(this.FORM_KEY_ENVIRONMENT).value &&
      this.form.get(this.FORM_KEY_SAP_DATABASE_TYPE).value &&
      this.form.get(this.FORM_KEY_DATA_CENTER).value &&
      this.form.get(this.FORM_KEY_V_CENTER).value
    ) {
      this.isLoadingDefaultDSIBlock$.next(true);
      if (this.Context.Payload && this.Context.Payload["DSIBlock"]) {
        this.form
          .get(this.FORM_KEY_DSI_BLOCK)
          .setValue(this.Context.Payload["DSIBlock"]);
      } else {
        // reset DSIBlock form to remove potentially previous set error messages
        this.form.get(this.FORM_KEY_DSI_BLOCK).setErrors(null);

        // retrieve the default DSI Block according to the selected Environment, DB Type and Data Center
        this.dataService
          .getDefaultDSIBlock(
            this.form.get(this.FORM_KEY_V_CENTER).value,
            this.form.get(this.FORM_KEY_SAP_DATABASE_TYPE).value,
            this.form.get(this.FORM_KEY_ENVIRONMENT).value,
            this.form.get(this.FORM_KEY_DATA_CENTER).value
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (dsiBlockData) => {
              // if a default DSI Block was found, set it in the field
              if (
                dsiBlockData.data &&
                dsiBlockData.data.length > 0 &&
                dsiBlockData.data[0] &&
                dsiBlockData.data[0].trim()
              ) {
                this.form
                  .get(this.FORM_KEY_DSI_BLOCK)
                  .setValue(dsiBlockData.data[0].trim());
              } else {
                this.form.get(this.FORM_KEY_DSI_BLOCK).setValue("");
                this.setGeneralErrorMessage(
                  this.form.get(this.FORM_KEY_DSI_BLOCK),
                  "This field is required!"
                );
                this.xaNotifyService.warning(
                  `No default DSI Block found for DB "${
                    this.form.get(this.FORM_KEY_SAP_DATABASE_TYPE).value
                  }", Env "${
                    this.form.get(this.FORM_KEY_ENVIRONMENT).value
                  }", Data Center "${
                    this.form.get(this.FORM_KEY_DATA_CENTER).value
                  }" and VCenter "${
                    this.form.get(this.FORM_KEY_V_CENTER).value
                  }".`
                );
              }

              this.isLoadingDefaultDSIBlock$.next(false);
            },
            (error) => {
              // TODO
              console.error(error);
              this.isLoadingDefaultDSIBlock$.next(false);
            }
          );
      }
    }
  }

  /**
   * Sets the list of VCenters according to the selected Data Center.
   */
  private setVCenters(): void {
    // retrieve the list of VCenters of DSI-L Platform
    this.dataService
      .getVCenterNames(this.platformTypeForVCenters)
      .pipe(takeUntil(this.destroy$))
      .subscribe((vCenters) => {
        this.vCenters$.next(vCenters);
        this.setOnlyOccurrence(vCenters, this.FORM_KEY_V_CENTER);
      });
  }

  /**
   * Sets the list of DSI Blocks according to the selected VCenter.
   */
  private setDSIBlocks(): void {
    if (
      this.form.get(this.FORM_KEY_V_CENTER).value &&
      this.form.get(this.FORM_KEY_DATA_CENTER).value &&
      this.form.get(this.FORM_KEY_SAP_DATABASE_TYPE).value &&
      this.form.get(this.FORM_KEY_ENVIRONMENT).value
    ) {
      this.isLoadingDSIBlocks$.next(true);

      // retrieve the list of VCenters of DSI-L Platform
      this.dataService
        .getDSIBlocks(
          this.form.get(this.FORM_KEY_V_CENTER).value,
          this.form.get(this.FORM_KEY_DATA_CENTER).value,
          this.form.get(this.FORM_KEY_SAP_DATABASE_TYPE).value,
          this.form.get(this.FORM_KEY_ENVIRONMENT).value
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (dsiBlocks) => {
            // set retrieved DSI Blocks
            const dsiBlocksCaps = dsiBlocks.map((dsiBlock) =>
              dsiBlock.toUpperCase()
            );
            this.dsiBlocks$.next(dsiBlocksCaps);
            this.setOnlyOccurrence(dsiBlocksCaps, this.FORM_KEY_DSI_BLOCK);
            this.isLoadingDSIBlocks$.next(false);

            if (dsiBlocksCaps.length === 0) {
              this.xaNotifyService.warning(
                `No DSI Blocks found for DB "${
                  this.form.get(this.FORM_KEY_SAP_DATABASE_TYPE).value
                }", Env "${
                  this.form.get(this.FORM_KEY_ENVIRONMENT).value
                }", Data Center "${
                  this.form.get(this.FORM_KEY_DATA_CENTER).value
                }" and VCenter "${
                  this.form.get(this.FORM_KEY_V_CENTER).value
                }".\nTIP: Change the Data Center value.`
              );
            }

            // set default DSI Block
            this.setDefaultDSIBlock();
          },
          (error) => {
            // TODO
            console.error(error);
            this.isLoadingDSIBlocks$.next(false);
          }
        );
    }
  }

  /**
   * Operating System methods
   */

  /**
   * Sets the list of available DB Versions of an OS and DB Type.
   * Resets the version selection.
   */
  private setVersions(): void {
    // check if the OS and DB Type are selected
    if (
      this.form.get(this.FORM_KEY_SAP_OPERATING_SYSTEM).value &&
      this.form.get(this.FORM_KEY_SAP_DATABASE_TYPE).value
    ) {
      // reset version selection
      this.form.get(this.FORM_KEY_VERSION).setValue("");

      this.versions$.next(null);

      // retrieve the supported DB Versions
      this.dataService
        .getVersions(
          this.form.get(this.FORM_KEY_SAP_OPERATING_SYSTEM).value,
          this.form.get(this.FORM_KEY_SAP_DATABASE_TYPE).value
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (versions) => {
            // set the supported DB Versions in the list
            this.versions$.next(versions);
            this.setOnlyOccurrence(versions, this.FORM_KEY_VERSION);
          },
          (error) => {
            // TODO
            console.error(error);
          }
        );
    }

    if (this.Context.Payload && this.Context.Payload["Version"]) {
      this.form
        .get(this.FORM_KEY_VERSION)
        .patchValue(this.Context.Payload["Version"]);
    }
  }

  /**
   * Sets the list of available Timezones
   */
  private setTimezones(): void {
    // retrieve list of available Timezones
    this.dataService
      .getTimezones()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (timeZones) => {
          // set retrieved Timezones in list
          this.timezones$.next(timeZones);
        },
        (error) => {
          // TODO
          console.error(error);
        }
      );
  }

  /**
   * Sets the list of available Patch Modes.
   */
  private setPatchModes(): void {
    // retrieve list of available Patch Modes
    this.dataService
      .getPatchModes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (patchModes) => {
          // set retrieved Patch Modes in list
          this.patchModes$.next(patchModes);
          this.setOnlyOccurrence(patchModes, this.FORM_KEY_PATCH_MODE);
        },
        (error) => {
          // TODO
          console.error(error);
        }
      );
  }

  /**
   * Sets the list of available Patch Times.
   */
  private setPatchTimes(): void {
    // retrieve list of available Patch Modes
    this.dataService
      .getPatchTimes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (patchTimes) => {
          // set retrieved Patch Modes in list
          this.patchTimes$.next(patchTimes);
          this.setOnlyOccurrence(patchTimes, this.FORM_KEY_PATCH_TIME);
        },
        (error) => {
          // TODO
          console.error(error);
        }
      );
  }

  /**
   * Sets the Domain value equal to DomainUAN value, if the selected operating system is linux.
   */
  private setLinuxDomain(): void {
    if (this.form.get(this.FORM_KEY_SAP_OPERATING_SYSTEM).value === "linux") {
      this.form.get(this.FORM_KEY_DOMAIN).setValue("");
    }
  }

  /**
   * Sets all available Network Zones according to the selected SAPCustomer
   */
  private setNetworkZones(): void {
    if (this.form.get(this.FORM_KEY_SAP_CUSTOMER).value) {
      // reset selected network zone incl. lan description fields
      this.form.get(this.FORM_KEY_SAP_NETWORK_ZONE).setValue(null);
      this.form.get(this.FORM_KEY_CUSTOMER_LAN).reset();
      this.form.get(this.FORM_KEY_NAS_LAN).reset();

      // fetch network zones
      this.dataService
        .getNetworkZones(this.form.get(this.FORM_KEY_SAP_CUSTOMER).value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (networkZones) => {
            this.sapNetworkZones$.next(networkZones);

            if (networkZones.length === 1) {
              this.form
                .get(this.FORM_KEY_SAP_NETWORK_ZONE)
                .setValue(networkZones[0].desc);
            }
          },
          (error) => {
            // TODO
            console.error(error);
          }
        );
      if (this.Context.Payload && this.Context.Payload["SAPNetworkZone"]) {
        this.form
          .get(this.FORM_KEY_SAP_NETWORK_ZONE)
          .patchValue(this.Context.Payload["SAPNetworkZone"]);

      }
    }
  }

  /**
   * Sets the CustomerLAN and NAS_LAN form field according to the selected Network Zone.
   */
  private setCustAndNas(): void {
    // check if a network zone is selected
    if (this.form.get(this.FORM_KEY_SAP_NETWORK_ZONE).value) {
      // fetch selected network zone
      const selectedNetworkZone: NetworkZoneModel =
        this.getSelectedNetworkZone();

      if (selectedNetworkZone) {
        // the description of the lans were not fetched -> fetch them from the CMDB
        // acts as cache such that the descriptions must not be loaded multiple times
        if (!selectedNetworkZone.isLANDescFetched) {
          this.isLoadingNetworkZoneDescriptions$.next(true);
          // get lan descriptions from CMDB
          this.dataService
            .getLANDesc(
              this.form.get(this.FORM_KEY_SAP_CUSTOMER).value,
              selectedNetworkZone.cust,
              selectedNetworkZone.nas
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              (networkZoneDescriptionModel) => {
                // save fetched lan descriptions in cache, and mark as already fetched
                selectedNetworkZone.descriptionModel =
                  networkZoneDescriptionModel;
                selectedNetworkZone.isLANDescFetched = true;

                // set CustomerLAN and NAS_LAN form fields
                this.setCustAndNas();

                this.isLoadingNetworkZoneDescriptions$.next(false);
              },
              (error) => {
                // TODO
                console.error(error);
                this.isLoadingNetworkZoneDescriptions$.next(false);
              }
            );
        } else {
          // lan descriptions were already fetched
          const custDescr = selectedNetworkZone.descriptionModel.cust;
          const nasDescr = selectedNetworkZone.descriptionModel.nas;

          // set value or error of CustomerLAN and NAS_LAN form fields
          this.checkLANDescription(
            this.FORM_KEY_CUSTOMER_LAN,
            custDescr,
            selectedNetworkZone.cust
          );
          this.checkLANDescription(
            this.FORM_KEY_NAS_LAN,
            nasDescr,
            selectedNetworkZone.nas
          );
          this.cref.markForCheck();
        }
      }
    }
  }

  /**
   * Checks if the lanDescr holds an error.
   * If yes, the error message will be set as error to the form field with the given key.
   * Otherwise the lanID (and '- lanDesc') will be set as value (if lanDesc is avalaible and not empty).
   *
   * @param formFieldKey key of the form field which should be manipulated
   * @param lanDescr which should be checked for an error
   * @param lanID of the selected LAN
   */
  private checkLANDescription(
    formFieldKey: string,
    lanDescr: string,
    lanID: string
  ): void {
    // lanDescr holds an error message (ERROR: <message>)
    if (lanDescr && lanDescr.startsWith("ERROR: ")) {
      // reset the form filed and add the received message as error
      this.form.get(formFieldKey).setValue(null);
      this.setGeneralErrorMessage(
        this.form.get(formFieldKey),
        lanDescr.replace("ERROR: ", "")
      );
    } else {
      // lanDescr holds no error
      // reset the form field and set it's value to either only the lanID, or lanID - lanDescr (if available and not empty)
      // reset is necessary, otherwise a previously set error message from another fetch won't be deleted
      this.form.get(formFieldKey).reset();
      this.form
        .get(formFieldKey)
        .setValue(lanDescr ? `${lanID} - ${lanDescr}` : lanID);
    }
  }

  /**
   * Gets the selected Network Zone according to the selected description.
   * If the description does not exist, returns null.
   */
  private getSelectedNetworkZone(): NetworkZoneModel {
    // get description of selected network zone
    const selectedNetworkZoneDescr = this.form.get(
      this.FORM_KEY_SAP_NETWORK_ZONE
    ).value;

    // if description exists, filter the selected network zone from sapNetworkZones$ and return it
    if (selectedNetworkZoneDescr && this.sapNetworkZones$.value) {
      const filteredNetworkZones = this.sapNetworkZones$.value.filter(
        (networkZone) => networkZone.desc === selectedNetworkZoneDescr
      );
      return filteredNetworkZones[0];
    }

    // otherwise return null
    return null;
  }

  /**
   * VM Settings methods
   */

  /**
   * Calculates the VRAM according to dbSizeInGB.
   *
   * @param dbSizeInGB the base of the calculation
   */
  private calculateHanaRAM(dbSizeInGB: number): number {
    return +dbSizeInGB + 64;
  }

  /**
   * Gets the Range Options for the CPU slider from the ConfigPayload, or returns a default.
   */
  private getCPURangeOptions(): any {
    return (
      this.Context.ConfigPayload.rangeOptions.cpuRangeOptions || {
        step: 1,
        pips: {
          mode: "values",
          density: 2,
          values: [2, 4, 8, 12, 16, 20, 24, 28, 32],
          stepped: true,
        },
        range: {
          min: 2,
          max: 32,
        },
        behaviour: "snap",
        connect: [true, false],
      }
    );
  }

  /**
   * Gets the Range Options for the VRAM slider from the ConfigPayload, or returns a default.
   */
  private getMemoryRangeOptionsNonHana(): any {
    return (
      this.Context.ConfigPayload.rangeOptions.memoryRangeOptionsNonHana || {
        step: 4,
        padding: [0, 0],
        pips: {
          mode: "values",
          density: 2,
          values: [8, 16, 32, 64, 128, 256],
        },
        range: {
          min: 8,
          max: 256,
        },
        behaviour: "snap",
        connect: [true, false],
      }
    );
  }

  /**
   * Gets the Range Options for the VRAM slider for selected DB type hana from the ConfigPayload, or returns a default.
   */
  private getMemoryRangeOptionsHana(): any {
    return (
      this.Context.ConfigPayload.rangeOptions.memoryRangeOptionsHana || {
        step: 64,
        padding: [0, 0],
        pips: {
          mode: "values",
          density: 4,
          values: [
            0,
            64,
            128,
            256,
            512,
            1024,
            1600
          ]
        },
        range: {
          min: 0,
          max: 1600
        },
        behaviour: "snap",
        connect: [true, false],
      }
    );
  }

  /**
   * Generated Lists methods
   */

  /**
   * Sets the value of the {@link FORM_KEY_SAP_SERVICES} form with the provided {@link SAPServiceModel}s.
   *
   * @param values {@link SAPServiceModel}s which should be set
   */
  updateGridSAPData(values: Array<SAPServiceModel>) {

    this.form.get(this.FORM_KEY_SAP_SERVICES).setValue(values);
  }

  /**
   * Sets the value of the {@link FORM_KEY_NAS_VOLUMES} form with the provided {@link NASVolumeModel}s.
   *
   * @param values {@link NASVolumeModel}s which should be set
   */
  updateGridNASData(values: Array<NASVolumeModel>) {

    this.form.get(this.FORM_KEY_NAS_VOLUMES).setValue(values);
  }

  /**
   * Sets the value of the {@link FORM_KEY_HOSTS} form with the provided {@link HostModel}s.
   *
   * @param values {@link HostModel}s which should be set
   */
  updateGridHostData(values: Array<HostModel>) {
    this.form.get(this.FORM_KEY_HOSTS).setValue(values);
  }

  /**
   * Sets the filled template (table) data of SAP Services, NAS Volumes and Hosts.
   * The SAP Services will be set after the Hosts were set,
   * due to the fact that the SAP Services need the previous generated hostname from hosts.
   */
  setTemplateData(): void {
    this.setNASVolumes();
    this.setHosts();
    delete this.Context.Payload;
    this.cref.markForCheck();

  }

  /**
   * Sets the filled template data of SAP Services.
   */
  private setSAPServices(): void {
    this.isLoadingSAPServices$.next(true);
    // retrieve the filled template data of SAP Services
    this.getFilledTemplateData<SAPServicesModel>("sapservices")
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (sapServices) => {
          // set SAP Services in list and field
          this.sapServices$.next(sapServices[0].sapServices);
          this.form
            .get(this.FORM_KEY_SAP_SERVICES)
            .setValue(this.sapServices$.value);
          this.isLoadingSAPServices$.next(false);
        },
        (error) => {
          // TODO
          console.error(error);
          this.isLoadingSAPServices$.next(false);
        }
      );
  }

  /**
   * Sets the filled template data of NAS Volumes.
   */
  private setNASVolumes(): void {
    this.isLoadingNASVolumes$.next(true);

    // retrieve the filled template data of Nas Volumes
    this.getFilledTemplateData<NASVolumesModel>("nasvolumes")
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (nasVolumes) => {
          // set NAS Volumes in list and field

          this.nasVolumes$.next(nasVolumes[0].nasVolumes);
          this.form
            .get(this.FORM_KEY_NAS_VOLUMES)
            .setValue(this.nasVolumes$.value);

          this.isLoadingNASVolumes$.next(false);
        },
        (error) => {
          // TODO
          console.error(error);
          this.isLoadingNASVolumes$.next(false);
        }
      );
  }

  /**
   * Sets the filled template data of Hosts.
   */
  private setHosts(): void {
    this.isLoadingHosts$.next(true);

    // retrieve the filled template data of hosts
    this.getFilledTemplateData<HostsModel>("hosts")
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (hosts) => {
          // set hosts in list and field
          this.hosts$.next(hosts[0].hosts);
          this.form.get(this.FORM_KEY_HOSTS).setValue(this.hosts$.value);
          this.isLoadingHosts$.next(false);

          // set the hostname field
          this.form
            .get(this.FORM_KEY_HOSTNAME)
            .setValue(hosts[0].hosts[0].hostname);

          // hostname set -> fetch SAPServices due to needed hostname
          this.setSAPServices();
        },
        (error) => {
          // TODO
          console.error(error);
          this.isLoadingHosts$.next(false);
        }
      );
  }

  /**
   * Gets the filled template data of a specific service type.
   *
   * @param servicesType sapservices | nasvolumes | hosts
   */
  private getFilledTemplateData<T>(servicesType: string): Observable<Array<T>> {
    let osType = "";
    let dbType = "";

    osType = this.form.get(this.FORM_KEY_SAP_OPERATING_SYSTEM).value;
    dbType = this.form.get(this.FORM_KEY_SAP_DATABASE_TYPE).value;

    return this.dataService.getFilledSAPTemplateData<T>(
      osType,
      dbType,
      servicesType,
      this.getTemplateParams()
    );
  }

  /**
   * Gets HttpParams which describe with which values the dynamic endpoint should replace the template values.
   */
  private getTemplateParams(): HttpParams {
    let templateParams = new HttpParams();

    if (this.form.get(this.FORM_KEY_SID)) {
      templateParams = templateParams.set(
        "sapSID",
        this.form.get(this.FORM_KEY_SID).value
      );
    }

    if (this.form.get(this.FORM_KEY_SAP_SYSTEM_TYPE)) {
      templateParams = templateParams.set(
        "sapSystemType",
        this.form.get(this.FORM_KEY_SAP_SYSTEM_TYPE).value
      );
    }

    if (this.form.get(this.FORM_KEY_SAP_INSTANCE_NR)) {
      templateParams = templateParams.set(
        "sapInstanceNo",
        this.form.get(this.FORM_KEY_SAP_INSTANCE_NR).value
      );
    }

    if (this.form.get(this.FORM_KEY_SAP_CENTRAL_SERVICES_INSTANCE_NR)) {
      templateParams = templateParams.set(
        "sapInstanceNoCS",
        this.form.get(this.FORM_KEY_SAP_CENTRAL_SERVICES_INSTANCE_NR).value
      );
    }

    if (this.form.get(this.FORM_KEY_HANA_SID)) {
      templateParams = templateParams.set(
        "dbSID",
        this.form.get(this.FORM_KEY_HANA_SID).value
      );
    } else {
      templateParams = templateParams.set(
        "dbSID",
        this.form.get(this.FORM_KEY_SID).value
      );
    }

    if (this.form.get(this.FORM_KEY_DB_SIZE_GB)) {
      templateParams = templateParams.set(
        "dbSize",
        this.form.get(this.FORM_KEY_DB_SIZE_GB).value
      );
    }

    if (this.form.get(this.FORM_KEY_SAP_DATABASE_TYPE)) {
      templateParams = templateParams.set(
        "dbType",
        this.form.get(this.FORM_KEY_SAP_DATABASE_TYPE).value
      );
    }

    if (this.form.get(this.FORM_KEY_HOSTNAME)) {
      templateParams = templateParams.set(
        "hostname",
        this.form.get(this.FORM_KEY_HOSTNAME).value
      );
    }

    if (this.form.get(this.FORM_KEY_HANA_INSTANCE_NR)) {
      templateParams = templateParams.set(
        "hanaInstanceNo",
        this.form.get(this.FORM_KEY_HANA_INSTANCE_NR).value
      );
    }

    if (this.form.get(this.FORM_KEY_SAP_CUSTOMER)) {
      const customer = this.form.get(this.FORM_KEY_SAP_CUSTOMER).value;
      templateParams = templateParams.set(
        "customer",
        this.sapCustomerAbbreviations[customer]
      );
    }

    if (this.getSelectedNetworkZone()) {
      templateParams = templateParams.set(
        "storageVlanID",
        this.getSelectedNetworkZone().nas
      );
    }

    if (this.form.get(this.FORM_KEY_SAP_SYSTEM_TYPE)) {
      let mainSapInstanceTypeValue = "ci";
      if (this.form.get(this.FORM_KEY_SAP_SYSTEM_TYPE).value === "Java") {
        mainSapInstanceTypeValue = "ji";
      }
      templateParams = templateParams.set(
        "mainSAPInstanceType",
        mainSapInstanceTypeValue
      );
    }

    return templateParams;
  }

  /**
   * Gets the column definitions for the SAPServices table.
   */
  private getSAPServiceColumnDefs(): Array<any> {
    return [
      {
        field: "sapSid",
        headerName: "sapSid",
        headerTooltip: "sapSid",
        tooltipField: "sapSid",
        resizable: true,
        editable: true,
      },
      {
        field: "dbSid",
        headerName: "dbSid",
        headerTooltip: "dbSid",
        tooltipField: "dbSid",
        resizable: true,
        editable: true,
      },
      {
        field: "sapSystemType",
        headerName: "sapSystemType",
        headerTooltip: "sapSystemType",
        tooltipField: "sapSystemType",
        resizable: true,
        editable: true,
      },
      {
        field: "hanaInstanceNo",
        headerName: "hanaInstanceNo",
        headerTooltip: "hanaInstanceNo",
        tooltipField: "hanaInstanceNo",
        resizable: true,
        editable: true,
      },
      {
        field: "sapInstanceType",
        headerName: "sapInstanceType",
        headerTooltip: "sapInstanceType",
        tooltipField: "sapInstanceType",
        resizable: true,
        editable: true,
      },
      {
        field: "sapInstanceNo",
        headerName: "sapInstanceNo",
        headerTooltip: "sapInstanceNo",
        tooltipField: "sapInstanceNo",
        resizable: true,
        editable: true,
      },
      {
        field: "sapInstanceNoCS",
        headerName: "sapInstanceNoCS",
        headerTooltip: "sapInstanceNoCS",
        tooltipField: "sapInstanceNoCS",
        resizable: true,
        editable: true,
      },
      {
        field: "dbType",
        headerName: "dbType",
        headerTooltip: "dbType",
        tooltipField: "dbType",
        resizable: true,
        editable: true,
      },
      {
        field: "hostname",
        headerName: "hostname",
        headerTooltip: "hostname",
        tooltipField: "hostname",
        resizable: true,
        editable: true,
      },
      {
        field: "operationModel",
        headerName: "operationModel",
        headerTooltip: "operationModel",
        tooltipField: "operationModel",
        resizable: true,
        editable: true,
      },
    ];
  }

  /**
   * Gets the column definitions for the NasVolumes table.
   */
  private getNASVolumeColumnDefs(): Array<any> {
    return [
      {
        field: "volumeName",
        headerName: "volumeName",
        headerTooltip: "volumeName",
        tooltipField: "volumeName",
        resizable: true,
        editable: true,
      },
      {
        field: "snapvault",
        headerName: "snapvault",
        headerTooltip: "snapvault",
        tooltipField: "snapvault",
        resizable: true,
        editable: true,
      },
      {
        field: "svmAdminUser",
        headerName: "svmAdminUser",
        headerTooltip: "svmAdminUser",
        tooltipField: "svmAdminUser",
        resizable: true,
        editable: true,
      },
      {
        field: "localSnapshotSchedule",
        headerName: "localSnapshotSchedule",
        headerTooltip: "localSnapshotSchedule",
        tooltipField: "localSnapshotSchedule",
        resizable: true,
        editable: true,
      },
      {
        field: "retentionLocalSnapshots",
        headerName: "retentionLocalSnapshots",
        headerTooltip: "retentionLocalSnapshots",
        tooltipField: "retentionLocalSnapshots",
        resizable: true,
        editable: true,
      },
      {
        field: "snapvaultSchedule",
        headerName: "snapvaultSchedule",
        headerTooltip: "snapvaultSchedule",
        tooltipField: "snapvaultSchedule",
        resizable: true,
        editable: true,
      },
      {
        field: "retentionPrimarySnapvaultSnapshot",
        headerName: "retentionPrimarySnapvaultSnapshot",
        headerTooltip: "retentionPrimarySnapvaultSnapshot",
        tooltipField: "retentionPrimarySnapvaultSnapshot",
        resizable: true,
        editable: true,
      },
      {
        field: "retentionSecondarySnapvaultSnapshot",
        headerName: "retentionSecondarySnapvaultSnapshot",
        headerTooltip: "retentionSecondarySnapvaultSnapshot",
        tooltipField: "retentionSecondarySnapvaultSnapshot",
        resizable: true,
        editable: true,
      },
      {
        field: "sizeDataGB",
        headerName: "sizeDataGB",
        headerTooltip: "sizeDataGB",
        tooltipField: "sizeDataGB",
        resizable: true,
        editable: true,
      },
      {
        field: "snapReservePrc",
        headerName: "snapReservePrc",
        headerTooltip: "snapReservePrc",
        tooltipField: "snapReservePrc",
        resizable: true,
        editable: true,
      },
      {
        field: "windrive",
        headerName: "windrive",
        headerTooltip: "windrive",
        tooltipField: "windrive",
        resizable: true,
        editable: true,
      },
    ];
  }

  /**
   * Gets the column definitions for the Hosts table.
   */
  private getHostsColumnDefs(): Array<any> {
    return [
      {
        field: "hostname",
        headerName: "hostname",
        headerTooltip: "hostname",
        tooltipField: "hostname",
        resizable: true,
        editable: true,
      },
    ];
  }
}
