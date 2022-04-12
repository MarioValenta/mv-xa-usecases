import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridBuilder } from '@xa/grid';
import { GridColumn } from '@xa/grid/lib/models/grid-column';
import { FeedbackRequestPayload, ICERequest, ICERequestContext, SubmitRequestPayload } from '@xa/lib-ui-common';
import { SearchField } from '@xa/search';
import { XANotifyService } from '@xa/ui';
import { ValidationService } from '@xa/validation';
import { AgGridAngular, AgGridColumn } from 'ag-grid-angular';
import { RowSelectedEvent } from 'ag-grid-community';
import Lightpick from 'lightpick';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HostInfoModel } from './model/host-info.model';
import { RelationInfoFlatModel } from './model/relation-info-flat.model';
import { RelationsModel } from './model/relations.model';
import { DataService } from './service/data.service';


@Component({
  selector: 'sap-application-rundown-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements ICERequest, OnInit, OnDestroy {
  readonly FORM_KEY_SELECTED_CI = 'SelectedCI';
  readonly FORM_KEY_BACKUP = 'Backup';
  readonly FORM_KEY_REASON = 'Reason';
  readonly FORM_KEY_VOLUMES_TO_KEEP_LONGER = 'VolumesToKeepLonger';
  readonly FORM_KEY_DAYS_TO_KEEP = 'DaysToKeep';
  readonly FORM_KEY_RUNDOWN_DATE = 'RUNDOWN_DATE';
  readonly FORM_KEY_RELATIONS_VALID = 'RelationsValid';
  readonly FORM_KEY_COMMENTS = 'comments';

  @Input() public Context: ICERequestContext;

  // agGrid which holds the relations (recursively) of the host
  @ViewChild('agGrid') agGridTable: AgGridAngular;

  // agGrid which holds the relations (recursively) of the host
  @ViewChild('agGridWithoutDelete') agGridWithoutDeleteTable: AgGridAngular;

  form: FormGroup;
  destroy$ = new Subject<any>();
  domLayout = 'autoHeight';

  // search button text for ci-table
  searchButtonText;

  // host which should be run downed
  selectedCI = new HostInfoModel();

  // agGrid column definitions + entries + indicator, if services are still loading
  hasNonDeletableRelations$ = new BehaviorSubject<boolean>(false);
  isLoadingRelations$ = new BehaviorSubject<boolean>(false);
  relationEntries$ = new BehaviorSubject<Array<RelationInfoFlatModel>>([]);
  relationFields;
  relationFieldsWithoutDelete;

  // values for 'DaysToKeep' form
  daysToKeepDefault: number;
  daysToKeepMin: number;
  daysToKeepMax: number;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private xaNotifyService: XANotifyService,
    private cref: ChangeDetectorRef,
    private validationService: ValidationService,
  ) {

  }

  /**
   * @description Implementation of the ngOnInit() method. Inside this method,
   *
   *    - the Validation from the Context will be used and set to the form
   *    - a new method for the valueChanges listener (Here new listener for each form control element can be added)
   *    - the statusChange listener for the form is set (this changes the VALID-State of the whole form)
   *    - the callback functions for the submit and feedback button are set
   *    - and if available, the given Payload from the Context is patched to the form.
   */
  ngOnInit() {
    // read min/max/default value for 'DaysToKeep' form of config (or set default values if not configured)
    this.daysToKeepDefault = parseInt(this.Context.ConfigPayload.daysToKeep.default, 10) || 10;
    this.daysToKeepMin = parseInt(this.Context.ConfigPayload.daysToKeep.min, 10) || 10;
    this.daysToKeepMax = parseInt(this.Context.ConfigPayload.daysToKeep.max, 10) || 100;

    // set text for search button in ci-table
    this.searchButtonText = this.Context.ConfigPayload.searchModal.searchButtonText || 'Select Host for Rundown';

    // set search fields for ci-table
    this.Context.ConfigPayload.searchcomponentColumns = this.getSearchComponentColumns();

    // set columns of agGrid
    this.relationFields = this.getRelationFields(true);
    this.relationFieldsWithoutDelete = this.getRelationFields(false);

    this.buildForm();
    this.valueChangesListener();

    /**
     * Sets the ValidationConfig for this form (in this case ReqeustForm) from the Context input parameter.
     */
    if (this.Context.Validation.requestForm) {
      this.validationService.setValidatorsFromConfig(this.form, this.Context.Validation.requestForm, false);
    }

    /**
     * StatusChange listener for the Valid-Status of the form.
     * If the status of the form changes, this listener is trigger
     */
    this.form.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => this.Context.Valid = status);

    /**
     * Sets the callback functions for OnSubmit() and OnFeedback().
     */
    this.Context.OnSubmit(() => this.submit());
    this.Context.OnFeedback(() => this.feedback());

    /**
     * Patches default values to the matching form control elements.
     */
    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload);
    }
  }

  /**
   * @description A lifecycle hook that is called when a directive, pipe, or service is destroyed.
   * Use for any custom cleanup that needs to occur when the instance is destroyed.
   * this.destroy$.next() triggers the Subject which triggers the takeUntil operator which completes subscriptions.
   */
  ngOnDestroy() {
    this.destroy$.next();
  }

  /**
   * @description Method for building the form with form control elements.
   * Form control names have to match the formControlName of the HTML element.
   * The naming convention for the variables inside the form is PascalCase.
   * PascalCase is a naming convention in which the first letter of each word in a compound word is capitalized.
   */
  buildForm() {
    this.form = this.fb.group({
      SelectedCI: ['', Validators.required], // CI which should be run downed
      RUNDOWN_DATE: ['', Validators.required], // date, when the CI should be run downed
      IsRollback: [false],
      ObjectType: ['HOST'],
      Backup: ['', Validators.required], // decision, if a backup was already made or a backup is not needed
      Reason: ['', Validators.required], // reason, why a backup is not needed
      // days, how long the host should be kept before the rundown
      DaysToKeep: [this.daysToKeepDefault, [Validators.required, Validators.min(this.daysToKeepMin), Validators.max(this.daysToKeepMax)]],
      VolumesToKeepLonger: '', // reason, why the host should be kept lesser/longer as the default time
      Relations: [''], // relations which should be deleted with the selectedCI as well
      RelationsValid: [false, Validators.requiredTrue],
      comments: []
    });

    // disable forms dependent of other forms
    this.form.get(this.FORM_KEY_REASON).disable();
    this.form.get(this.FORM_KEY_DAYS_TO_KEEP).disable();

    // add a datepicker to the 'RUNDOWN_DATE' form
    // format: 'YYYY-MM-DDTHH:mm:ss.sssZ',
    const picker = new Lightpick({
      field: document.getElementById('datepicker'),
      format: 'DD.MM.YYYY',
      singleDate: true,
      onSelect: (date) => {
        this.form.get(this.FORM_KEY_RUNDOWN_DATE).patchValue(`${date.format('DD.MM.YYYY')}`);
        this.cref.markForCheck();
      }
    });
  }

  /**
   * @description Here you can define multicasting observables that emit an event every time the value
   * of the defined form control element changes, in the UI or programmatically. It also emits an event each
   * time you call enable() or disable() without passing along {emitEvent: false} as a function argument.
   * So for each form control element from the buildForm() method, you can create one valueChanges() listener her
   * and listen to changes and react to them.
   */
  valueChangesListener(): void {
    // change event of 'Backup' form
    this.form.get(this.FORM_KEY_BACKUP).valueChanges.subscribe(
      (value) => {
        // if 'Backup' changed to 'AlreadyExistingBackup
        // reset and disable 'Reason' form
        if (value === 'AlreadyExistingBackup') {
          this.form.get(this.FORM_KEY_REASON).reset();
          this.form.get(this.FORM_KEY_REASON).disable();
        } else { // else enable 'Reason' form
          this.form.get(this.FORM_KEY_REASON).enable();
        }
      }
    );

    // change event of 'VolumesToKeepLonger' form
    this.form.get(this.FORM_KEY_VOLUMES_TO_KEEP_LONGER).valueChanges.subscribe(
      (value) => {
        // if no input is present/the input was deleted
        // disable and reset 'DaysToKeep' form
        if (!value) {
          this.form.get(this.FORM_KEY_DAYS_TO_KEEP).disable();
          this.form.get(this.FORM_KEY_DAYS_TO_KEEP).setValue(this.daysToKeepDefault);
        } else { // else enable 'DaysToKeep' form
          this.form.get(this.FORM_KEY_DAYS_TO_KEEP).enable();
        }
      }
    );
  }

  /**
   * @description Checks based on the Validation config (if exists) if the given
   * form control element is required or not and then adds automatically
   * a new class 'required' to the HTML element. The result (if required) is
   * a red required star at the label in the form.
   *
   * @param elementName name of the form element
   * @returns returns either either true if the form control element is required
   * or false if it is not required by the Validation config.
   */
  isFormElementRequired(elementName: string): boolean {
    return this.validationService.validatorConfigList.get(elementName)
      ? (this.validationService.validatorConfigList.get(elementName).required
        || this.validationService.validatorConfigList.get(elementName).requiredTrue)
      : false;
  }

  /**
   * @description This is the callback function for the submit function.
   *
   * @returns An new object with the following structure:
   * {value: <values>, identifier: <identifier>}
   */
  submit(): SubmitRequestPayload {
    // error occurred at form validation
    if (!this.form.valid) {
      console.error('Form is not valid', this.form);
    }

    // get all form values
    const model = this.form.getRawValue();

    // extract and format value of form 'RUNDOWN_DATE'
    const res = this.form.controls.RUNDOWN_DATE.value.split('.');
    // res[1] - 1 because month is set by index, 0 is January, 1 is February, etc.
    model.RUNDOWN_DATE = new Date(res[2], res[1] - 1, res[0], 12, 0, 0, 0);

    // set Id, Hostname and Customer
    model.Id = this.selectedCI.HostID;
    model.Hostname = this.selectedCI.Hostname;
    model.Customer = this.selectedCI.Customer;

    // add selected relations to the model
    model.Relations = this.agGridTable.api.getSelectedRows().filter(
      (row, i, arr: Array<any>) => arr.findIndex(t => t.id === row.id) === i
    );

    return {
      value: model,
      identifier: `${model.SelectedCI.Hostname}_${model.SelectedCI.HostID}`
    };
  }

  /**
   * @description This is the callback function for the feedback modal.
   *
   * @returns  An new object with the following structure:
   * {value: <values>}
   */
  feedback(): FeedbackRequestPayload {
    return this.form.value;
  }

  /**
   * Set Layout and Column Width when grid is ready.
   */
  onGridReady(agGrid: AgGridAngular) {
    agGrid.api.hideOverlay();

    // set layout
    if (this.domLayout) {
      agGrid.api.setDomLayout(this.domLayout);
    }

    // set column width
    if (this.relationEntries$.value) {
      agGrid.api.sizeColumnsToFit();
    }

    // if a host/service is not deletable according to the rules, it is marked red
    // was not done using css, because it didn't work that way (ag-grid version 20.2.0)
    agGrid.gridOptions.getRowStyle = (params) => {
      if (params.data.nonDeletable) {
        return { color: 'red' };
      }
    };
  }

  /**
   * Fit columns if grid size is changed.
   */
  onGridSizeChanged(agGrid: AgGridAngular) {
    agGrid.api.sizeColumnsToFit();
  }

  /**
   * If a service/host is selected, also all hosts/services with same ID will be selected.
   * Precondition: Make sure that the service/host can be deleted.
   *  - Precondition met, due to row selected event only in agGrid, which will only be shown if all services/hosts can be deleted.
   *
   * @param event which holds the data of the selected service/host and some metadata
   * @param agGrid which selected rows should be retrieved
   */
  rowSelected(event: RowSelectedEvent, agGrid: AgGridAngular): void {
    // (de-)select each duplicate node
    agGrid.api.forEachNode((node) => {
      if (node.data.id === event.data.id) {
        node.setSelected(event.node.isSelected());
      }
    });
  }

  /**
   * Select all relations in the relations-table.
   */
  selectAllRows(agGrid: AgGridAngular): void {
    agGrid.api.forEachNode((node) => {
      node.setSelected(true);
    });
  }

  /**
   * Deselect all relations in the relations-table.
   */
  deselectAllRows(agGrid: AgGridAngular): void {
    agGrid.api.forEachNode((node) => {
      node.setSelected(false);
    });
  }

  /**
   * Update host information and host relations, if a new host is selected.
   *
   * @param selectedCI Host which was selected in ci-table
   */
  updateCIInfos(selectedCI: HostInfoModel) {
    // a different host is selected
    if (this.selectedCI.HostID !== selectedCI.HostID) {
      this.form.get(this.FORM_KEY_RELATIONS_VALID).setValue(false);

      // update component variable and 'SelectedCI' value
      this.selectedCI = selectedCI;
      this.form.get(this.FORM_KEY_SELECTED_CI).setValue(selectedCI);

      // get relations of the newly selected host
      this.isLoadingRelations$.next(true); // start loading indicator
      this.dataService.getCIRelations(selectedCI.HostID)
        .pipe(
          takeUntil(this.destroy$)
        ).subscribe(
          (data) => {
            // convert tree representation of the relations to a flat model
            const relationsFlat = new Array<RelationInfoFlatModel>();
            this.convertRelationsToFlatArray(data, 5, 0, relationsFlat);

            // stop loading indicator
            this.isLoadingRelations$.next(false);

            // update relations of the selected host in table
            this.relationEntries$.next(relationsFlat);

            // check if some relations are nonDeletable
            const nonDeletableRelations = relationsFlat.filter((relationFlat) => relationFlat.nonDeletable);
            this.hasNonDeletableRelations$.next(nonDeletableRelations.length > 0);
            if (!this.hasNonDeletableRelations$.value) {
              this.form.get(this.FORM_KEY_RELATIONS_VALID).setValue(true);
            }
          }
        );
    }
  }

  /**
   * Converts a tree representation of the host/service relations into a flat representation.
   *
   * @param relations , tree representation of the relations
   * @param maxLevel of the tree up to which the structure is to be flattened
   * @param currentLevel of the tree up to which the structure has been flattened already
   * @param relationsFlat flat structure of previously flattened nodes and container for next flattened nodes
   */
  private convertRelationsToFlatArray(
    relations: RelationsModel[],
    maxLevel: number,
    currentLevel: number,
    relationsFlat: Array<RelationInfoFlatModel>
  ): void {
    // relations to flatten exist and the max level is still not reached
    if (relations && currentLevel < maxLevel) {
      // flatten every relation and add it to 'relationsFlat' and repeat for subsequent relations
      for (const relation of relations) {
        relationsFlat.push(new RelationInfoFlatModel(relation, currentLevel));
        this.convertRelationsToFlatArray(relation.Relations, maxLevel, currentLevel + 1, relationsFlat);
      }
    }
  }

  /**
   * Defines the columns of the agGrid.
   */
  getRelationFields(withDelete: boolean): Array<AgGridColumn> {
    const gridBuilder = new GridBuilder<RelationInfoFlatModel>();
    if (withDelete) {
      gridBuilder.AddColumn(
        column => this.setDefaultColumnProperties(column.DefaultColumn('dummy')
          .SetHeaderName('Delete')
          .SetWidth(70)
          .SetOther(other => {
            other.checkboxSelection = true;
          })
        )
      );
    }

    gridBuilder.AddColumn(
      column => this.setDefaultIDColumnProperties(column.DefaultColumn('id0')),
      column => this.setDefaultIDColumnProperties(column.DefaultColumn('id1')),
      column => this.setDefaultIDColumnProperties(column.DefaultColumn('id2')),
      column => this.setDefaultIDColumnProperties(column.DefaultColumn('id3')),
      column => this.setDefaultIDColumnProperties(column.DefaultColumn('id4')),
      column => this.setDefaultColumnProperties(column.DefaultColumn('name').SetHeaderName('Name')),
    );

    return gridBuilder.Build();
  }

  /**
   * Sets properties for ID columns of agGrid.
   *
   * @param column the ID column
   */
  private setDefaultIDColumnProperties(column: GridColumn): GridColumn {
    return this.setDefaultColumnProperties(column)
      .SetHeaderName('Host/Service ID')
      .SetWidth(110)
      ;
  }

  /**
   * Sets properties for a column of agGrid.
   *
   * @param column the column
   */
  private setDefaultColumnProperties(column: GridColumn): GridColumn {
    return column
      .Filterable(false)
      .Sortable(false)
      .SetLockPosition(true)
      .SetLockPinned(true)
      ;
  }

  /**
   * Defines the search columns for the ci-table.
   */
  private getSearchComponentColumns(): Array<SearchField> {
    return [
      {
        Name: 'HOSTID',
        Label: 'HostID',
        Placeholder: 'HostID',
      },
      {
        Name: 'HOSTNAME',
        Label: 'Hostname',
        Placeholder: 'Hostname',
        FormatValue: (value) => {

          if (value.startsWith('!')) {
            return value.substring(1);
          }

          if (value.includes('*') || value.includes('%')) {
            return value;
          }
          return `*${value}*`;
        }
      },
      {
        Name: 'HENVIRONMENT',
        Label: 'Environment',
        Type: 'select',
        Options: this.dataService.getEnvironments(),
        Placeholder: 'Environment',
      },
      {
        Name: 'HCUST',
        Label: 'Customer',
        Type: 'select',
        Options: this.dataService.getCustomers(),
        SelectConfig: {
          ViewValue: 'label',
          OptionsValue: 'CUSTOMERNICKNAME'
        },
        Width: '30em',
        Placeholder: 'Select Customer'
      },

      {
        Name: 'HSTATUS',
        Label: 'Status',
        Type: 'select',
        Options: () => (this.Context && this.Context.ConfigPayload.AllowedStatus) || this.allowedStatus,
        Placeholder: 'Select Status',
        Width: '15em',
        HideInput: false
      },

      {
        Name: 'HPLATFORM',
        Label: 'Platform',
        Type: 'select',
        Placeholder: 'Select Platform',
        Options: () => (this.Context && this.Context.ConfigPayload.AllowedPlatforms) || this.allowedPlatforms,
        HideResult: true,
        HideTable: true,

    },

      // {
      //   Name: 'HSTATUS',
      //   Label: 'Status',
      //   Type: 'select',
      //   Options: () => (this.Context && this.Context.ConfigPayload.AllowedStatus) || [
      //     'RUNDOWN',
      //     'ACTIVE',
      //     'BASE_INSTALLED',
      //     'READY_FOR_SERVICE',
      //     'EXPERIMENTAL',
      //     'INFOALERTING'
      //   ],
      //   Placeholder: 'Select Status'
      // },
      {
        Name: 'HKTR',
        Label: 'WBS',
        HideInput: true
      },
      // {
      //   Name: 'HPLATFORM',
      //   Label: 'Platform',
      //   Type: 'select',
      //   Options: () => (this.Context && this.Context.ConfigPayload.AllowedPlatforms) || [
      //     'SRV_X86_VM',
      //     'SRV_APPLIANCE_VM'
      //   ],
      //   Placeholder: 'Select Platform',
      //   HideResult: true,
      //   HideTable: true,
      // }
    ];
  }
  allowedStatus = [
    'RUNDOWN',
    'ACTIVE',
    'BASE_INSTALLED',
    'READY_FOR_SERVICE',
    'EXPERIMENTAL',
    'INFOALERTING',
  ];

  allowedPlatforms = [
    'SRV_X86_VM',
    'SRV_APPLIANCE_VM'
  ];

}
