import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ColDef, GridApi, RowNode} from 'ag-grid-community';

@Component({
  selector: 'xa-grid',
  templateUrl: './xa-grid.component.html',
  styleUrls: ['./xa-grid.component.scss']
})
export class XAGridComponent implements OnInit, OnDestroy {

  _editable = false;
  _columnDefs: ColDef[];
  _editType = '';

  @Input()
  set value(value: Object) {
    if (value) {
      this.rowData = Object.keys(value).map(key => {
        return value[key];
      });
      this.gridChanged.emit(this.rowData);
    }
  }

  get value() {
    return this.arrayToObject(this.rowData);
  }

  @Input()
  set editable(editable: boolean) {
    this._editable = editable;
    this.defaultColDef.editable = editable;
  }

  get editable() {
    return this._editable;
  }

  @Input()
  set editType(editType: string) {
    if (editType) {
      this._editType = editType;
    } else {
      this._editType = '';
    }
  }

  get editType() {
    return this._editType;
  }

  @Input()
  set columnDefs(columnDefs: any) {
    if (columnDefs) {
      this._columnDefs = columnDefs;
    } else {
      this._columnDefs = this.createDefaultColumnDefs();
    }
  }

  get columnDefs() {
    return this._columnDefs;
  }

  @Output() gridChanged: EventEmitter<any>;

  createDefaultColumnDefs() {
    return [
      {field: 'Key', headerName: 'Key', resizable: true},
      {field: 'Value', headerName: 'Value', resizable: true}
    ];
  }

  constructor() {

    this.rowSelection = 'single';
    this.gridChanged = new EventEmitter<any>();
  }

  // row data
  rowData = [];
  rowSelection;


  public defaultColDef = {
    editable: this._editable,
    menuTabs: [
      'filterMenuTab'
    ]
  };


  private api: GridApi;
  private gridColumnApi: any;


  // necessary for providing the right scope to context items
  getContextMenuItems = params => this.contextMenu(params);

  ngOnInit() {
    if (!this.columnDefs) {
      this._columnDefs = this.createDefaultColumnDefs();
    }
  }

  rowValueChanged(event: { data: any; }) {
    this.gridChanged.emit(this.rowData);
  }

  onCellValueChanged(event: { data: any; }) {
    this.gridChanged.emit(this.rowData);
  }

  ngOnDestroy() {

  }

  onGridReady(params): void {
    this.api = params.api;
    this.gridColumnApi = params.columnApi;
    this.api.hideOverlay();
    this.api.sizeColumnsToFit();
  }

  contextMenu(params) {
    const contextMenuDefault: Array<any> = ['autoSizeAll'];
    const contextMenuCustom: Array<any> = [
      {
        name: 'Add Empty Row',
        action: () => {
          this.addEmptyRow(params.node);
        }
      },
      {
        name: 'Duplicate',
        action: () => {
          if (params.node !== null) {
            this.duplicateEntry(params.node);
          }
        }
      },
      {
        name: 'Remove',
        action: () => {
          if (params.node !== null) {
            this.removeEntry(params.node);
          }
        }
      },
    ];

    if (this._editable) {
      return contextMenuCustom.concat(contextMenuDefault);
    } else {
      return contextMenuDefault;
    }
  }

  removeEntry(row: RowNode) {
    this.rowData = this.rowData.filter(element => {
      if (row !== null) {
        return element !== row.data;
      }
    });
    this.gridChanged.emit(this.rowData);
  }

  duplicateEntry(row: RowNode) {
    this.rowData.push(Object.assign({}, row.data));
    this.gridChanged.emit(this.rowData);
    this.api.setRowData(this.rowData);
  }

  addEmptyRow(row: RowNode) {
    this.rowData.push({});
    this.gridChanged.emit(this.rowData);
    this.api.setRowData(this.rowData);
  }

  arrayToObject(value: Array<any>) {

    const grouped = value.reduce((curr, next) => {
      if (!curr[next.Key]) {
        curr[next.Key] = [next.Value];
      } else {
        curr[next.Key] = [...curr[next.Key], next.Value];
      }
      return curr;
    }, {});

    return Object.keys(grouped).reduce((obj, item) => {
      const values = (<Array<any>>grouped[item]);
      obj[item] = values.length && values.length > 1 ? values : values[0];
      return obj;
    }, {});
  }

}
