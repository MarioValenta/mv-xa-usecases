import { Component, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackRequestPayload, ICERequest, ICERequestContext } from '@xa/lib-ui-common';
import { ValidationService } from '@xa/validation';
import { RequiredPipe } from 'projects/@create-rfc/shared/pure-pipes/required.pipe';
import { getDate, getFlatpickrSettings } from 'projects/shared.functions';
import { FlatpickrOptions, Ng2FlatpickrComponent } from 'projects/shared/ng2-flatpickr/ng2-flatpickr.module';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DataService } from './data.service';
import { IAssignmentGroupDTO } from './dto/AssignmentGroup';
import { RequestForChangeService } from './request-for-change.service';


@Component({
  selector: 'create-rfc-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements ICERequest, OnInit, OnDestroy {

  @Input() public Context: ICERequestContext;

  form: FormGroup;
  Customers$ = this.data.GetCustomers();
  destroy$ = new Subject<any>();
  RequestedFrom: Array<string> = ['internal', 'customer'];
  requiredPipe: RequiredPipe = new RequiredPipe;

  linkForDeliveryTeams = "https://share.t-systems.ch/alpine/de-esc/Lists/Delivery%20relevant%20teams/AllItems.aspx";

  latestStart = getDate(1);
  latestEnd = null;
  loaded = false;

  attachments: File[] = [];
  @ViewChild('customerDropDown') customerDropDown;
  @ViewChild('startPicker') latestStartpicker;
  @ViewChild('endPicker') latestEndpicker;
  @ViewChild('maintenanceWindowStartPicker') maintenanceWindowStartPicker;
  @ViewChild('maintenanceWindowEndPicker') maintenanceWindowEndPicker;
  @ViewChildren('startTaskPicker') startTaskPicker: QueryList<Ng2FlatpickrComponent>;
  @ViewChildren('endTaskPicker') endTaskPicker: QueryList<Ng2FlatpickrComponent>;

  startOptions: FlatpickrOptions = getFlatpickrSettings({ minDate: getDate(1) });
  endOptions: FlatpickrOptions = getFlatpickrSettings({ minDate: getDate(2) });

  startMWOptions: FlatpickrOptions = getFlatpickrSettings({ minDate: getDate(1) });
  endMWOptions: FlatpickrOptions = getFlatpickrSettings({ minDate: getDate(2) });

  startGroupOptions: FlatpickrOptions = getFlatpickrSettings({ minDate: getDate(1) });
  endGroupOptions: FlatpickrOptions = getFlatpickrSettings({ minDate: getDate(2) });

  constructor(
    private fb: FormBuilder,
    private data: DataService,
    public rfcService: RequestForChangeService,
    private validationService: ValidationService
  ) { }

  BuildForm() {
    this.form = this.fb.group({
      Customer: [''],
      CustomerSM9Name: [''],
      RequestedFrom: [''],
      Title: [''],
      CIs: [[]],
      NewCICheckBox: [false],
      ChangeDescriptionTextArea: [''],
      ChangeValidation: [''],
      ChangeValidationTextArea: [
        { value: '', disabled: 'true' }
      ],
      ChangeBackout: [''],
      ChangeBackoutTextArea: [
        { value: '', disabled: 'true' }
      ],
      ChangeImpact: [''],
      LowPeakPeriodCheckBox: [false],
      NoServiceTimeCheckBox: [false],
      RegularMaintenanceCheckBox: [false],
      ChangeImpactTextArea: [
        { value: '', disabled: 'true' }
      ],
      Rating: [
        { value: '', disabled: 'true' }
      ],
      RiskOfOmission: [''],
      RiskOfOmissionTextArea: [
        { value: '', disabled: 'true' }
      ],
      RiskOfImplementation: [''],
      RiskOfImplementationTextArea: [
        { value: '', disabled: 'true' }
      ],
      CauseOfChange: [''],
      CauseOfChangeTextArea: [
        { value: '', disabled: 'true' }
      ],
      TargetOfChange: [''],
      TargetOfChangeTextArea: [
        { value: '', disabled: 'true' }
      ],
      KnowAboutRequiredTeamsRadio: [''],
      ChangeCoordinationCheck: [false],
      ImplementerTeamsKnowCheckBox: [false],
      LatestStart: [''],
      LatestEnd: [''],
      MaintenanceRequiredCheckBox: [false],
      MaintenanceWindowStart: [{ value: '', disabled: 'true' }],
      MaintenanceWindowEnd: [{ value: '', disabled: 'true' }],
      Attachments: [[]],
      MailAddressesShareInformation: [''],
      ConfirmationCheckBox: [false],
      AccountResponsibleCheckBox: [false],
      BehalfOfAccountResponsibleCheckBox: [false],
      AccountResponsible: [{ value: '', disabled: 'true' }]
    });
  }

  createAssignmentGroupPayload(assignmentGroup: IAssignmentGroupDTO): FormGroup {
    if (assignmentGroup) {
      return this.fb.group({
        AssignmentGroup: [assignmentGroup.AssignmentGroup, Validators.required],
      })
    }
  }

  createAssignmentGroup(): FormGroup {
    return this.fb.group({
      AssignmentGroup: ['', Validators.required]
    });
  }

  createAssignmentGroupDetailPayload(assignmentGroup: IAssignmentGroupDTO): FormGroup {

    if (assignmentGroup) {
      return this.fb.group({
        AssignmentGroup: [assignmentGroup.AssignmentGroup, Validators.required],
        TitleTask: [assignmentGroup.TitleTask, Validators.compose([Validators.required, Validators.pattern(/^(?!\s*$).+/)])],
        StartTask: [assignmentGroup.StartTask, Validators.required],
        EndTask: [assignmentGroup.EndTask, Validators.required]
      });
    }
  }

  createAssignmentGroupDetail(): FormGroup {

    const latestStartPlusOne = new Date(this.latestStart);
    latestStartPlusOne.setHours(this.latestStart.getHours() + 1);
    let latestEndMinusOne;
    if (this.latestEnd) {
      latestEndMinusOne = new Date(this.latestEnd);
      latestEndMinusOne.setHours(this.latestEnd.getHours() - 1);
    }

    this.startGroupOptions.minDate = this.latestStart;
    this.startGroupOptions.maxDate = latestEndMinusOne ? this.latestEnd : null;
    this.endGroupOptions.minDate = latestStartPlusOne;
    this.endGroupOptions.maxDate = this.latestEnd ? this.latestEnd : null;


    return this.fb.group({
      AssignmentGroup: ['', Validators.required],
      TitleTask: ['', Validators.compose([Validators.required, Validators.pattern(/^(?!\s*$).+/)])],
      StartTask: ['', Validators.required],
      EndTask: ['', Validators.required]
    });

  }

  get assignmentGroups() {
    return this.form.get('AssignmentGroups') as FormArray;
  }

  ngOnInit() {
    this.BuildForm();

    if (this.Context.Validation.requestForm) {
      this.validationService.setValidatorsFromConfig(this.form, this.Context.Validation.requestForm);
    }

    if (this.Context.ConfigPayload['linkForDeliveryTeams']) {
      this.linkForDeliveryTeams = this.Context.ConfigPayload['linkForDeliveryTeams'];
    }

    this.form.statusChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(status => this.Context.Valid = status
    );

    this.Context.OnSubmit(() => this.Submit());
    this.Context.OnFeedback(() => this.Feedback())

    this.createValueChangeListener();

    this.patchValuesFromPayload();
    this.loaded = true;

    this.createDropDownValueChangeListener();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  patchValuesFromPayload() {

    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload);
    }

    if (this.Context.Payload.AssignmentGroups) {

      this.form.addControl('AssignmentGroups', this.fb.array([]));

      // removes first empty row
      this.assignmentGroups.removeAt(0);

      if (this.form.get('KnowAboutRequiredTeamsRadio').value === 'detailed') {
        this.Context.Payload.AssignmentGroups.forEach((element: IAssignmentGroupDTO) => {
          this.assignmentGroups.push(this.createAssignmentGroupDetailPayload(element));
        });
        this.onValueChangesFlatPicker();
      } else if (this.form.get('KnowAboutRequiredTeamsRadio').value === 'true') {
        this.Context.Payload.AssignmentGroups.forEach((element: IAssignmentGroupDTO) => {
          this.assignmentGroups.push(this.createAssignmentGroupPayload(element));
        });
      }
    }
  }

  updateFormControlElement(dropDownName: string, textAreaName: string, data: any): void {

    if (this.Context.Payload[dropDownName] && this.Context.Payload[textAreaName]) {

      this.form.get(textAreaName).enable();
      this.form.get(textAreaName).patchValue(this.Context.Payload[textAreaName]);
      delete this.Context.Payload[dropDownName];
      delete this.Context.Payload[textAreaName];
      this.form.get(textAreaName).markAsDirty();
    }
    else if (data === 'OTHER') {
      this.form.get(textAreaName).enable();
      this.form.get(textAreaName).patchValue('');
      this.form.get(textAreaName).markAsDirty();
    } else {
      this.form.get(textAreaName).enable();
      this.form.get(textAreaName).patchValue(data);
      this.form.get(textAreaName).markAsDirty();
    }

  }

  patchFormControlElementFromPayload(dropDownName: string, textAreaName: string): void {

    if (this.Context.Payload[dropDownName]) {
      this.form.get(textAreaName).enable();
      this.form.get(dropDownName).patchValue(this.Context.Payload[dropDownName], { emitEvent: false, onlySelf: true });
      this.form.get(textAreaName).patchValue(this.Context.Payload[textAreaName]);
      this.form.get(textAreaName).markAsDirty();
    }
  }

  createDropDownValueChangeListener() {
    this.form.get('ChangeValidation').valueChanges.subscribe(data => {
      this.updateFormControlElement('ChangeValidation', 'ChangeValidationTextArea', data);
    });

    this.form.get('ChangeBackout').valueChanges.subscribe(data => {
      this.updateFormControlElement('ChangeBackout', 'ChangeBackoutTextArea', data);
    });

    this.form.get('ChangeImpact').valueChanges.subscribe(data => {
      this.updateFormControlElement('ChangeImpact', 'ChangeImpactTextArea', data);

      if (data !== 'OTHER') {

        this.form.get('Rating').disable();

        if (this.Context.Payload['Rating']) {
          delete this.Context.Payload['Rating'];
        }

        // Not ideal - refarctoring possible. Looking for the object's rating that has the same content as the one chosen in the selectbox.
        let rating = this.rfcService.Impact.filter(
          element => element.content === data
        )[0].rating;
        rating =
          this.form.get('LowPeakPeriodCheckBox').value ||
            this.form.get('NoServiceTimeCheckBox').value ||
            this.form.get('RegularMaintenanceCheckBox').value
            ? this.rfcService.getRatingMinusValue(rating, 1)
            : rating;
        this.form.get('Rating').setValue(rating);
        this.form.get('Rating').markAsDirty();
      } else {
        this.form.get('Rating').enable();

        if (this.Context.Payload['Rating']) {
          this.form.get('Rating').setValue(this.Context.Payload['Rating']);
          delete this.Context.Payload['Rating'];
        } else {
          this.form.get('Rating').setValue('NONE');
        }

      }
    });

    this.form.get('RiskOfOmission').valueChanges.subscribe(data => {
      this.updateFormControlElement('RiskOfOmission', 'RiskOfOmissionTextArea', data);
    });

    this.form.get('RiskOfImplementation').valueChanges.subscribe(data => {
      this.updateFormControlElement('RiskOfImplementation', 'RiskOfImplementationTextArea', data);
    });

    this.form.get('CauseOfChange').valueChanges.subscribe(data => {
      this.updateFormControlElement('CauseOfChange', 'CauseOfChangeTextArea', data);
    });

    this.form.get('TargetOfChange').valueChanges.subscribe(data => {
      this.updateFormControlElement('TargetOfChange', 'TargetOfChangeTextArea', data);
    });
  }

  setValueOfRating(data: any) {
    if (data === true) {
      this.form
        .get('Rating')
        .setValue(
          this.rfcService.getRatingMinusValue(
            this.form.get('Rating').value,
            1
          )
        );
    } else {
      const rating = this.rfcService.Impact.filter(
        element => element.content === this.form.get('ChangeImpact').value
      )[0].rating;
      this.form.get('Rating').setValue(rating);
    }
  }

  createValueChangeListener() {

    this.form.get('LowPeakPeriodCheckBox').valueChanges.subscribe(data => {
      if (
        this.form.get('ChangeImpact').value &&
        !this.form.get('NoServiceTimeCheckBox').value &&
        !this.form.get('RegularMaintenanceCheckBox').value
      ) {
        this.setValueOfRating(data);
      }
    });

    this.form.get('NoServiceTimeCheckBox').valueChanges.subscribe(data => {
      if (
        this.form.get('ChangeImpact').value &&
        !this.form.get('LowPeakPeriodCheckBox').value &&
        !this.form.get('RegularMaintenanceCheckBox').value
      ) {
        this.setValueOfRating(data);
      }
    });

    this.form.get('RegularMaintenanceCheckBox').valueChanges.subscribe(data => {
      if (
        this.form.get('ChangeImpact').value &&
        !this.form.get('NoServiceTimeCheckBox').value &&
        !this.form.get('LowPeakPeriodCheckBox').value
      ) {
        this.setValueOfRating(data);
      }
    });

    this.form.get('LatestStart').valueChanges.subscribe(data => {
      if (data) {
        this.latestStart = new Date(data);
        const latestStartPlusOne = new Date(data);
        latestStartPlusOne.setHours(this.latestStart.getHours() + 1);
        this.latestEndpicker.flatpickr.set({ minDate: latestStartPlusOne });
        this.startMWOptions.minDate = this.latestStart;
        if (this.maintenanceWindowStartPicker) {
          this.maintenanceWindowStartPicker.flatpickr.set({ minDate: this.latestStart });
        }
        this.endMWOptions.minDate = latestStartPlusOne;
        if (this.maintenanceWindowEndPicker) {
          this.maintenanceWindowEndPicker.flatpickr.set({ minDate: latestStartPlusOne });
        }
        //this.endTaskPicker.forEach(element => { element.minDate = new Date(data).setHours(this.latestStart.getHours()); });
        this.setDatePickers();
      }
    });

    this.form.get('LatestEnd').valueChanges.subscribe(data => {
      if (data) {
        this.latestEnd = new Date(data);
        const latestEndMinusOne = new Date(data);
        latestEndMinusOne.setHours(this.latestEnd.getHours() - 1);
        this.latestStartpicker.flatpickr.set({ maxDate: latestEndMinusOne });
        this.endMWOptions.maxDate = this.latestEnd;
        if (this.maintenanceWindowEndPicker) {
          this.maintenanceWindowEndPicker.flatpickr.set({ maxDate: this.latestEnd });
        }
        this.startMWOptions.maxDate = latestEndMinusOne;
        if (this.maintenanceWindowStartPicker) {
          this.maintenanceWindowStartPicker.flatpickr.set({ maxDate: latestEndMinusOne });
        }
        //this.startTaskPicker.forEach(element => { element.maxDate = new Date(data).setHours(this.latestStart.getHours()); });
        this.setDatePickers();
      }
    });

    this.form
      .get('MaintenanceRequiredCheckBox')
      .valueChanges.subscribe(data => {
        if (data) {
          this.form.get('MaintenanceWindowStart').enable();
          this.form.get('MaintenanceWindowEnd').enable();
        } else {
          this.form.get('MaintenanceWindowStart').patchValue('');
          this.form.get('MaintenanceWindowStart').disable();
          this.form.get('MaintenanceWindowEnd').patchValue('');
          this.form.get('MaintenanceWindowEnd').disable();
        }
      });


    this.form.get('MaintenanceWindowStart').valueChanges.subscribe(data => {
      if (data) {
        const newMin = new Date(data);
        newMin.setHours(newMin.getHours() + 1);
        this.maintenanceWindowEndPicker.flatpickr.set({ minDate: newMin });
      }
    });

    this.form.get('MaintenanceWindowEnd').valueChanges.subscribe(data => {
      if (data) {
        const newMax = new Date(data);
        newMax.setHours(newMax.getHours() - 1);
        this.maintenanceWindowStartPicker.flatpickr.set({ maxDate: newMax });
      }
    });

    this.form.get('KnowAboutRequiredTeamsRadio').valueChanges.subscribe(requiredTeams => {
      if (requiredTeams === 'detailed') {
        this.form.removeControl('AssignmentGroups');
        this.form.addControl('AssignmentGroups', this.fb.array([this.createAssignmentGroupDetail()]));

        this.onValueChangesFlatPicker();

      } else if (requiredTeams === 'true') {
        this.form.removeControl('AssignmentGroups');
        this.form.addControl('AssignmentGroups', this.fb.array([this.createAssignmentGroup()]));
      } else {
        this.form.removeControl('AssignmentGroups');
      }
    });

    this.form.get('AccountResponsibleCheckBox').valueChanges.subscribe(data => {
      if (data) {
        this.form.get('BehalfOfAccountResponsibleCheckBox').setValue(false);
      }
    });

    this.form.get('BehalfOfAccountResponsibleCheckBox').valueChanges.subscribe(data => {
      if (data) {
        this.form.get('AccountResponsibleCheckBox').setValue(false);
        this.form.get('AccountResponsible').enable();
      } else {
        this.form.get('AccountResponsible').disable();
      }
    });
  }

  CustomerSelected() {

    if (this.form.get('CustomerSM9Name').value) {
      this.form
        .get('Customer')
        .setValue(
          this.customerDropDown.ref.nativeElement.querySelector('.text').innerHTML
        );
    } else {
      this.form
        .get('Customer')
        .setValue(null);
      this.form.get('Customer').markAsDirty();
    }
  }

  addAssignmentGroup() {
    if (this.form.get('KnowAboutRequiredTeamsRadio').value === 'detailed') {
      this.assignmentGroups.push(this.createAssignmentGroupDetail());

      this.onValueChangesFlatPicker();

    } else if (this.form.get('KnowAboutRequiredTeamsRadio').value === 'true') {
      this.assignmentGroups.push(this.createAssignmentGroup());
    }
  }

  onValueChangesFlatPicker() {
    this.assignmentGroups.controls.forEach(
      control => {
        control.get('StartTask').valueChanges.subscribe(
          data => {
            this.endTaskPicker.toArray()[this.assignmentGroups.controls.indexOf(control)].minDate = new Date(data).setHours(new Date(data).getHours() + 1);
          }
        );
        control.get('EndTask').valueChanges.subscribe(
          data => {
            this.startTaskPicker.toArray()[this.assignmentGroups.controls.indexOf(control)].maxDate = new Date(data).setHours(new Date(data).getHours() - 1);
          }
        );
      }
    );
  }

  setDatePickers() {

    if (this.assignmentGroups && (this.form.get('KnowAboutRequiredTeamsRadio').value === 'detailed')) {
      this.assignmentGroups.controls.forEach(
        control => {
          if (this.latestEnd !== null) {
            if (control.get('StartTask').value < this.latestStart || control.get('StartTask').value > this.latestEnd) {
              control.get('StartTask').patchValue('');
            }
            if (control.get('EndTask').value < this.latestStart || control.get('EndTask').value > this.latestEnd) {
              control.get('EndTask').patchValue('');
            }
          }
        });
    }
    const latestStartPlusOne = new Date(this.latestStart);
    latestStartPlusOne.setHours(this.latestStart.getHours() + 1);
    let latestEndMinusOne;
    if (this.latestEnd) {
      latestEndMinusOne = new Date(this.latestEnd);
      latestEndMinusOne.setHours(this.latestEnd.getHours() - 1);
    }

    this.startTaskPicker.forEach(element => { element.minDate = this.latestStart; element.maxDate = this.latestEnd ? latestEndMinusOne : null; });
    this.endTaskPicker.forEach(element => { element.minDate = latestStartPlusOne; element.maxDate = this.latestEnd ? this.latestEnd : null; });

    this.checkDateBounds();

    this.form.get('MaintenanceWindowStart').updateValueAndValidity();
    this.form.get('MaintenanceWindowEnd').updateValueAndValidity();
  }

  checkDateBounds() {
    if (this.form.get('MaintenanceWindowStart').value < this.latestStart
      || this.form.get('MaintenanceWindowStart').value > this.latestEnd) {
      this.form.get('MaintenanceWindowStart').patchValue('');
    }

    if (this.form.get('MaintenanceWindowEnd').value < this.latestStart
      || this.form.get('MaintenanceWindowEnd').value > this.latestEnd) {
      this.form.get('MaintenanceWindowEnd').patchValue('');
    }
  }

  isFormElementRequired(elementName: string) {
    return this.validationService.validatorConfigList.get(elementName)
      ? (this.validationService.validatorConfigList.get(elementName).required || this.validationService.validatorConfigList.get(elementName).requiredTrue)
      : false;
  }

  removeAssignmentGroup(index: number) {
    this.assignmentGroups.removeAt(index);
  }

  updateCIForm(CIs) {
    this.form.get('CIs').setValue(CIs);
  }




  public GetFormControl(name: string): AbstractControl {
    const control = this.form.get(name);
    return control;
  }

  Submit() {
    if (this.form.valid) {
      return {
        value: this.form.getRawValue(),
        identifier: `${this.form.get('CustomerSM9Name').value}_${this.form.get('Title').value
          }`
      };

    } else {
      console.error('Form is not valid', this.form);
    }
  }



  Feedback(): FeedbackRequestPayload {
    return this.form.value;
  }

  get getValidationService(): ValidationService {
    return this.validationService;
  }
}
