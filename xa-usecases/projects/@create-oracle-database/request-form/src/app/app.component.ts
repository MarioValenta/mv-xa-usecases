import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ICERequest, ICERequestContext, FeedbackRequestPayload } from '@xa/lib-ui-common';
import { takeUntil, take, switchMap, first, takeLast } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { DataService } from './data-service.service';
import { ValidationService } from '@xa/validation';

@Component({
  selector: 'create-oracle-database-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements ICERequest, OnInit, OnDestroy {

  @Input() Context: ICERequestContext;
  @ViewChild('customerDropDown') customerDropDown;
  @ViewChild('hostDropDown') hostDropDown;


  form: FormGroup;
  destroy$ = new Subject();

  Customers$: Observable<string[]>;
  SiteBlock$: Observable<string[]>;
  ChangeImplementationWBS$: Observable<string[]>;
  ServiceOperationWBS$: Observable<string[]>;
  Environments$: Observable<string[]>;
  PCAHostnames$: Observable<string[]>;
  ListenerServiceName$: Observable<string[]>;
  DBServiceTypes$: Observable<string[]>;
  ServiceSupportTimeDetails$: Observable<string[]>;
  CMBServices$: Observable<string[]>;
  DBVersion$: Observable<string[]>;
  BuildVersion$: Observable<string[]>;
  DBEdition$: Observable<string[]>;
  Characterset$: Observable<any[]>;
  DBOptions$: Observable<any[]>;
  CompatibleDBVersion$: Observable<string[]>;
  ControlManagementPack$: Observable<string[]>;
  DBBlockSize$: Observable<string[]>;
  ReasonForDBOrder$: Observable<string[]>;
  OracleIds$: Observable<string[]>;
  CMDBFee$: Observable<string[]>;
  ServiceListenerIP$: Observable<string[]>;
  IPRange$: Observable<string[]>;

  UIDnumber: string = null;
  Oinstallgid: string = null;
  Dbagid: string = null;
  customize: string = null;

  generatedDBName = {
    env: '',
    name: '',
    sequence: 0
  }

  option = {
    value: '',
    label: ''
  }

  dropDownConfig: any = {
    selectOnKeydown: true,
    allowAdditions: true,
    hideAdditions: false,
    templates: {
      addition: function (search: string) {
        return search.substring(4)
      }
    }
  };


  isBackupInterfaceAvailableOnHost: boolean = null;


  identifier: string = null;

  _dbOptions = [];
  _controlmanagementpack = [];
  _dbBlockSize = [];
  _defaultValues = [];


  selectedDBVersion = null;

  constructor(private fb: FormBuilder, private dataService: DataService, private validationService: ValidationService) {
    this.Customers$ = this.dataService.GetCustomers();
    this.ReasonForDBOrder$ = this.dataService.GetReasonForDBOrder();

  }

  buildForm() {

    this.form = this.fb.group({
      Customer: [''],
      SiteBlock: [''],
      DBServiceIP: ['no'],
      ChangeImplementationWBS: [''],
      ServiceOperationWBS: [''],
      //DNSName: [{ value: '', disabled: true }],
      //IP: [{ value: '', disabled: true }],
      Environment: [''],
      PCAVMHostname: [''],
      DBEdition: [''],
      DBServiceType: [''],
      ServiceSupportTime: [''],
      ServiceSupportTimeDetails: [''],
      ReasonForDBOrder: [''],
      CMBServices: [{ value: '', disabled: true }],
      DBName: [''],
      DBNameSequence: [''],
      DBName_generated: [''],
      ListenerServiceName: [''],
      DBVersion: [''],
      BuildVersion: [{ value: '', disabled: true }],
      Characterset: [''],
      CompatibleDBVersion: [],
      DBBlockSize: [''],
      ControlManagementPack: [''],
      // not necessary for the camunda proccess
      DBOptions: this.fb.array([]),
      // relevant for the camunda proccess, will be set when the form will be submitted
      selectedDBOptions: [''],
      UIDnumber: [''],
      Oinstallgid: [''],
      Dbagid: [''],
      OracleCustomize: [''],
      BackupDatabase: [{ value: '', disabled: true }],
      RMANBackup: [''],
      CMDBFee: [''],
      MailAddressesShareInformation: [''],
      ServiceListenerIP: [''],
      IPRange: [''],
      //BackupDatabaseDBSGA: [''],
      Agree: ['']
    });
  }

  ngOnInit() {
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
      ? (this.validationService.validatorConfigList.get(elementName).required || this.validationService.validatorConfigList.get(elementName).requiredTrue)
      : false;
  }
  checkChanges() {

    this.form.get('Customer').valueChanges.pipe(
      takeUntil(this.destroy$)).subscribe(
        selectedCustomer => {
          if (selectedCustomer) {
            this.PCAHostnames$ = this.dataService.GetHostname(selectedCustomer);
            this.ChangeImplementationWBS$ = this.dataService.GetChangeImplementationWBS(selectedCustomer);
            this.ServiceOperationWBS$ = this.dataService.GetChangeImplementationWBS(selectedCustomer);
            this.CMBServices$ = this.dataService.GetCMBServices(selectedCustomer);
          }
        })

    this.form.get('ReasonForDBOrder').valueChanges.pipe(
      takeUntil(this.destroy$)).subscribe(
        selectedreason => {
          if (selectedreason == "Migration from existing third-party database service" && this.form.get('PCAVMHostname').value) {
            this.ServiceListenerIP$ = this.dataService.GetServiceListenerIP(this.form.get('PCAVMHostname').value, selectedreason, this.form.get('CMBServices').value)
          }

          if (selectedreason == "Migration from existing T-Systems database service" && this.form.get('PCAVMHostname').value && this.form.get('CMBServices').value) {
            this.ServiceListenerIP$ = this.dataService.GetServiceListenerIP(this.form.get('PCAVMHostname').value, selectedreason, this.form.get('CMBServices').value)
          }

          if (selectedreason == "Migration from existing T-Systems database service" || selectedreason == "Migration from existing third-party database service") {
            this.form.get('DBServiceIP').enable();

            this.form.get('DBServiceIP').patchValue('yes');
            this.form.get('CMBServices').enable();
          } else {
            this.form.get('DBServiceIP').patchValue('no');
            this.form.get('DBServiceIP').disable();
            this.form.get('CMBServices').disable();
          }

          if (selectedreason && this.form.get('DBVersion').value && this.form.get('PCAVMHostname').value) {
            this.DBEdition$ = this.dataService.GetDBEdition(this.form.get('DBVersion').value, this.form.get('PCAVMHostname').value, selectedreason, this.form.get('CMBServices').value);

          }

        }
      )
    this.form.get('DBServiceIP').valueChanges.pipe(
      takeUntil(this.destroy$)).subscribe(
        selectedvalue => {
          if (selectedvalue === "yes") {

            this.form.get('ServiceListenerIP').patchValue(""),
              this.form.get('ServiceListenerIP').enable();
            //   this.form.get('DNSName').patchValue("");
            //   this.form.get('DNSName').enable();
          } else {
            this.form.get('ServiceListenerIP').patchValue(""),
              this.form.get('ServiceListenerIP').disable();
            //   this.form.get('IP').patchValue("");
            //   this.form.get('IP').disable();
            //   this.form.get('DNSName').patchValue("");
            //   this.form.get('DNSName').disable();
          }
        })

    this.form.get('Environment').valueChanges
      .pipe(
        takeUntil(this.destroy$),
        switchMap(selectedValue => {
          this.generatedDBName.env = selectedValue;
          this.updateGeneratedDBNameFormControl();
          this.form.get('BackupDatabase').patchValue('');
          if (this.form.get('PCAVMHostname').value) {
            return this.dataService.IsBackupInterface(this.form.get('PCAVMHostname').value);
          } else {
            this.form.get('BackupDatabase').patchValue('');
          }


        })
      )
      .subscribe(isBackupInterfaceAvailableOnHost => {
        this.checkIfBackupInterfaceIsAvailable(isBackupInterfaceAvailableOnHost);
      });

      this.form.get('BackupDatabase').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value =>{
        if(value == 'yes'){
          this.form.get('RMANBackup').enable();
        }else{
          this.form.get('RMANBackup').disable();

        }
      })

    this.form.get('PCAVMHostname').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedHost => {
        if (selectedHost) {
          this.SiteBlock$ = this.dataService.GetSiteBlock(selectedHost);
          this.Environments$ = this.dataService.GetEnvironments(selectedHost, this.form.get('CMBServices').value);
          this.CMDBFee$ = this.dataService.GetFEE(selectedHost);
          this.CMDBFee$.pipe(takeUntil(this.destroy$)).subscribe(val => {
            this.form.get('CMDBFee').patchValue(val)
          })
          this.IPRange$ = this.dataService.GetIPRange(selectedHost, this.form.get('CMBServices').value);
          this.IPRange$.pipe(takeUntil(this.destroy$)).subscribe(range => {
            this.form.get('IPRange').patchValue(range)
          })
          this.Environments$.pipe(takeUntil(this.destroy$)).subscribe(res => {
            res.forEach(i => {
              if (i["default"]) {
                const val = i["value"]

                this.form.get('Environment').patchValue(val)

              }
            })
          })
          this.DBVersion$ = this.dataService.GetDBVersions(selectedHost, this.form.get('CMBServices').value);
          this.DBVersion$.pipe(takeUntil(this.destroy$)).subscribe(res => {
            res.forEach(i => {
              if (i["default"]) {
                const val = i["value"]

                this.form.get('DBVersion').patchValue(val)

              }
            })
          })
          this.DBBlockSize$ = this.dataService.GetDBBlockSize(selectedHost, this.form.get('CMBServices').value);
          this.DBBlockSize$.pipe(takeUntil(this.destroy$)).subscribe(blocksize => {
            if (selectedHost) {
              this._dbBlockSize = blocksize;
              blocksize.forEach(i => {
                if (i["default"]) {
                  const val = i["value"]

                  this.form.get('DBBlockSize').patchValue(val)

                }
              })

            } else {

              this._dbBlockSize = [];
              this.form.removeControl('DBBlockSize');
            }
          })
          this.Characterset$ = this.dataService.GetCharacterSet(selectedHost, this.form.get('CMBServices').value);
          this.Characterset$.pipe(takeUntil(this.destroy$)).subscribe(res => {
            res.forEach(i => {
              if (i["default"]) {
                const val = i["value"]

                this.form.get('Characterset').patchValue(val)

              }
            })
          })
          this.SiteBlock$.pipe(takeUntil(this.destroy$)).subscribe(siteblock => {
            if (siteblock) {
              this.form.get('SiteBlock').patchValue(siteblock)
            }
          })

          if (this.form.get('ReasonForDBOrder').value == "Migration from existing third-party database service") {
            this.ServiceListenerIP$ = this.dataService.GetServiceListenerIP(selectedHost, this.form.get('ReasonForDBOrder').value, this.form.get('CMBServices').value)
          }

          if (this.form.get('ReasonForDBOrder').value == "Migration from existing T-Systems database service" && this.form.get('CMBServices').value) {
            this.ServiceListenerIP$ = this.dataService.GetServiceListenerIP(selectedHost, this.form.get('ReasonForDBOrder').value, this.form.get('CMBServices').value)
          }

          if (this.form.get('DBVersion').value) {
            this.form.get('BuildVersion').enable();
            this.BuildVersion$ = this.dataService.GetBuildVersions(this.form.get('DBVersion').value, selectedHost, this.form.get('CMBServices').value);
            this.BuildVersion$.pipe(takeUntil(this.destroy$)).subscribe(res => {
              res.forEach(i => {
                if (i["default"]) {
                  const val = i["value"]


                  this.form.get('BuildVersion').patchValue(val)

                }
              })
            })
            this.CompatibleDBVersion$ = this.dataService.GetCompatibleDBVersion(this.form.get('DBVersion').value, selectedHost, this.form.get('CMBServices').value);
            this.CompatibleDBVersion$.pipe(takeUntil(this.destroy$)).subscribe(res => {
              res.forEach(i => {
                if (i["default"]) {
                  const val = i["value"]

                  this.form.get('CompatibleDBVersion').patchValue(val)

                }
              })
            })
          }

          if (this.form.get('DBVersion').value && this.form.get('ReasonForDBOrder').value) {
            this.DBEdition$ = this.dataService.GetDBEdition(this.form.get('DBVersion').value, selectedHost, this.form.get('ReasonForDBOrder').value, this.form.get('CMBServices').value);
            this.DBEdition$.pipe(takeUntil(this.destroy$)).subscribe(res => {

              res.forEach(i => {
                if (i["default"]) {
                  const val = i["value"]

                  this.form.get('DBEdition').patchValue(val)

                }
              })
            })

          }


          if (this.form.get('DBVersion').value && this.form.get('DBEdition').value) {
            this.DBServiceTypes$ = this.dataService.GetDBServiceTypes(this.form.get('DBVersion').value, this.form.get('DBEdition').value, selectedHost, this.form.get('CMBServices').value);
            this.DBServiceTypes$.pipe(takeUntil(this.destroy$)).subscribe(res => {
              res.forEach(i => {
                if (i["default"]) {
                  const val = i["value"]

                  this.form.get('DBServiceType').patchValue(val)

                }
              })
            })

            this.ControlManagementPack$ = this.dataService.GetControlManagementPack(this.form.get('DBVersion').value, this.form.get('DBEdition').value, selectedHost, this.form.get('CMBServices').value);
            this.ControlManagementPack$.pipe(takeUntil(this.destroy$)).subscribe(res => {
              res.forEach(i => {
                if (i["default"]) {
                  const val = i["value"]

                  this.form.get('ControlManagementPack').patchValue(val)

                }
              })
            })

            this.DBOptions$ = this.dataService.GetDBOptions(this.form.get('DBVersion').value, this.form.get('DBEdition').value, selectedHost, this.form.get('CMBServices').value);
            this.DBOptions$.pipe(takeUntil(this.destroy$)).subscribe(dbOptions => {
              if (dbOptions && this.form.get('DBVersion').value) {
                this._dbOptions = dbOptions;

                this.form.removeControl('DBOptions');
                const formControls = dbOptions.map(control => new FormControl(control['default']));
                this.form.addControl('DBOptions', new FormArray(formControls));


              } else {
                this._dbOptions = [];
                this.form.removeControl('DBOptions');
              }
            });
          }

          this.ListenerServiceName$ = this.dataService.GetListenerServiceName(selectedHost, this.form.get('CMBServices').value);

          this.OracleIds$ = this.dataService.GetOracleIds(selectedHost);
          this.OracleIds$.pipe(takeUntil(this.destroy$)).subscribe(res => {
            if (res) {
              res.forEach(i => {

                this.form.get('UIDnumber').patchValue(i["uidnumber"])

                this.form.get('Oinstallgid').patchValue(i["gidoinstall"])
                this.form.get('Dbagid').patchValue(i["giddba"])
                this.form.get('OracleCustomize').patchValue(i["customize"])

                this.UIDnumber = i["uidnumber"]

                this.Oinstallgid = i["gidoinstall"]
                this.Dbagid = i["giddba"]
                this.customize = i["customize"]

              })

              if (this.customize === 'no') {
                this.checkiFdisabledcustomizeIsTrue(false)
              } if (this.customize === 'yes') {
                this.checkiFdisabledcustomizeIsTrue(true)
              }


            }
          })
        }
        if (!selectedHost) {
          this.form.get('SiteBlock').patchValue("");
          this.form.get('Environment').patchValue("");
          this.form.get('DBVersion').patchValue("");
          this.form.get('CompatibleDBVersion').patchValue("");
          this.form.get('Characterset').patchValue("");
          this.form.get('BuildVersion').patchValue("");
          this.form.get('DBEdition').patchValue("");
          this.form.get('DBBlockSize').patchValue("");
          this.form.get('DBServiceType').patchValue("");

          this.form.get('UIDnumber').patchValue("");
          this.form.get('Oinstallgid').patchValue("");
          this.form.get('Dbagid').patchValue("");
        }

      });



    this.form.get('OracleCustomize').valueChanges
      .pipe(takeUntil(this.destroy$)).subscribe(val => {

        if (val == 'no' && this.form.get('PCAVMHostname').value && this.UIDnumber && this.Oinstallgid && this.Dbagid && this.customize) {


          this.form.get('UIDnumber').patchValue(this.UIDnumber);
          this.form.get('Oinstallgid').patchValue(this.Oinstallgid);
          this.form.get('Dbagid').patchValue(this.Dbagid);


        }
      });



    this.form.get('PCAVMHostname').valueChanges
      .pipe(takeUntil(this.destroy$),
        switchMap(val => {
          return this.dataService.IsBackupInterface(this.form.get('PCAVMHostname').value);
        })
      ).subscribe(isBackupInterfaceAvailableOnHost => {
        this.checkIfBackupInterfaceIsAvailable(isBackupInterfaceAvailableOnHost);
      });


    this.form.get('CMBServices').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedService => {
        if (selectedService && this.form.get('PCAVMHostname').value) {
          this.DBVersion$ = this.dataService.GetDBVersions(this.form.get('PCAVMHostname').value, selectedService);
          this.IPRange$ = this.dataService.GetIPRange(this.form.get('PCAVMHostname').value, selectedService);
          this.IPRange$.pipe(takeUntil(this.destroy$)).subscribe(range => {
            this.form.get('IPRange').patchValue(range)
          })
          this.DBVersion$.pipe(takeUntil(this.destroy$)).subscribe(res => {
            res.forEach(i => {
              if (i["default"]) {
                const val = i["value"]

                this.form.get('DBVersion').patchValue(val)

              }
            })
          })
          this.DBBlockSize$ = this.dataService.GetDBBlockSize(this.form.get('PCAVMHostname').value, selectedService);
          this.DBBlockSize$.pipe(takeUntil(this.destroy$)).subscribe(res => {
            res.forEach(i => {
              if (i["default"]) {
                const val = i["value"]

                this.form.get('DBBlockSize').patchValue(val)

              }
            })
          })
          this.Characterset$ = this.dataService.GetCharacterSet(this.form.get('PCAVMHostname').value, selectedService);
          this.Characterset$.pipe(takeUntil(this.destroy$)).subscribe(res => {
            res.forEach(i => {
              if (i["default"]) {
                const val = i["value"]

                this.form.get('Characterset').patchValue(val)

              }
            })
          })

          this.ListenerServiceName$ = this.dataService.GetListenerServiceName(this.form.get('PCAVMHostname').value, selectedService);
          this.ListenerServiceName$.pipe(takeUntil(this.destroy$)).subscribe(res => {
            res.forEach(i => {
              if (i["default"]) {
                const val = i["value"]

                this.form.get('ListenerServiceName').patchValue(val)

              }
            })
          })
          this.Environments$ = this.dataService.GetEnvironments(this.form.get('PCAVMHostname').value, selectedService);
          this.Environments$.pipe(takeUntil(this.destroy$)).subscribe(res => {
            res.forEach(i => {
              if (i["default"]) {
                const val = i["value"]

                this.form.get('Environments').patchValue(val)

              }
            })
          })

        }

        if (this.form.get('ReasonForDBOrder').value && this.form.get('PCAVMHostname').value, selectedService) {
          this.ServiceListenerIP$ = this.dataService.GetServiceListenerIP(this.form.get('PCAVMHostname').value, this.form.get('ReasonForDBOrder').value, selectedService)
        }

        if (selectedService && this.form.get('DBVersion').value && this.form.get('PCAVMHostname').value) {
          this.form.get('BuildVersion').enable();
          this.BuildVersion$ = this.dataService.GetBuildVersions(this.form.get('DBVersion').value, this.form.get('PCAVMHostname').value, selectedService);
          this.BuildVersion$.pipe(takeUntil(this.destroy$)).subscribe(res => {
            res.forEach(i => {
              if (i["default"]) {
                const val = i["value"]

                this.form.get('BuildVersion').patchValue(val)

              }
            })
          })


          this.CompatibleDBVersion$ = this.dataService.GetCompatibleDBVersion(this.form.get('DBVersion').value, this.form.get('PCAVMHostname').value, selectedService);
          this.CompatibleDBVersion$.pipe(takeUntil(this.destroy$)).subscribe(res => {

            res.forEach(i => {
              if (i["default"]) {
                const val = i["value"]

                this.form.get('CompatibleDBVersion').patchValue(val)

              }
            })
          })

        }

        if (selectedService && this.form.get('DBVersion').value && this.form.get('PCAVMHostname').value && this.form.get('ReasonForDBOrder').value) {
          this.DBEdition$ = this.dataService.GetDBEdition(this.form.get('DBVersion').value, this.form.get('PCAVMHostname').value, this.form.get('ReasonForDBOrder').value, selectedService);
          this.DBEdition$.pipe(takeUntil(this.destroy$)).subscribe(res => {
            res.forEach(i => {
              if (i["default"]) {
                const val = i["value"]

                this.form.get('DBEdition').patchValue(val)

              }
            })
          })

        }


        if (selectedService && this.form.get('DBVersion').value && this.form.get('DBEdition').value && this.form.get('PCAVMHostname').value) {
          this.DBServiceTypes$ = this.dataService.GetDBServiceTypes(this.form.get('DBVersion').value, this.form.get('DBEdition').value, this.form.get('PCAVMHostname').value, selectedService);
          this.DBServiceTypes$.pipe(takeUntil(this.destroy$)).subscribe(res => {
            res.forEach(i => {
              if (i["default"]) {
                const val = i["value"]

                this.form.get('DBServiceType').patchValue(val)

              }
            })
          })
          this.ControlManagementPack$ = this.dataService.GetControlManagementPack(this.form.get('DBVersion').value, this.form.get('DBEdition').value, this.form.get('PCAVMHostname').value, selectedService);
          this.ControlManagementPack$.pipe(takeUntil(this.destroy$)).subscribe(res => {
            res.forEach(i => {
              if (i["default"]) {
                const val = i["value"]

                this.form.get('ControlManagementPack').patchValue(val)

              }
            })
          })
        }

      })


    this.form.get('DBEdition').valueChanges
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(edition => {
        if (edition) {
          this.DBServiceTypes$ = this.dataService.GetDBServiceTypes(this.form.get('DBVersion').value, edition, this.form.get('PCAVMHostname').value, this.form.get('CMBServices').value);
          this.DBServiceTypes$.pipe(takeUntil(this.destroy$)).subscribe(res => {
            res.forEach(i => {
              if (i["default"]) {
                const val = i["value"]

                this.form.get('DBServiceType').patchValue(val)

              }
            })
          })


          this.DBOptions$ = this.dataService.GetDBOptions(this.form.get('DBVersion').value, edition, this.form.get('PCAVMHostname').value, this.form.get('CMBServices').value);

          this.DBOptions$.pipe(takeUntil(this.destroy$)).subscribe(dbOptions => {
            if (dbOptions && this.form.get('DBVersion').value) {
              this._dbOptions = dbOptions;

              this.form.removeControl('DBOptions');
              const formControls = dbOptions.map(control => new FormControl(control['default']));
              this.form.addControl('DBOptions', new FormArray(formControls));


            } else {
              this._dbOptions = [];
              this.form.removeControl('DBOptions');
            }
          });

          this.ControlManagementPack$ = this.dataService.GetControlManagementPack(this.form.get('DBVersion').value, edition, this.form.get('PCAVMHostname').value, this.form.get('CMBServices').value);

          this.ControlManagementPack$.pipe(takeUntil(this.destroy$)).subscribe(ctrlm => {
            if (this.form.get('DBVersion').value) {
              this._controlmanagementpack = ctrlm;
              ctrlm.forEach(i => {
                if (i["default"]) {
                  const val = i["value"]

                  this.form.get('ControlManagementPack').patchValue(val)

                }
              })

              if (edition == "Standard Edition 2") {
                this.form.get('ControlManagementPack').patchValue('NONE');
              }
            }

            else {
              this.form.get('ControlManagementPack').patchValue('')
              this._dbOptions = [];
              this.form.removeControl('DBOptions');
              this._controlmanagementpack = [];
              this.form.removeControl('ControlManagementPack');
            }
          })
        }
      });



    this.form.get('ServiceSupportTime').valueChanges
      .pipe(
        takeUntil(this.destroy$),
        switchMap(value => this.ServiceSupportTimeDetails$ = this.dataService.GetServiceTimeDetails(value))
      )
      .subscribe(value => {

      }
      );

    this.form.get('DBName').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.generatedDBName.name = val;
        this.updateGeneratedDBNameFormControl();

      });

    this.form.get('DBNameSequence').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.generatedDBName.sequence = val;
        this.updateGeneratedDBNameFormControl();

      });

    this.form.get('DBVersion').valueChanges
      .pipe(
        takeUntil(this.destroy$)).subscribe(dbVersion => {

          if (dbVersion && this.form.get('PCAVMHostname').value) {
            this.BuildVersion$ = this.dataService.GetBuildVersions(dbVersion, this.form.get('PCAVMHostname').value, this.form.get('CMBServices').value);
            this.form.get('BuildVersion').enable();
            this.BuildVersion$.pipe(takeUntil(this.destroy$)).subscribe(res => {
              res.forEach(i => {
                if (i["default"]) {
                  const val = i["value"]

                  this.form.get('BuildVersion').patchValue(val)

                }
              })
            })

            this.CompatibleDBVersion$ = this.dataService.GetCompatibleDBVersion(dbVersion, this.form.get('PCAVMHostname').value, this.form.get('CMBServices').value);
            this.CompatibleDBVersion$.pipe(takeUntil(this.destroy$)).subscribe(res => {

              res.forEach(i => {
                if (i["default"]) {
                  const val = i["value"]

                  this.form.get('CompatibleDBVersion').patchValue(val)

                }
              })
            })

          }
          if (dbVersion && this.form.get('PCAVMHostname').value && this.form.get('ReasonForDBOrder').value) {
            this.DBEdition$ = this.dataService.GetDBEdition(dbVersion, this.form.get('PCAVMHostname').value, this.form.get('ReasonForDBOrder').value, this.form.get('CMBServices').value);
            this.DBEdition$.pipe(takeUntil(this.destroy$)).subscribe(res => {
              res.forEach(i => {
                if (i["default"]) {
                  const val = i["value"]

                  this.form.get('DBEdition').patchValue(val)

                }
              })
            })
          }
          if (dbVersion && this.form.get('DBEdition').value && this.form.get('PCAVMHostname').value) {

            this.ControlManagementPack$ = this.dataService.GetControlManagementPack(dbVersion, this.form.get('DBEdition').value, this.form.get('DBVersion').value, this.form.get('CMBServices').value);
            this.ControlManagementPack$.pipe(takeUntil(this.destroy$)).subscribe(ctrlm => {
              if (this.form.get('DBVersion').value) {
                this._controlmanagementpack = ctrlm;
                ctrlm.forEach(i => {
                  if (i["default"]) {
                    const val = i["value"]

                    this.form.get('ControlManagementPack').patchValue(val)

                  }
                })
              }
            })
            this.DBOptions$ = this.dataService.GetDBOptions(dbVersion, this.form.get('DBEdition').value, this.form.get('PCAVMHostname').value, this.form.get('CMBServices').value);

            this.DBOptions$.pipe(takeUntil(this.destroy$)).subscribe(dbOptions => {
              if (dbOptions && this.form.get('DBVersion').value) {
                this._dbOptions = dbOptions;
                this.form.removeControl('DBOptions');
                const formControls = dbOptions.map(control => new FormControl(control['default']));
                this.form.addControl('DBOptions', new FormArray(formControls));


              } else {
                this._dbOptions = [];
                this.form.removeControl('DBOptions');
              }
            });

            this.DBServiceTypes$ = this.dataService.GetDBServiceTypes(dbVersion, this.form.get('DBEdition').value, this.form.get('PCAVMHostname').value, this.form.get('CMBServices').value);
            this.DBServiceTypes$.pipe(takeUntil(this.destroy$)).subscribe(res => {
              res.forEach(i => {
                if (i["default"]) {
                  const val = i["value"]

                  this.form.get('DBServiceType').patchValue(val)

                }
              })
            })

          }
          if (!dbVersion) {
            this.form.get('BuildVersion').patchValue('');
            this.form.get('BuildVersion').disable();
            this.form.get('DBEdition').patchValue('');
            this.form.get('DBServiceType').patchValue('');
            this.form.get('ControlManagementPack').patchValue('');
            this._dbOptions = [];
            this.form.removeControl('DBOptions')
          }
        })

    //   this.form.get('DBServiceType').valueChanges
    //     .pipe(takeUntil(this.destroy$)).subscribe(service => {
    //       if (service) {
    //         this.CMDBFee$ = this.dataService.GetFEE(service);
    //         this.CMDBFee$.pipe(takeUntil(this.destroy$)).subscribe(val => {
    //           this.form.get('CMDBFee').patchValue(val)
    //         })
    //       }

    //     })
  }
  updateForm = new FormGroup({})
  getListOfDBOptions() {
    return this.form.get('DBOptions').value
      .map((checked, index) => checked ? this._dbOptions[index] : true)
      .filter(value => value !== true);
  }

  checkIfBackupInterfaceIsAvailable(isBackupInterfaceAvailableOnHost) {
    if (this.form.get('Environment').value && this.form.get('PCAVMHostname').value) {
      this.isBackupInterfaceAvailableOnHost = isBackupInterfaceAvailableOnHost;
      this.form.get('BackupDatabase').enable();
      this.form.get('BackupDatabase').patchValue('');
    } else {
      this.form.get('BackupDatabase').patchValue('');
      this.form.get('BackupDatabase').disable();
    }
  }

  checkiFdisabledcustomizeIsTrue(disabledcustomize) {

    if (disabledcustomize == true) {

      this.form.get('OracleCustomize').enable();
    } else {

      this.form.get('OracleCustomize').disable();
    }
  }
  updateGeneratedDBNameFormControl() {
    if (this.form.get('Environment').value && this.form.get('DBName').value
      && this.form.get('DBNameSequence').value !== null
      && this.form.get('DBNameSequence').value !== '') {
      this.dataService.GetEnvironmentMapping(this.form.get('Environment').value)
        .pipe(take(1))
        .subscribe(val => {
          const name = val['code'] + this.generatedDBName.name + this.generatedDBName.sequence;
          this.form.get('DBName_generated').setValue(name.toUpperCase());
        });
    } else {
      this.form.get('DBName_generated').setValue('');
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  get dbOptions() {
    return this.form.get('DBOptions') as FormArray;
  }

  get ctrlm() {
    return this.form.get('ControlManagementPack') as FormArray;
  }
  CustomerSelected() {
    this.identifier = this.customerDropDown.ref.nativeElement.querySelector('.text').innerHTML;
  }

  HostSelected() {
    this.identifier = this.hostDropDown.ref.nativeElement.querySelector('.text').innerHTML;
  }


  getPlaceholderFromConfigPayload(formElement: string): string {
    return this.Context.ConfigPayload.Placeholders ?
      this.Context.ConfigPayload.Placeholders[formElement] : 'enter ' + formElement + '...'
  }


  public SubmitForm() {
    if (this.form.valid && this.identifier) {
      console.debug(this.form);
      console.debug(this.form.value);
      // set the selected DBOptions to a new variable
      this.form.get('selectedDBOptions').patchValue(this.getListOfDBOptions());


    } else {
      console.error('Form is not valid', this.form);
    }

    const model = this.form.value;

    // removes the DBOptions boolean array
    // selectedDPObtions contains the selected options
    delete model.DBOptions;


    return {
      value: model,
      identifier: `${this.identifier}`
    };
  }

  Feedback(): FeedbackRequestPayload {
    return this.form.value;
  }
}
