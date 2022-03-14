import { Component, ViewChild, OnInit, EventEmitter, Output, ElementRef, Input } from '@angular/core';
import { GridApi, ColDef } from 'ag-grid-community';
import { SearchCIModalService } from '../modals/searchCI-modal.service';
import * as Papa from 'papaparse';
import { ICERequestContext } from '@xa/lib-ui-common';
import { XANotifyService } from '@xa/ui';
import { Observable } from 'rxjs';

@Component({
  selector: 'ci-table',
  templateUrl: './ci-table.component.html',
  styleUrls: ['./ci-table.component.scss']
})

export class CiTableComponent implements OnInit {

  @Input() public Context: ICERequestContext;

  constructor(private searchModalService: SearchCIModalService, private xaNotifyService: XANotifyService) {
    this.rowSelection = 'single';
    this.gridChanged = new EventEmitter<any>();
  }

  // row data and column definitions
  rowData = [];
  rowDataDuplicates = [];
  columnDefs: ColDef[];
  rowSelection;
  imported = false;
  filePath = '';
  showModal = false;
  fileInfo: string;
  file;

  // gridApi and columnApi
  private api: GridApi;

  @Output() gridChanged: EventEmitter<any>;
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;

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

  contextMenu(params) {
    const result = [
      {
        name: 'Remove: ' + params.value,
        action: () => this.RemoveFromTable(params.node)
      },
      'copy',
      'export',
      'autoSizeAll'
    ];
    return result;
  }

  /**
   *
   *
   * @private
   * @returns
   * @memberof CiTableComponent
   */
  private createColumnDefs() {
    const res = [];
    if (this.Context.ConfigPayload.columns) {
      this.Context.ConfigPayload.columns.forEach(element => {
        res.push({ headerName: element.headerName, field: element.field });
      });
    }
    return res;
  }

  /**
   * this function is registered to the remove action of the context menu function
   * searches the whole rowData array for the selected ro and removes one selected data row from the table if it was found
   * calls girdChanged.emit(this.rowData) to update the data in the grid
   * @param {*} row the data row from the ag-grid table
   * @memberof CiTableComponent
   */
  RemoveFromTable(row: any) {
    if (row !== null) {
      this.rowData = this.rowData.filter(element => {
        return element[this.Context.ConfigPayload.equalsCriteria] === row.data[this.Context.ConfigPayload.equalsCriteria] ? false : true;
      });
      this.gridChanged.emit(this.rowData);
    }
  }

  OpenHostSearchComponentModal() {
    this.searchModalService.OpenHostSearchComponent('adddevice', this.Context, (context) => {
      this.AddCIs(context.Data.map(element => {
        return element;
      }));
    });
  }

  /**

   * @param {*} $event
   * @memberof CiTableComponent
   */


  // Source: https://stackblitz.com/edit/angular-file-upload-button?file=src%2Fapp%2Ffile-upload-button%2Ffile-upload-button.component.scss
  /**
  * Called when the value of the file input changes, i.e. when a file has been
  * selected for upload.
  * Imports one csv file (uses the papaparse library)
  * Called, when the "Import" button is clicked
  * parses row by row from the csv file into one result array
  * after import is completed, the result array will be checked for duplicates
  * after checking for duplicates, the AddCis() will be called
  * this.imported will be set to true => the import button will be disabled
  * if the imported csv contains more rows than allowed, a error toast opens and no data will be imported
 *
 * @param input the file input HTMLElement
 */
  onFileSelect(event: any): void {

    console.debug('changeEvent');
    console.debug('FILE:', event.target.files[0].name);
    this.fileInfo = event.target.files[0].name;

    this.filePath = event.target.files[0];

    const observable = this.parseObservable(this.filePath);

    observable.subscribe((res: any[]) => {
      console.debug('sub', res);

      // TODO not working properly
      if (res.length <= this.Context.ConfigPayload.maxDataRows) {
            this.AddCIs(this.checkDuplicateInFile(res, this.Context.ConfigPayload.equalsCriteria));
            this.imported = true;
          } else {
            this.makeNotification('NO data imported!' + ' too many datarows ' + res.length + '/' + this.Context.ConfigPayload.maxDataRows);
            this.fileReset();
          }
    });
  }

  parseObservable(file: any) {
    return new Observable(
      observable => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            observable.next(results.data);
            return observable.complete();

          // unsubscribe function doesn't need to do anything in this
          // because values are delivered synchronously
          //return {unsubscribe() {}};
            }
        });
      });
  }

  /**
   * resets the file import path to empty string
   * @memberof CiTableComponent
   */
  fileReset() {
    console.log('reset FILE');
    this.filePath = '';
    this.fileInput.nativeElement.value = '';
  }

  /**
   * adds new array elemnts to the rowData array
   * if the rowData array length is > 0, all elements of the new array will be checked, if they are not in the rowData array
   * after checking for duplicates, the new array will be added to the rowData array (concat)
   * @param {any[]} cis
   * @memberof CiTableComponent
   */
  AddCIs(cis: any[]) {

    if (!this.isInLimit(cis)) {
      this.makeNotification('NO data imported!' + ' too many datarows ' + (this.rowData.length + cis.length) + '/' + this.Context.ConfigPayload.maxDataRows);
      return;
    }
    if (this.rowData.length > 0) {
      cis = this.checkDuplicatesInRowData(cis, this.Context.ConfigPayload.equalsCriteria);
    }
    this.rowData = this.rowData.concat(cis);
    this.gridChanged.emit(this.rowData);
  }

  isInLimit(items: any[]) {
    return (this.rowData.length + items.length) <= this.Context.ConfigPayload.maxDataRows ? true : false;
  }

  makeNotification(message) {
    console.debug('makeNotification');
    this.xaNotifyService.error(message);
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

  /**
   * removes duplicate elements based on the given criteria value e.g. HostID
   * if more rows in the csv with the same criteria value are present, only the first one will be added to the rowData array
   * @param {any[]} inputArray the array containing all rows from the new csv file
   * @param {(string | number)} criteria the criteria vaule
   * @returns {any[]} returns a array containing olny unique items
   * @memberof CiTableComponent
   */
  checkDuplicateInFile(inputArray: any[], criteria: string | number): any[] {
    return inputArray.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[criteria]).indexOf(obj[criteria]) === pos;
    });
  }

  clearCIs() {
    this.rowData = [];
    this.rowDataDuplicates = [];
    this.gridChanged.emit(this.rowData);
    this.fileReset();
    this.imported = false;
    this.showModal = false;
  }
}
