import { Component, Input, SimpleChanges, Output, EventEmitter, OnChanges } from '@angular/core';
import { StorageParameters } from '../models/storage-parameters.model';
import { ColumnApi, GridApi, ColDef } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { DataService } from '../data-service.service';

@Component({
  selector: 'storage-table',
  templateUrl: './storage-table.component.html',
  styleUrls: ['./storage-table.component.scss']
})

export class StorageTableComponent implements OnChanges {

    // row data and column definitions
    rowData$: Observable<StorageParameters[]>;
    columnDefs: ColDef[];
    rowSelection;

    // gridApi and columnApi
    private api: GridApi;
    private columnApi: ColumnApi;

    @Input() HostId: string;
    @Output() gridChanged: EventEmitter<StorageParameters>;
  

  constructor(private dataService: DataService) { 
    this.columnDefs = this.createColumnDefs();
    this.rowSelection = 'single';
    this.gridChanged = new EventEmitter<StorageParameters>();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.HostId) {
      this.rowData$ = this.dataService.GetStorageOfCI(this.HostId);
    }
  }

  onGridReady(params): void {
    this.api = params.api;
    this.api.hideOverlay();
    this.columnApi = params.columnApi;

    this.api.sizeColumnsToFit();
}

  private createColumnDefs() {
    return [
        {field: 'Mountpoint'},
        {field: 'Filesystem'},
        {field: 'Device'},
        {field: 'SizeGB'}
    ];
  }

  onSelectionChanged() {
    const selectedRow = this.api.getSelectedRows()[0];
    this.gridChanged.emit(selectedRow);
  }

}
