import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ColDef, GridApi, ColumnApi, RowNode, GridOptions } from 'ag-grid-community';
import { XANotifyService } from '@xa/ui';
import { RANFData } from '../models/ranf-data.model';
import { DataService } from '../data.service';
import { ICERequestContext } from '@xa/lib-ui-common';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import * as currency from 'currency.js';
import { GridStatusBarComponent } from 'projects/shared/grid-status-bar/grid-status-bar-component.component';

@Component({
  selector: 'excel-table',
  templateUrl: './excel.table.component.html',
  styleUrls: ['./excel.table.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ExcelTableUploadComponent implements OnInit, OnDestroy {

  @ViewChild('excelFileInput') excelFileInput: ElementRef;
  @ViewChild('importedButton') importedButton: ElementRef;

  @Input() environment: any;

  _Context = null;
  @Input()
  set Context(context: ICERequestContext) {
    this._Context = context;
    if (context.ConfigPayload['dropdownDefaultValues']) {
      if (context.ConfigPayload['dropdownDefaultValues']['unit']) {
        this.UNIT_VALUES = context.ConfigPayload['dropdownDefaultValues']['unit'];
      }

      if (context.ConfigPayload['dropdownDefaultValues']['position']) {
        this.POSITIONS_VALUES = context.ConfigPayload['dropdownDefaultValues']['position'];
      }

      if (context.ConfigPayload['dropdownDefaultValues']['currency']) {
        this.CURRENCY_VALUES = context.ConfigPayload['dropdownDefaultValues']['currency'];
      }
    }
  }
  get Context(){
    return this._Context;
  }

  _clonedData: Array<RANFData>;
  @Input()
  set clonedData(payloadTable: Array<RANFData>) {
    this.logger('DEBUG', 'set clonedData');

    if (payloadTable) {
      this.logger('DEBUG', 'set clonedData IF');

      // if request is cloned, also the highlighted rows are cloned, so they need to be removed
      payloadTable.forEach((element: RANFData) => {
        element.totalAmount = this.isSplitRow(element.typeOfService) ? element.totalAmount : this.calcTotalAmount(element.quantity, element.price);
        element.edited = false;
      });
      this._clonedData = payloadTable;
    }
  }
  get clonedData(): Array<RANFData> {
    return this._clonedData;
  }

  _rowData: Array<RANFData>;
  set rowData(values: Array<any>) {
    this.logger('DEBUG', ' set rowData');

    this._rowData = values;
    this.gridChanged.emit(this._rowData);
    this.rowsCount = this._rowData.length;
  }

  get rowData(): Array<any> {
    return this._rowData;
  }

  readonly FORM_KEY_SUM_TOTAL_AMOUNT = 'SumTotalAmount';
  readonly FORM_KEY_RAWSUM_TOTAL_AMOUNT = 'RawSumTotalAmount';
  POSITIONS_VALUES: string[] = ['Dienstleistung', 'DL', 'Handelsware', 'HW', 'Lizenz', 'Wartung', 'Split'];
  UNIT_VALUES: string[] = ['Pau', 'Std', 'Stk', 'GB'];
  CURRENCY_VALUES: string[] = ['EUR', 'USD', 'GBP', 'SGD'];

  readonly LOCAL_NUMER_STRING_FORMAT = 'de-DE';

  // row data and column definitions
  columnDefs: ColDef[];
  rowSelection;
  rowsCount: number = 0;

  // gridApi and columnApi
  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;
  overlayLoadingTemplate: string;
  overlayNoRowsTemplate: string;
  selectedRows: Array<RANFData> = [];
  selectedRowNodes: Array<RowNode> = [];
  selectedRowIndices: Array<number> = [];

  componentInstancestatusBarCurrentSum: any = null;
  componentInstancestatusBarRawSum: any = null;
  componentInstancestatusBarFilename: any = null;

  statusBarComponentCurrentSum: any = null;
  statusBarComponentRawSum: any = null;
  statusBarComponentFilename: any = null;

  manualUserInput = false;
  automaticHighlightToogle = true;
  disableHighlightRowButton = false;

  precision2 = value => currency(value, { symbol: "", separator: ".", decimal: ",", precision: 2 });
  precision3 = value => currency(value, { symbol: "", separator: ".", decimal: ",", precision: 3 });
  precision = value => currency(value, { symbol: "", separator: ".", decimal: ",", precision: 6 });

  // necessary for providing the right scope to context items
  getContextMenuItems = (params) => this.contextMenu(params);

  @Output() gridChanged: EventEmitter<Array<RANFData>> = new EventEmitter<Array<RANFData>>();
  /**
   * @description The toal sum of all totalAmouts from each row EXCEPT SPLIT rows.
   * @type {EventEmitter<string>}
   * @memberof ExcelTableUploadComponent
   */
  @Output() sum: EventEmitter<string> = new EventEmitter<string>();
  /**
   * @description Either the sum value that was imported from the excel or that comes from the cloned data.
   * @type {EventEmitter<string>}
   * @memberof ExcelTableUploadComponent
   */
  @Output() rawSum: EventEmitter<string> = new EventEmitter<string>(null);

  constructor(private xaNotifyService: XANotifyService, private dataService: DataService) {
    this.overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center">Please wait while your rows are loading...</span>';
    this.overlayNoRowsTemplate =
      '<span class="ag-overlay-loading-center">Please import your Excel file or add rows manually.</span>';
  }

  ngOnInit() {
    this.logger('DEBUG', ' ngOnInit');
    this.columnDefs = this.getColumnDefs();
  }

  ngOnDestroy() {
    this.logger('DEBUG', ' ngOnDestroy');
  }

  getRowStyle = params => {
    if (params.data.edited) {
      return { 'background': '#fafa46' };
    }
  };

  gridOptions: GridOptions = {
    rowSelection: 'multiple',
    singleClickEdit: false
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
        statusPanel: 'statusBarComponent',
        key: 'statusBarFilename',
        align: 'center'
      },
      {
        statusPanel: 'statusBarComponent',
        key: 'statusBarRawSum',
        align: 'center'
      },
      {
        statusPanel: 'statusBarComponent',
        key: 'statusBarCurrentSum',
        align: 'right'
      },
    ]
  }

  private getColumnDefs(): Array<ColDef> {
    return [
      { headerName: 'Position', field: 'position', resizable: true, sortable: true, editable: true, checkboxSelection: true },
      {
        headerName: 'Type of Service', field: 'typeOfService', resizable: true, editable: true,
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: {
          values: this.POSITIONS_VALUES,
        }
      },
      { headerName: 'Position text', field: 'positionText', resizable: true, editable: true },
      {
        headerName: 'Quantity', field: 'quantity', resizable: true, editable: true, headerClass: 'ag-theme-text-left', type: 'numericColumn',
        valueParser: params => {
          if (!this.isSplitRow(params.data.typeOfService)) {
            return this.checkNumber(params.newValue);
          } else {
            return params.newValue;
          }
        },
        valueFormatter: params => {
          if (!this.isSplitRow(params.data.typeOfService)) {
            return this.precision3(params.value).format();
          } else {
            return params.value;
          }
        }
      },
      {
        headerName: 'Unit', field: 'unit', resizable: true, editable: true,
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: {
          values: this.UNIT_VALUES,
        }
      },
      {
        headerName: 'Price', field: 'price', resizable: true, editable: true, headerClass: 'ag-theme-text-left', type: 'numericColumn',
        valueParser: params => {
          if (!this.isSplitRow(params.data.typeOfService)) {
            return this.checkNumber(params.newValue);
          } else {
            return params.newValue;
          }
        },
        valueFormatter: params => {
          if (!this.isSplitRow(params.data.typeOfService)) {
            return this.precision3(params.value).format();
          } else {
            return params.value;
          }
        }
      },
      {
        headerName: 'Currency', field: 'currency', resizable: true, editable: true,
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: {
          values: this.CURRENCY_VALUES,
        }
      },
      {
        headerName: 'Total Amount', field: 'totalAmount', headerClass: 'ag-theme-text-left',
        resizable: true,
        editable: (params) => {
          return this.isSplitRow(params.node.data.typeOfService);
        },
        type: 'numericColumn',
        valueGetter: (params) => {
          if (!this.isSplitRow(params.data.typeOfService)) {
            // set the calculation for the totalAmount with the currency lib multiply function
            const totalAmount = this.calcTotalAmount(params.data.quantity, params.data.price);
            // assign new totalAmount value to the data model
            params.node.data.totalAmount = totalAmount;
            return totalAmount;
          } else {
            return params.data.totalAmount;
          }
        },
        valueFormatter: (params) => {
          return this.isSplitRow(params.data.typeOfService) ? params.data.totalAmount : this.precision2(params.data.totalAmount).format();
        }
      },
      { headerName: 'WBS-Element', field: 'wbsElement', resizable: true, editable: true },
    ];
  }

  calcTotalAmount(quantity: number | string, price: number | string): string {
    return this.precision(quantity).multiply(this.precision(price)).format();
  }

  isSplitRow(value: string): boolean {
    return value ? value.toUpperCase().startsWith('SPLIT') : false;
  }

  checkNumber(number: string) {
    if (!(/^-?\d+,?\d*$|^-?[0-9]{1,3}(\.[0-9]{3})*,[0-9]+$|^-?[0-9]{1,3}(\.[0-9]{3})*$/m).test(number)) {
      return NaN;
    } else {
      return this.precision(number).format();
    }
  }

  contextMenu(params) {
    const result: Array<any> = [{
      icon: '<i class="plus icon"></i>',
      name: 'Add new row',
      shortcut: 'ALT+A',
      action: () => this.onAddDataManually()
    }];

    if (this.rowsCount > 0) {
      if (this.gridApi.getSelectedRows().length > 0) {
        result.push(
          {
            icon: '<i class="trash alternate icon"></i>',
            name: 'Remove selected row(s)',
            shortcut: 'ALT+R',
            action: () => this.onRemoveRow()
          },
          'separator',
          {
            icon: '<i class="highlighter icon"></i>',
            name: 'Highlight selected row(s)',
            shortcut: 'ALT+H',
            action: () => this.onHighlightRow()
          },
          {
            icon: '<i class="eraser icon"></i>',
            name: 'Remove selected highlighted row(s)',
            shortcut: 'ALT+G',
            action: () => this.onRemoveRowHighlight()
          });
      }

      result.push('separator',
        'copy',
        'export',
        'autoSizeAll',
        {
          icon: '<i class="expand arrows alternate icon"></i>',
          name: 'Fit to screen',
          tooltip: 'automatically size all columns that they fit to the window',
          action: () => this.gridApi.sizeColumnsToFit()
        },
        'separator',
        {
          icon: '<i class="trash alternate outline icon"></i>',
          name: 'Clear list',
          tooltip: 'Removes all entries from the list!',
          action: () => this.clearTable()
        });
    }

    return result;
  }

  /**
   * Method for getting the row number where the header is in the excel file
   *
   * @param data Invoice data imported from the excel file
   * @return Index of the header row. If there is no index header then -1 is returned
   *
   */
  private getHeaderRow(data: Array<RANFData>): number {
    return data.findIndex(element => element.position === 'Position');
  }

  /**
   * Method that returns the index of the first fully empty row from a RANFData[] object.
   * If there is no at least one full empty row then returns -1 .
   *
   * @param data Array of RANFData
   * @return  Index of the first full empty row or -1
   *
   */
  private getIndexOfFirstEmptyRow(data: Array<RANFData>): number {
    return data.findIndex(element => this.isEmpty(element));
  }

  // Ag grid clearer function
  clearTable() {
    this.logger('DEBUG', ' clearTable');

    this.rowData = [];
    this.excelFileInput.nativeElement.value = '';
    this.manualUserInput = false;
    this.xaNotifyService.info(`List has been cleared.`);

    this.sum.emit(null);
    this.rawSum.emit(null);

    this.resetStatusBarValues();
  }

  resetStatusBarValues() {
    this.componentInstancestatusBarCurrentSum.setValue(null);
    this.componentInstancestatusBarRawSum.setValue(null);
    this.componentInstancestatusBarFilename.setValue(null);
  }

  /**
  * Checker method if all of the required properties of the RANFObject is empty
  *
  * @param o RANFData object
  * @return returns true if all of the possible columns are empty
  *
  */
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
   * Method to summarize the properly filtered dataset from the excel file (without header)
   *
   * @param netData Invoice filtered data imported from the excel file (without the header)
   * @param startRow OPTIONAL: starting row (numbering of rows starts at 1)
   * @param endrow OPTIONAL: ending row
   * @return Sum of the column of 'Total Amount'
   * @version 1 currently is not used, summarized amount is taken from the excel directly
   */
  private getTotalAmount(netData: Array<RANFData>, startRow?: number, endRow?: number): string {
    let sum = 0;

    this.logger('DEBUG', 'getTotalAmount');

    if (startRow || endRow) {
      for (let index = startRow ? startRow : 0; endRow ? index < endRow : index < netData.length; index++) {
        if (netData[index].totalAmount && !(this.isSplitRow(netData[index].typeOfService))) {
          sum = this.precision(sum).add(netData[index].totalAmount).value;
        }
      }
    } else {
      netData.forEach(element => {
        if (element.totalAmount && !(this.isSplitRow(element.typeOfService))) {
          sum = this.precision(sum).add(element.totalAmount).value;
        }
      });
    }

    this.componentInstancestatusBarCurrentSum.setValue(this.precision(sum).format());
    return this.precision(sum).format();
  }

  /**
   * Method to extract selected rows' indices
   *
   * @param selectedNodes - selected row nodes as RowNode[]
   * @return  - selected rows indices as {number[]}
   *
   */
  private getSelectedRowIndices(selectedNodes: RowNode[]): number[] {
    if (selectedNodes.length > 0) {
      const selectedRowIndices = [];
      selectedNodes.forEach(node => {
        selectedRowIndices.push(node.rowIndex);
      });
      return selectedRowIndices;
    }
    return [];
  }

  /**
   * @description Loads the data form the given array as rowData into the grid and calculates the sum and length of the data.
   * @param {Array<RANFData>} dataRows
   * @memberof ExcelTableUploadComponent
   */
  loadDataIntoGridAndCalcSum(dataRows: Array<RANFData>): void {
    this.logger('DEBUG', 'loadDataIntoGridAndCalcSum');

    let errorCount = 0;
    // TODO: check if the values are Numbers! !isNaN(...) or isNumber(...)
    // NO ROUNDING
    dataRows.forEach((element: RANFData) => {

      // TODO create new RANFData object with all attributes

      if (element.position) { element.position = element.position.toString(); }
      if (element.quantity && !this.isSplitRow(element.typeOfService)) { element.quantity = this.precision(element.quantity).format(); }
      if (element.price && !this.isSplitRow(element.typeOfService)) { element.price = this.precision(element.price).format(); }

      if (element.totalAmount) {
        // this.precision(element.totalAmount).format()
        element.totalAmount = this.isSplitRow(element.typeOfService)
          ? element.totalAmount
          : this.calcTotalAmount(element.quantity, element.price)
      }

      if (element.typeOfService && !this.POSITIONS_VALUES.map(value => value.toUpperCase()).includes(element.typeOfService.toUpperCase())) {
        errorCount++;
      }

      if (element.unit && !this.UNIT_VALUES.map(value => value.toUpperCase()).includes(element.unit.toUpperCase())) {
        errorCount++;
      }

      if (element.currency && !this.CURRENCY_VALUES.map(value => value.toUpperCase()).includes(element.currency.toUpperCase())) {
        errorCount++;
      }

    });

    if (errorCount > 0) {
      this.logger('ERROR', 'loadDataIntoGridAndCalcSum');
      this.xaNotifyService.error(`${errorCount} ERROR(s): Please check the "Type of Service" values!`, `No valid values in "Type of Service`, { timeout: 8000, pauseOnHover: true });
    }

    this.rowData = dataRows;
    this.rowsCount = this.rowData.length;

    this.sum.emit(this.getTotalAmount(this.rowData, 0, this.rowsCount));

    this.gridApi.hideOverlay();
    this.gridApi.sizeColumnsToFit();
  }

  importError() {
    this.logger('DEBUG', 'importError');
    this.rowData = [];
    this.rowsCount = this.rowData.length;
    this.gridApi.showNoRowsOverlay();
    this.gridApi.sizeColumnsToFit();
    this.excelFileInput.nativeElement.value = '';
    this.importedButton.nativeElement.click();
    this.resetStatusBarValues();
  }

  getRowData() {
    this.logger('DEBUG', 'getRowData');

    var rowData = [];
    this.gridApi.forEachNode(function (node) {
      rowData.push(node.data);
    });
    this.rowsCount = rowData.length;
    return rowData;
  }

  /**
   * @description Creates a new array from the underlaying data array of the grid EXCEPT the rows with (TypeOfService === SPLIT).
   * @memberof ExcelTableUploadComponent
   */
  calcTotalSum() {
    this.logger('DEBUG', 'calcTotalSum');
    var rowDataTemp = [];
    this.gridApi.forEachNode((node) => {
      this.addRowToTotalSum(node.data, rowDataTemp);
    });
    this.sum.emit(this.getTotalAmount(rowDataTemp, 0, rowDataTemp.length));
  }

  /**
   * @description Adds the given row to the given array only if TypeOfService is not SPLIT.
   * @param {*} row one single row
   * @param {Array<any>} array the final result array by reference
   * @memberof ExcelTableUploadComponent
   */
  addRowToTotalSum(row: any, array: Array<any>) {
    if (!this.isSplitRow(String(row['typeOfService']))) {
      array.push(row);
    }
  }

  // function to add rows to the grid using transaction approach
  onAddDataManually() {
    this.logger('DEBUG', 'onAddDataManually');

    const addedRow = this.gridApi.applyTransaction({
      add: [
        {
          position: '',
          typeOfService: '',
          positionText: '',
          quantity: 0,
          unit: '',
          price: 0,
          currency: '',
          totalAmount: 0,
          wbsElement: '',
          edited: false
        }
      ]
    });

    this.gridApi.deselectAll();
    addedRow.add[0].setSelected(true);
    this.gridOptions.api.ensureIndexVisible(addedRow.add[0].rowIndex, 'bottom');

    this.resetStatusBarValues();
    this.calcTotalSum();
    this.gridChanged.emit(this.getRowData());
    // we need to display the additional buttons to the user
    this.manualUserInput = true;
    this.xaNotifyService.success('Row has been added');
  }

  // Function to remove selected rows from the grid using transaction approach
  onRemoveRow() {
    this.logger('DEBUG', 'onRemoveRow');

    if (this.selectedRows.length > 0) {

      this.gridApi.applyTransaction({
        remove: this.selectedRows
      });

      if (this.selectedRows.length === 1) {
        this.xaNotifyService.info('1 Row has been removed.');
      } else {
        this.xaNotifyService.info(`${this.selectedRows.length} Rows have been removed.`);
      }

      // If the last row is deleted then we should clear the table to be on the safe side
      if (this.gridApi.getRenderedNodes().length === 0) {
        this.clearTable();
      }
    }
    this.calcTotalSum();
    this.gridChanged.emit(this.getRowData());
  }

  // Event listener for the 'Highlight selected rows' button
  onHighlightRow() {
    this.logger('DEBUG', 'onHighlightRow');

    var itemsToUpdate = [];
    this.gridApi.getSelectedRows().forEach(selectedRows => {
      selectedRows.edited = true;
      itemsToUpdate.push(selectedRows);
    });

    this.gridApi.applyTransaction({
      update: itemsToUpdate
    });

    // We need to force ag-grid to re-draw the grid
    this.gridApi.redrawRows({ rowNodes: this.selectedRowNodes });
    this.gridApi.deselectAll();
  }

  // Event listener for removing highlight from the selected rows
  onRemoveRowHighlight() {
    this.logger('DEBUG', 'onRemoveRowHighlight');
    var itemsToUpdate = [];
    this.gridApi.getSelectedRows().forEach(selectedRows => {
      selectedRows.edited = false;
      itemsToUpdate.push(selectedRows);
    });

    this.gridApi.applyTransaction({
      update: itemsToUpdate
    });

    // // We need to force ag-grid to re-draw the grid
    this.gridApi.redrawRows({ rowNodes: this.selectedRowNodes });
    this.gridApi.deselectAll();
  }

  initGridStatusBar(): void {
    this.statusBarComponentCurrentSum = this.gridApi.getStatusPanel('statusBarCurrentSum');
    this.statusBarComponentRawSum = this.gridApi.getStatusPanel('statusBarRawSum');
    this.statusBarComponentFilename = this.gridApi.getStatusPanel('statusBarFilename');

    this.componentInstancestatusBarCurrentSum = this.statusBarComponentCurrentSum;
    if (this.statusBarComponentCurrentSum.getFrameworkComponentInstance) {
      this.componentInstancestatusBarCurrentSum = this.statusBarComponentCurrentSum.getFrameworkComponentInstance();
    }

    this.componentInstancestatusBarRawSum = this.statusBarComponentRawSum;
    if (this.statusBarComponentRawSum.getFrameworkComponentInstance) {
      this.componentInstancestatusBarRawSum = this.statusBarComponentRawSum.getFrameworkComponentInstance();
    }

    this.componentInstancestatusBarFilename = this.statusBarComponentFilename;
    if (this.statusBarComponentFilename.getFrameworkComponentInstance) {
      this.componentInstancestatusBarFilename = this.statusBarComponentFilename.getFrameworkComponentInstance();
    }

    this.componentInstancestatusBarCurrentSum.setLabel('Total amount (Net)');
    this.componentInstancestatusBarCurrentSum.setBig(true);
  }

  // AG-Grid initializer
  onGridReady(params) {
    this.logger('DEBUG', 'Grid ready');
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi['columnController'];
    this.gridApi.sizeColumnsToFit();

    this.initGridStatusBar();

    // load cloned data into the grid
    if (this.clonedData && this.clonedData.length > 0) {
      this.logger('DEBUG', 'Grid ready => cloned Data');
      this.rawSum.emit(this.Context.Payload['SumTotalAmount']);
      this.componentInstancestatusBarRawSum.setValue(this.Context.Payload['SumTotalAmount']);
      this.componentInstancestatusBarRawSum.setLabel('raw cloned sum');

      this.loadDataIntoGridAndCalcSum(this.clonedData);
    }

    if (this.rowsCount > 0) {
      this.logger('DEBUG', 'this.rowsCount > 0');
      this.gridApi.hideOverlay();
    } else {
      this.logger('DEBUG', 'this.rowsCount <= 0');
      this.gridApi.showNoRowsOverlay();
    }

  }

  onToogleChanged(value: any) {
    this.automaticHighlightToogle = value;
  }

  onCellValueChanged(event: any) {
    this.logger('DEBUG', 'onCellValueChanged');

    var rowNode = this.gridApi.getRowNode(event.node.id);

    // auto highlight on changes
    if (this.automaticHighlightToogle) {
      if (event.newValue !== event.oldValue) {
        rowNode.data.edited = true;
        this.gridApi.redrawRows({ rowNodes: [rowNode] });
        this.bringGridFocusBackToCell();
      }
    }

    switch (event.column.colId) {
      case ('quantity'): {
        this.calcTotalSum();
        break;
      }
      case ('price'): {
        this.calcTotalSum();
        break;
      }
      case ('typeOfService'): {
        // if row changes to SPLIT, then the quantity, price and  totalAmount will be set to empty string
        if (this.isSplitRow(rowNode.data.typeOfService)) {
          rowNode.data.price = '';
          rowNode.data.quantity = '';
          rowNode.data.totalAmount = 0;
          this.gridApi.redrawRows({ rowNodes: [rowNode] });
          this.bringGridFocusBackToCell();
          this.calcTotalSum();
        } else {
          this.calcTotalSum();
        }
        break;
      }
    }
  }

  // Grid row selection change listener
  onSelectionChanged = (params) => {
    this.selectedRows = this.gridApi.getSelectedRows();
    this.selectedRowNodes = this.gridApi.getSelectedNodes();
    this.selectedRowIndices = this.getSelectedRowIndices(this.selectedRowNodes);
  }

  onCellKeyDown($event) {
    let event: KeyboardEvent = $event.event;
    if (event.altKey && event.key.toLowerCase() === "h") {
      this.onHighlightRow();
    }
    if (event.altKey && event.key.toLowerCase() === "r") {
      this.onRemoveRow();
    }
    if (event.altKey && event.key.toLowerCase() === "a") {
      this.onAddDataManually();
    }
    if (event.altKey && event.key.toLowerCase() === "g") {
      this.onRemoveRowHighlight();
    }
  }

  // Excel file importer
  onImportExcelFile(files: FileList) {
    this.logger('DEBUG', 'onImportExcelFile');

    // check selected file if it is an Excel file
    if (files.item(0).type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      && files.item(0).type !== 'application/vnd.ms-excel') {
      this.xaNotifyService.error('The imported file is not an Excel .xlsx file!');
      this.importError();
      return;
    }

    const excelFile = files.item(0);
    const excelFileReader = new FileReader();

    // set the filename inside the footer statusbar
    this.componentInstancestatusBarFilename.setLabel('file');
    this.componentInstancestatusBarFilename.setValue(files.item(0).name);

    this.gridApi.showLoadingOverlay();
    // We need to read the file as ArrayBuffer
    excelFileReader.readAsArrayBuffer(excelFile);
    // TODO: Maybe we could outsource this logic to a separated function
    // that could return a promise, in which we could move the import logic result to resolve fn and onerror() logic to reject
    excelFileReader.onload = (e: any) => {
      this.logger('DEBUG', 'excelFileReader.onload');

      try {
        const inputArrayBuffer = e.target.result;
        const data = this.dataService.getDataFromExcelFile(inputArrayBuffer);
        const result: RANFData[] = data.map((element) => {
          return {
            position: element[0],
            typeOfService: element[1],
            positionText: element[2],
            quantity: element[3],
            unit: element[4],
            price: element[5],
            currency: element[6],
            totalAmount: element[7],
            wbsElement: element[8],
          };
        });
        // We should import only the net dataset (below the excel header)
        if (this.getHeaderRow(result) === -1) {

          this.xaNotifyService.error('Header is not found in the excel file!');
          this.clearTable();
          this.gridApi.showNoRowsOverlay();
          this.excelFileInput.nativeElement.value = '';
          this.importedButton.nativeElement.click();
          return;
        }
        const starterRow = this.getHeaderRow(result) + 1;
        // We need to remove the 'header' section of the excel file
        const dataWithoutHeader = result.splice(starterRow);
        //console.log(dataWithoutHeader);

        // We assume that after the net dataset there is an empty row in the Excel file
        // so we could remove the further rows, only the dataset should be displayed.
        // EndingRow is the first full empty row below total sum cell
        const endingRow = this.getIndexOfFirstEmptyRow(dataWithoutHeader);
        //console.log(endingRow);

        const finalDatasetToDisplay = dataWithoutHeader.slice(0, endingRow - 1);
        const totalSum = ((dataWithoutHeader[endingRow - 1].totalAmount) as unknown) as number;

        this.rawSum.emit(Number(totalSum).toLocaleString(this.LOCAL_NUMER_STRING_FORMAT));
        this.componentInstancestatusBarRawSum.setValue(Number(totalSum).toLocaleString(this.LOCAL_NUMER_STRING_FORMAT));
        this.componentInstancestatusBarRawSum.setLabel('raw imported sum');

        this.loadDataIntoGridAndCalcSum(finalDatasetToDisplay);

        this.excelFileInput.nativeElement.value = '';
        this.importedButton.nativeElement.click();
      }
      catch (error) {
        this.logger('ERROR', `excelFileReader.catch: ${error}`);
        this.xaNotifyService.error('Cannot read the excel file! Is the excel in the right format?');
        this.importError();
        excelFileReader.abort();
      }
    };

    excelFileReader.onerror = () => {
      this.logger('ERROR', `excelFileReader.onerror`);
      this.xaNotifyService.error('Cannot read the excel file! Is the excel in the right format?');
      this.importError();
      excelFileReader.abort();
      return;
    };
    this.excelFileInput.nativeElement.value = '';
  }

  private bringGridFocusBackToCell() {
    let cell = this.gridOptions.api.getFocusedCell();

    if (cell) {
      this.gridOptions.api.setFocusedCell(cell.rowIndex, cell.column);
    }
  }
  logger(level: string, message: string): void {
    if (!this.environment.production) {
      console.debug('[' + level + ']: ' + message);
    }
  }
}
