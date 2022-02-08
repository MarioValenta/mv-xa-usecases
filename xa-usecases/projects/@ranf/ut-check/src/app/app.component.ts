import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApproveTaskPayload, FeedbackRequestPayload, ICETask, ICETaskContext, RejectTaskPayload } from '@xa/lib-ui-common';
import { XANotifyService } from '@xa/ui';
import { ValidationService } from '@xa/validation';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { Observable, Subject } from 'rxjs';
import { environment } from '../environments/environment';
import { DataService } from './data.service';
import { RANFData } from './models/ranf-data.model';
import * as XLSX from 'xlsx';
import { takeUntil } from 'rxjs/operators';
import * as currency from 'currency.js';
import { GridStatusBarComponent } from 'projects/shared/grid-status-bar/grid-status-bar-component.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements ICETask, OnInit, OnDestroy {
  title = 'RanfUserTask';

  @ViewChild('excelFileInput') excelFileInput: ElementRef;
  @ViewChild('importedButton') importedButton: ElementRef;
  @ViewChild('startPicker') startPicker;
  @ViewChild('endPicker') endPicker;

  @Input() Context: ICETaskContext;

  readonly FORM_KEY_CUSTOMER = 'Customer';
  readonly FORM_KEY_CUSTOMER_CONTACT = 'CustomerContact';
  readonly FORM_KEY_REQUESTOR = '__Requestor';
  readonly FORM_KEY_ACCOUNTS_NUMBER = 'AccountsNumber';
  readonly FORM_KEY_ADDRESS = 'Address';
  readonly FORM_KEY_PERIOD_START = 'PeriodStart';
  readonly FORM_KEY_PERIOD_END = 'PeriodEnd';
  readonly FORM_KEY_UID_NUMBER = 'UIDNumber';
  readonly FORM_KEY_TIME_PAYMENT = 'TimePayment';
  readonly FORM_KEY_DIFFERENT_BILLING_ADDRESS = 'DiffBillAddress';
  readonly FORM_KEY_SETTLEMENT = 'Settlement';
  readonly FORM_KEY_BILLING_CYCLE = 'BillingCycle';
  readonly FORM_KEY_CREDIT_MEMO = 'CreditMemo';
  readonly FORM_KEY_CONTRACT_DURATION = 'ContractDuration';
  readonly FORM_KEY_CONTRACT_NUMBER = 'ContractNumber';
  readonly FORM_KEY_ORDER_NUMBER_OF_CUSTOMER = 'OrderNumberOfCustomer';
  readonly FORM_KEY_HEADER_TEXT = 'HeaderText';
  readonly FORM_KEY_SUM_TOTAL_AMOUNT = 'SumTotalAmount';
  readonly FORM_KEY_COMMENTS = 'Comments';
  readonly FORM_KEY_TABLE = 'Table';

  // FormControl Labels (that are subjects to export)
  readonly FORM_LABEL_CUSTOMER = 'Customer';
  readonly FORM_LABEL_REQUESTOR = 'Requestor';
  readonly FORM_LABEL_CUSTOMER_CONTACT = 'Customer Contact';
  readonly FORM_LABEL_ACCOUNTS_NUMBER = 'Accounts receivable Nr.';
  readonly FORM_LABEL_ADDRESS = 'Address';
  readonly FORM_LABEL_PERIOD_START = 'From';
  readonly FORM_LABEL_PERIOD_END = 'To';
  readonly FORM_LABEL_UID_NUMBER = 'UID Nr.';
  readonly FORM_LABEL_TIME_PAYMENT = 'Time for payment';
  readonly FORM_LABEL_DIFFERENT_BILLING_ADDRESS = 'Different billing address';
  readonly FORM_LABEL_SETTLEMENT = 'Type of settlement';
  readonly FORM_LABEL_BILLING_CYCLE = 'Billing Cycle';
  readonly FORM_LABEL_CREDIT_MEMO = 'Credit memo for invoice number';
  readonly FORM_LABEL_CONTRACT_DURATION = 'Contract duration in months';
  readonly FORM_LABEL_CONTRACT_NUMBER = 'Contract number';
  readonly FORM_LABEL_ORDER_NUMBER_OF_CUSTOMER = 'Order number of the customer';
  readonly FORM_LABEL_HEADER_TEXT = 'Header text';
  readonly FORM_LABEL_SUM_TOTAL_AMOUNT = 'Total amount (Net)';
  readonly FORM_LABEL_COMMENTS = 'Comments';

  // Section labels
  readonly SECTION_LABEL_GENERAL = 'General';
  readonly SECTION_LABEL_EXCEL_DATA = 'Excel Data';
  readonly SECTION_LABEL_ATTACHMENTS = 'Attachments';

  form: FormGroup;
  destroy$ = new Subject();
  Customers$: Observable<any[]>; // [{DEBITORNAME: string, DEBITORID: number | string}]
  AccountsNumbers$: Observable<string[]>;
  Addresses$: Observable<string[]>;
  Settlement$: Observable<string[]>;

  // AG-Grid data
  private gridApi: GridApi;
  columnDefs: Array<ColDef>;

  _rowData: Array<RANFData>;
  overlayLoadingTemplate: string;
  overlayNoRowsTemplate: string;

  componentInstancestatusBarCurrentSum: any = null;
  statusBarComponentCurrentSum: any = null;

  manualUserInput = false;
  disableHighlightRowButton = false;

  attachmentList: File[] = [];

  precision2 = value => currency(value, { symbol: "", separator: ".", decimal: ",", precision: 2 });
  precision3 = value => currency(value, { symbol: "", separator: ".", decimal: ",", precision: 3 });

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private dataService: DataService,
    private xaNotifyService: XANotifyService) {
    this.Settlement$ = this.dataService.getSettlements();

    this.overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>';
    this.overlayNoRowsTemplate =
      '<span class="ag-overlay-loading-center">Please import your Excel file or add rows manually</span>';
  }

  gridOptions: GridOptions = {
    rowSelection: 'multiple',
  };

  frameworkComponents = {
    statusBarComponent: GridStatusBarComponent,
  };

  statusBar = {
    statusPanels: [
      {
        statusPanel: 'agSelectedRowCountComponent',
        align: 'left'
      },
      {
        statusPanel: 'agTotalRowCountComponent',
        align: 'left'
      },
      {
        statusPanel: 'agAggregationComponent',
        align: 'left',
        statusPanelParams: {
          aggFuncs: ['count']
        }
      },
      {
        statusPanel: 'statusBarComponent',
        key: 'statusBarCurrentSum',
        align: 'right'
      },
    ]
  }

  initGridStatusBar(): void {
    this.statusBarComponentCurrentSum = this.gridApi.getStatusPanel('statusBarCurrentSum');
    if (this.Context.Payload[this.FORM_KEY_SUM_TOTAL_AMOUNT]) {
      this.componentInstancestatusBarCurrentSum = this.statusBarComponentCurrentSum;
      if (this.statusBarComponentCurrentSum.getFrameworkComponentInstance) {
        this.componentInstancestatusBarCurrentSum = this.statusBarComponentCurrentSum.getFrameworkComponentInstance();
      }
      this.componentInstancestatusBarCurrentSum.setBig(true);
      this.componentInstancestatusBarCurrentSum.setLabel(this.FORM_LABEL_SUM_TOTAL_AMOUNT);
      this.componentInstancestatusBarCurrentSum.setValue(this.precision2(this.Context.Payload[this.FORM_KEY_SUM_TOTAL_AMOUNT]).format());
    }
  }

  private getColumnDefs(): Array<ColDef> {
    return [
      { headerName: 'Position', field: 'position', resizable: true, sortable: true, editable: false, checkboxSelection: true },
      { headerName: 'Type of Service', field: 'typeOfService', resizable: true, editable: false },
      { headerName: 'Position text', field: 'positionText', resizable: true, editable: false },
      {
        headerName: 'Quantity', field: 'quantity', resizable: true, editable: false,
        headerClass: 'ag-theme-text-left', type: 'numericColumn',
        valueGetter: params => {
          return this.isSplitRow(params.data.typeOfService) ? params.data.quantity : this.precision3(params.data.quantity).format();
          // if (!this.isSplitRow(params.data.typeOfService)) {
          //   return this.precision3(params.data.quantity).format();
          //   if (!isNaN(params.data.quantity)) {
          //     return this.precision3(params.data.quantity).format();
          //   }
          //   else {
          //     return NaN;
          //   }
          // } else { return params.data.quantity; }
        }
      },
      { headerName: 'Unit', field: 'unit', resizable: true, editable: false, },
      {
        headerName: 'Price', field: 'price', resizable: true, editable: false, headerClass: 'ag-theme-text-left', type: 'numericColumn',
        valueGetter: params => {
          return this.isSplitRow(params.data.typeOfService) ? params.data.price : this.precision3(params.data.price).format();
          // if (!this.isSplitRow(params.data.typeOfService)) {
          //   return this.precision3(params.data.price).format();
          //   if (!isNaN(params.data.price)) {
          //     return this.precision3(params.data.price).format();
          //   }
          //   else {
          //     return NaN;
          //   }
          // } else { return params.data.price; }
        }
      },
      { headerName: 'Currency', field: 'currency', resizable: true, editable: false },
      {
        headerName: 'Total Amount', field: 'totalAmount', resizable: true, editable: false,
        headerClass: 'ag-theme-text-left',
        type: 'numericColumn',
        valueGetter: (params) => {
          return this.isSplitRow(params.data.typeOfService) ? params.data.totalAmount : this.precision2(params.data.totalAmount).format();
        }
      },
      { headerName: 'WBS-Element', field: 'wbsElement', resizable: true, editable: false },

    ];
  }

  getContextMenuItems = (params) => {
    var result = [
      {
        name: 'copy selected row(s)',
        shortcut: 'CTRL+SHIFT+C',
        action: () => this.gridApi.copySelectedRowsToClipboard(false)
      },
      {
        name: 'copy selected cell(s)',
        shortcut: 'CTRL+C',
        action: () => this.gridApi.copySelectedRangeToClipboard(false)
      },
      'separator',
      'export',
      'autoSizeAll',
      {
        icon: '<i class="expand arrows alternate icon"></i>',
        name: 'Fit to screen',
        tooltip: 'automatically size all columns that they fit to the window',
        action: () => this.gridApi.sizeColumnsToFit()
      }
    ];
    return result;
  }

  isSplitRow(value: string): boolean {
    return value ? value.toUpperCase().startsWith('SPLIT') : false;
  }

  checkNumber(number: string) {
    if (!(/^-?\d+,?\d*$|^-?[0-9]{1,3}(\.[0-9]{3})*,[0-9]+$|^-?[0-9]{1,3}(\.[0-9]{3})*$/m).test(number)) {
      return NaN;
    } else {
      return number;
    }
  }

  onCellKeyDown($event) {
    let event: KeyboardEvent = $event.event;
    if (event.ctrlKey && event.key === "c") {
      this.gridApi.copySelectedRangeToClipboard(false);
    }

    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'c') {
      this.gridApi.copySelectedRowsToClipboard(false);
    }
  }

  getRequestorName(): string {
    return this.form.get(this.FORM_KEY_REQUESTOR).value.FirstName + ' ' + this.form.get(this.FORM_KEY_REQUESTOR).value.LastName
  }

  private isEmpty(o: RANFData): boolean {
    const emptyMainColumns = o.currency === undefined &&
      o.position === undefined &&
      o.positionText === undefined &&
      o.price === undefined &&
      o.quantity === undefined &&
      o.totalAmount === undefined &&
      o.typeOfService === undefined &&
      o.unit === undefined &&
      o.wbsElement === undefined;
    return emptyMainColumns;
  }

  /**
   * Function to round the input value to the given decimal places
   *
   * @param n input number that should be rounded
   * @param decimalPlaces number of the decimal places
   * @return rounded number
   *
   */
  private roundTo(n: number | string, decimalPlaces: number) {
    // constructing a number based on its exponential form
    let testnum = Number(n + 'e' + decimalPlaces);
    if (decimalPlaces < 0) {
      testnum = testnum * -1;
      return Number(Math.fround(testnum) + 'e-' + decimalPlaces) * -1;
    } else {
      return Number(Math.fround(testnum) + 'e-' + decimalPlaces);
    }
  }

  buildForm() {
    this.form = this.fb.group({
      Customer: [''],
      __Requestor: [''],
      CustomerContact: [''],
      AccountsNumber: [''],
      Address: [''],
      PeriodStart: [''],
      PeriodEnd: [''],
      UIDNumber: [''],
      TimePayment: [''],
      DiffBillAddress: [''],
      Settlement: [''],
      BillingCycle: [''],
      CreditMemo: [''],
      ContractDuration: [''],
      ContractNumber: [''],
      OrderNumberOfCustomer: [''],
      HeaderText: [''],
      Table: [''],
      SumTotalAmount: [''],
      Comments: [''],
      Aborted: false
    });
  }

  ngOnInit() {
    this.buildForm();
    if (this.Context.Validation.utCheck) {
      this.validationService.setValidatorsFromConfig(this.form, this.Context.Validation.utCheck, false);
    }

    this.columnDefs = this.getColumnDefs();

    this.form.statusChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(status => this.Context.Valid = status);

    this.Context.OnApprove(() => this.approve());
    this.Context.OnReject(() => this.reject());
    this.Context.OnFeedback(() => this.feedback());
    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload);

      const { Table, Attachments } = this.Context.Payload;

      if (Table) {
        this.rowData = Table;
      }
      if (Attachments) {
        if (!Array.isArray(Attachments)) {
          this.Context.Payload['Attachments'] = [];
        }
        this.attachmentList = this.Context.Payload['Attachments'];
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  parseISOString(isoDate): string {

    if(isNaN(Date.parse(isoDate))) {
      return "NOT A VALID ISO DATE FORMAT";
    }
    return new Date(isoDate).toLocaleDateString();
  }

  public getDate(addHours = 0) {
    const dt = new Date();
    return new Date(dt.setHours(dt.getHours() + addHours, 0, 0, 0));
  }

  isFormElementRequired(elementName: string) {
    return this.validationService.validatorConfigList.get(elementName)
      ? (this.validationService.validatorConfigList.get(elementName).required || this.validationService.validatorConfigList.get(elementName).requiredTrue)
      : false;
  }

  enableFormElement(formControlName: string, defaultValue?: any) {
    this.form.get(formControlName).enable();
    this.form.get(formControlName).patchValue(defaultValue ? defaultValue : '');
  }

  disableFormElement(formControlName: string) {
    this.form.get(formControlName).patchValue('');
    this.form.get(formControlName).disable();
  }

  logger(level: string, message: string): void {
    if (!environment.production) {
      console.debug('[' + level + ']: ' + message);
    }
  }

  readUploadedFileAsURL(inputFile) {
    const temporaryFileReader = new FileReader();

    return new Promise<string>((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException('Problem parsing input file.'));
      };

      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result.toString());
      };
      temporaryFileReader.readAsDataURL(inputFile);
    });
  }

  // AG-Grid initializer
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();

    this.initGridStatusBar();
  }

  set rowData(values: Array<any>) {
    this._rowData = values;
    this.form.get(this.FORM_KEY_TABLE).setValue(values);
  }

  getRowStyle = params => {
    if (params.data.edited) {
      return { 'background': '#fafa46' };
    }
  };

  get rowData(): Array<any> {
    return this._rowData;
  }

  onExport() {

    const tableLength = this.Context.Payload['Table'].length || 0;
    const attachmentListLength = this.Context.Payload['Attachments'].length || 0;

    // Constructing of the format for the dates as requested to be displayed
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    // Constructing the dates as string to be in the exported file excel

    const periodStartToExport = new Date(this.Context.Payload['PeriodStart']).toLocaleDateString();
    const periodEndToExport = new Date(this.Context.Payload['PeriodEnd']).toLocaleDateString();


    const sectionLabel1 = [
      [`1.${this.SECTION_LABEL_GENERAL}`]
    ];

    const headerRow1 = [
      [`${this.FORM_LABEL_REQUESTOR}`, null, null, null, null, `${this.FORM_LABEL_CUSTOMER_CONTACT}`],
      [`${this.getRequestorName()}`, null, null, null, null, `${this.form.get(this.FORM_KEY_CUSTOMER_CONTACT).value}`]
    ];

    const headerRow2 = [
      [`${this.FORM_LABEL_CUSTOMER}`, null, null, null, null, `${this.FORM_LABEL_ADDRESS}`],
      [`${this.form.get(this.FORM_KEY_CUSTOMER).value}`, null, null, null, null, `${this.form.get(this.FORM_KEY_ADDRESS).value}`]
    ];

    const headerRow3 = [
      [`${this.FORM_LABEL_ACCOUNTS_NUMBER}`, null, null, null, null, `${this.FORM_LABEL_UID_NUMBER}`],
      [`${this.form.get(this.FORM_KEY_ACCOUNTS_NUMBER).value}`, null, null, null, null, `${this.form.get(this.FORM_KEY_UID_NUMBER).value}`]
    ];

    const headerRow4 = [
      [`${this.FORM_LABEL_PERIOD_START}`, null, `${this.FORM_LABEL_PERIOD_END}`, null, null, null],
      [`${periodStartToExport}`, null, `${periodEndToExport}`, null, null, null]
    ];

    // Attempted to use json for the rows containing dates
    // dateNF config option worked only with json but when using json for the row construction
    // I did not find the proper way to insert empty columns (to preserve the properly tabulated structure of the excel file)
    /*     const headerRowXXX = [
          {
            [`${this.FORM_LABEL_PERIOD_START}`]: periodStart
          },
          // { null: null },
          {
            [`${this.FORM_LABEL_PERIOD_END}`]: periodEnd
          },
          // { null: null },
          //  { null: null },
          { null: null }
        ];
     */
    const headerRow5 = [
      [`${this.FORM_LABEL_TIME_PAYMENT}`, null, null, null, null, `${this.FORM_LABEL_DIFFERENT_BILLING_ADDRESS}`],
      [`${this.form.get(this.FORM_KEY_TIME_PAYMENT).value}`, null, null, null, null, `${this.form.get(this.FORM_KEY_DIFFERENT_BILLING_ADDRESS).value}`]
    ];

    const headerRow6 = [
      [`${this.FORM_LABEL_CREDIT_MEMO}`, null, null, null, null, `${this.FORM_LABEL_CONTRACT_DURATION}`],
      [`${this.form.get(this.FORM_KEY_CREDIT_MEMO).value}`, null, null, null, null, `${this.form.get(this.FORM_KEY_CONTRACT_DURATION).value}`]
    ];

    const headerRow7 = [
      [`${this.FORM_LABEL_CONTRACT_NUMBER}`, null, null, null, null, `${this.FORM_LABEL_ORDER_NUMBER_OF_CUSTOMER}`],
      [`${this.form.get(this.FORM_KEY_CONTRACT_NUMBER).value}`, null, null, null, null, `${this.form.get(this.FORM_KEY_ORDER_NUMBER_OF_CUSTOMER).value}`]
    ];

    const headerRow8 = [
      [`${this.FORM_LABEL_BILLING_CYCLE}`, null, null, null, null, `${this.FORM_LABEL_SETTLEMENT}`],
      [`${this.form.get(this.FORM_KEY_BILLING_CYCLE).value}`, null, null, null, null, `${this.form.get(this.FORM_KEY_SETTLEMENT).value}`]
    ];

    const headerRow9 = [
      {
        [`${this.FORM_LABEL_HEADER_TEXT}`]: `${this.form.get(this.FORM_KEY_HEADER_TEXT).value}`
      }
    ];

    const sectionLabel2 = [
      [`2.${this.SECTION_LABEL_EXCEL_DATA}`]
    ];

    const footerRow1 = [
      [null, null, null, null, null, null, `${this.FORM_LABEL_SUM_TOTAL_AMOUNT}`, `${this.form.get(this.FORM_KEY_SUM_TOTAL_AMOUNT).value}`]
    ];

    const sectionLabel3 = [
      [`3.${this.SECTION_LABEL_ATTACHMENTS}`]
    ];

    const commentRow = [
      [`${this.FORM_LABEL_COMMENTS}`, null, null, null, null, null, null, null],
      [`${this.form.get(this.FORM_KEY_COMMENTS).value}`, null, null, null, null, null, null, null]
    ];

    // grabbing the table data
    const tableData: RANFData[] = this.Context.Payload['Table'];
    // instantiating workbook object
    const wb = XLSX.utils.book_new();

    // Building up the worksheet
    const wsx = XLSX.utils.aoa_to_sheet(sectionLabel1);
    XLSX.utils.sheet_add_aoa(wsx, headerRow1, { origin: 1 });
    XLSX.utils.sheet_add_aoa(wsx, headerRow2, { origin: 4 });
    XLSX.utils.sheet_add_aoa(wsx, headerRow3, { origin: 7 });
    // XLSX.utils.sheet_add_json(wsx, headerRowXXX, { origin: 10, sheetStubs: true, cellDates: true, dateNF: 'd-mmm-yy' });
    XLSX.utils.sheet_add_aoa(wsx, headerRow4, { origin: 10 });
    // Date formatting is not working when I use array of arrays. It seems to be working only when I use sheet_add_json,
    // otherwise the dateNF config option is ignored.
    // But when I use json to build the row, I cannot add empty columns..
    XLSX.utils.sheet_add_aoa(wsx, headerRow5, { origin: 13 });
    XLSX.utils.sheet_add_aoa(wsx, headerRow6, { origin: 16 });
    XLSX.utils.sheet_add_aoa(wsx, headerRow7, { origin: 19 });
    XLSX.utils.sheet_add_aoa(wsx, headerRow8, { origin: 22 });
    XLSX.utils.sheet_add_json(wsx, headerRow9, { origin: 25 });
    XLSX.utils.sheet_add_aoa(wsx, sectionLabel2, { origin: 28 });


    // Adding the table to the worksheet with properly ordered columns
    XLSX.utils.sheet_add_json(wsx, tableData, {
      origin: 29,
      header: [
        'position',
        'typeOfService',
        'positionText',
        'quantity',
        'unit',
        'price',
        'currency',
        'totalAmount',
        'wbsElement'
      ]
    });

    // Aliases for the column names for displaying the column headers in a user friendly way
    const newHeaderNames = [
      'Position',
      'Type of Service',
      'Position Text',
      'Quantity',
      'Unit',
      'Price',
      'Currency',
      'Total Amount',
      'WBS-Element'
    ];

    // Renaming the header text to a user friendly format
    XLSX.utils.sheet_add_aoa(wsx, [newHeaderNames], { origin: 29 });
    // Adding total net amount cells
    XLSX.utils.sheet_add_aoa(wsx, footerRow1, { origin: -1 });
    // And continue to build the worksheet
    XLSX.utils.sheet_add_aoa(wsx, [['']], { origin: -1 }); // Adding a new empty row as a workaround
    XLSX.utils.sheet_add_aoa(wsx, sectionLabel3, { origin: -1 });

    const attachmentTable = [
      ['Name', null, null, null, 'Size in MB', null, null, null, 'Filetype'],
    ];

    if (this.attachmentList.length !== 0) {
      this.attachmentList.map(attachment => {
        attachmentTable.push([attachment.name, null, null, null, (attachment.size / 1024 ** 2).toFixed(2).toString(), null, null, null, attachment.type]);
      });
    }

    XLSX.utils.sheet_add_aoa(wsx, attachmentTable, { origin: -1 });
    XLSX.utils.sheet_add_aoa(wsx, [['']], { origin: -1 });
    XLSX.utils.sheet_add_aoa(wsx, commentRow, {
      origin: tableLength === 0 && attachmentListLength === 0 ? 35
        : tableLength === 0 && attachmentListLength !== 0 ? 29 + tableLength + 9
          : tableLength !== 0 && attachmentListLength !== 0 ? 29 + tableLength + 9
            : 29 + tableLength + 6
    });

    // Setting cols widths if it is necessary
    // wsx['!cols'] = [{}];

    // Merging cells
    wsx['!merges'] = [
      // sectionLabel1
      { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },

      // headerRow1
      { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
      { s: { r: 1, c: 5 }, e: { r: 1, c: 8 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } },
      { s: { r: 2, c: 5 }, e: { r: 2, c: 8 } },

      // headerRow2
      { s: { r: 4, c: 0 }, e: { r: 4, c: 3 } },
      { s: { r: 5, c: 0 }, e: { r: 5, c: 3 } },
      { s: { r: 4, c: 5 }, e: { r: 4, c: 8 } },
      { s: { r: 5, c: 5 }, e: { r: 5, c: 8 } },

      // headerRow3
      { s: { r: 7, c: 0 }, e: { r: 7, c: 3 } },
      { s: { r: 8, c: 0 }, e: { r: 8, c: 3 } },
      { s: { r: 7, c: 5 }, e: { r: 7, c: 8 } },
      { s: { r: 8, c: 5 }, e: { r: 8, c: 8 } },

      // headerRow4
      { s: { r: 10, c: 0 }, e: { r: 10, c: 1 } },
      { s: { r: 11, c: 0 }, e: { r: 11, c: 1 } },
      { s: { r: 10, c: 2 }, e: { r: 10, c: 3 } },
      { s: { r: 11, c: 2 }, e: { r: 11, c: 3 } },
      { s: { r: 10, c: 5 }, e: { r: 10, c: 8 } },
      { s: { r: 11, c: 5 }, e: { r: 11, c: 8 } },

      // headerRow5
      { s: { r: 13, c: 0 }, e: { r: 13, c: 3 } },
      { s: { r: 14, c: 0 }, e: { r: 14, c: 3 } },
      { s: { r: 13, c: 5 }, e: { r: 13, c: 8 } },
      { s: { r: 14, c: 5 }, e: { r: 14, c: 8 } },

      // headerRow6
      { s: { r: 16, c: 0 }, e: { r: 16, c: 3 } },
      { s: { r: 17, c: 0 }, e: { r: 17, c: 3 } },
      { s: { r: 16, c: 5 }, e: { r: 16, c: 8 } },
      { s: { r: 17, c: 5 }, e: { r: 17, c: 8 } },

      // headerRow7
      { s: { r: 19, c: 0 }, e: { r: 19, c: 3 } },
      { s: { r: 20, c: 0 }, e: { r: 20, c: 3 } },
      { s: { r: 19, c: 5 }, e: { r: 19, c: 8 } },
      { s: { r: 20, c: 5 }, e: { r: 20, c: 8 } },

      // headerRow8
      { s: { r: 22, c: 5 }, e: { r: 22, c: 8 } },
      { s: { r: 23, c: 5 }, e: { r: 23, c: 8 } },

      // headerRow9
      { s: { r: 25, c: 0 }, e: { r: 25, c: 8 } },
      { s: { r: 26, c: 0 }, e: { r: 26, c: 8 } },

      // sectionLabel2
      { s: { r: 28, c: 0 }, e: { r: 28, c: 8 } },

      // sectionLabel3
      { s: { r: tableLength === 0 ? 32 : 29 + tableLength + 3, c: 0 }, e: { r: tableLength === 0 ? 32 : 29 + tableLength + 3, c: 8 } },
      // { s: { r: tableLength === 0 ? 33 : 29 + tableLength + 4, c: 0 }, e: { r: tableLength === 0 ? 33 : 29 + tableLength + 4, c: 3 } },

      // commentRow
      {
        s: {
          r: tableLength === 0 && attachmentListLength === 0 ? 35
            : tableLength === 0 && attachmentListLength !== 0 ? 29 + tableLength + 9
              : tableLength !== 0 && attachmentListLength !== 0 ? 29 + tableLength + 9
                : 29 + tableLength + 6, c: 0
        }, e: {
          r: tableLength === 0 && attachmentListLength === 0 ? 35
            : tableLength === 0 && attachmentListLength !== 0 ? 29 + tableLength + 9
              : tableLength !== 0 && attachmentListLength !== 0 ? 29 + tableLength + 9
                : 29 + tableLength + 6, c: 8
        }
      },

      {
        s: {
          r: tableLength === 0 && attachmentListLength === 0 ? 36
            : tableLength === 0 && attachmentListLength !== 0 ? 29 + tableLength + 10
              : tableLength !== 0 && attachmentListLength !== 0 ? 29 + tableLength + 10
                : 29 + tableLength + 7, c: 0
        }, e: {
          r: tableLength === 0 && attachmentListLength === 0 ? 38
            : tableLength === 0 && attachmentListLength !== 0 ? 29 + tableLength + 12
              : tableLength !== 0 && attachmentListLength !== 0 ? 29 + tableLength + 12
                : 29 + tableLength + 9, c: 8
        }
      },
    ];

    // This kind of styling is only available in SheetJS PRO version! :(
    // No styling is available in the community edition
    /*     for (let i = 1; i <= 25; i++) {
          if (i % 2 !== 0) {
            wsx[`A${i}`].s = {
              font: {
                bold: true
              }
            };
          }
        }
     */

    // Appending the sheet to the workbook with the name RANF
    // Mind the max length of a sheet name by excel (<31 chars)!
    XLSX.utils.book_append_sheet(wb, wsx, 'RANF');

    // Writing the file
    XLSX.writeFile(wb, `ranf_${this.Context.Payload['__RequestId']}.xlsx`, { bookType: 'xlsx' });
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
    console.debug(this.form.value);
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
