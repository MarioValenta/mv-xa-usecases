import { Component, ViewChild, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { GridApi, ColDef } from 'ag-grid-community';
import { SearchCIModalService } from '../modals/searchCI-modal.service';
import { ICERequestContext, XAServices } from '@xa/lib-ui-common';
import { CiTableDataService } from './ci-table.data.service';

@Component({
  selector: 'ci-table',
  templateUrl: './ci-table.component.html',
  styleUrls: ['./ci-table.component.scss']
})
export class CiTableComponent implements OnInit {

  @Input() public Context: ICERequestContext;

  @Input()
  set inputData(value: any) {
    if (value) {
      this.AddCIs(value);
    }
  }

  private _showSearchButton = true;
  @Input()
  set showSearchButton(value: boolean) {
    this._showSearchButton = value;
  }
  get showSearchButton() {
    return this._showSearchButton;
  }

  private _searchButtonText = 'search';
  @Input()
  set searchButtonText(text: string) {
    this._searchButtonText = text;
  }
  get searchButtonText() {
    return this._searchButtonText;
  }


  private _showClearButton = true;
  @Input()
  set showClearButton(value: boolean) {
    this._showClearButton = value;
  }
  get showClearButton() {
    return this._showClearButton;
  }

  // add showTable flag
  @Input()
  showTable = true;

  _columnDefs: ColDef[];
  @Input()
  set columnDefs(colDefs: ColDef[]) {
    this._columnDefs = colDefs;
  }
  get columnDefs() {
    return this._columnDefs;
  }

  _uniqueKeyForDuplicates: string = 'HostID';
  @Input()
  set uniqueKeyForDuplicates(uniqueKey: string) {
    this._uniqueKeyForDuplicates = uniqueKey;
  }
  get uniqueKeyForDuplicates() {
    return this._uniqueKeyForDuplicates;
  }

  _tableDescription: string = '';
  @Input()
  set tableDescription(_tableDescription: string) {
    this._tableDescription = _tableDescription;
  }
  get tableDescription() {
    return this._tableDescription;
  }

  _allowDelete: boolean = true;
  @Input()
  set allowDelete(allowDelete: boolean) {
    this._allowDelete = allowDelete;
  }
  get allowDelete() {
    return this._allowDelete;
  }

  _rowSelection = 'single';
  @Input()
  set rowSelection(rowSelection: string) {
    this._rowSelection = rowSelection;
  }
  get rowSelection() {
    return this._rowSelection;
  }

  constructor(private searchModalService: SearchCIModalService, private dataService: CiTableDataService) {
    this.gridChanged = new EventEmitter<any>();
    this.modalSelected = new EventEmitter<any>();
  }

  rowData = [];
  rowDataDuplicates = [];

  // gridApi and columnApi
  private api: GridApi;

  @Output() gridChanged: EventEmitter<any>;

  @Output() modalSelected: EventEmitter<any>;

  // necessary for providing the right scope to context items
  getContextMenuItems = params => this.contextMenu(params);

  ngOnInit() {
    this.columnDefs = this.createColumnDefs();
  }

  onGridReady(params): void {
    this.api = params.api;
    this.api.hideOverlay();
    this.api.sizeColumnsToFit();
  }


  onCellChanged(params): void {
    this.gridChanged.emit(this.rowData);
  }

  contextMenu(params) {
    let result = [];

    if (this.allowDelete) {
      result = [
        {
          name: 'Remove: ' + params.value,
          action: () => {
            if (params.node !== null) {
              this.RemoveFromTable(params.node);
            }
          }
        },
        'copy',
        'export',
        'autoSizeAll'
      ];
    } else {
      result = [
        'copy',
        'export',
        'autoSizeAll'
      ];
    }
    return result;
  }

  private createColumnDefs() {
    if (this.columnDefs) {
      return this.columnDefs;
    } else {
      return [{
        field: 'HOSTID', headerName: 'HostID'
      },
      { field: 'HOSTNAME', headerName: 'Hostname' }]
    }
  }

  RemoveFromTable(row: { data: any; }) {
    this.rowData = this.rowData.filter(element => {
      if (row !== null) {
        return element === row.data ? false : true;
      }
    });
    this.gridChanged.emit(this.rowData);
  }

  OpenHostSearchComponentModal() {
    this.searchModalService.OpenHostSearchComponent(
      'adddevice',
      this.Context,
      (context) => {
        if (context.Data) {
          this.modalSelected.emit(context.Data);
        }
      },
      'single' // add selection mode
    );
  }

  enrichData(data: any[]) {
    if (data) {
      this.dataService.EnrichRows(data).subscribe(val => {
        this.AddCIs(val);
      });
    }
  }

  AddCIs(cis: any[]) {
    if (this.rowData.length > 0) {
      if (this.uniqueKeyForDuplicates) {
        cis = this.checkDuplicatesInRowData(cis, this.uniqueKeyForDuplicates);
      }
    }
    this.rowData = this.rowData.concat(cis);
    this.gridChanged.emit(this.rowData);
  }

  /**
  * Precondition: the inputArray must contain only unique values
  *
  * @param {any[]} inputArray
  * @param {(string | number)} criteria
  * @returns {any[]}
  * @memberof CiTableComponent
  */
  checkDuplicatesInRowData(inputArray: any[], criteria: string | number): any[] {
    if (this.rowData.length > 0) {
      this.rowData.forEach((row) => {
        this.rowDataDuplicates = this.rowDataDuplicates.concat(inputArray.filter(
          item => item[criteria] === row[criteria]));
        inputArray = inputArray.filter(item => item[criteria] !== row[criteria]);
      });
    }
    return inputArray;
  }

  clearCIs() {
    this.rowData = [];
    this.gridChanged.emit(this.rowData);
  }
}
