import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ColDef, GridApi, ColumnApi } from 'ag-grid-community';
import { XANotifyService } from '@xa/ui';

@Component({
  selector: 'attachmentupload',
  templateUrl: './AttachmentUpload.component.html',
  styleUrls: ['./AttachmentUpload.component.scss']
})
export class AttachmentUploadComponent implements OnInit {
  files: File[] = [];

  // row data and column definitions
  rowData = [];
  columnDefs: ColDef[];
  rowSelection: string;
  fileSizeToMB = 1000 * 1000;

  overlayLoadingTemplate: string;
  overlayNoRowsTemplate: string;

  // gridApi and columnApi
  private api: GridApi;
  private columnApi: ColumnApi;

  // necessary for providing the right scope to context items
  getContextMenuItems = params => this.contextMenu(params);

  @Input() maxNumberofFiles: number;
  @Input() maxFileSizeInMB: number;
  @Output() filesChanged: EventEmitter<File[]>;

  constructor(private xaNotifyService: XANotifyService) {
    this.columnDefs = this.createColumnDefs();
    this.rowSelection = 'single';
    this.filesChanged = new EventEmitter<File[]>();

    this.overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center">Please wait while your Attachments are added...</span>';
    this.overlayNoRowsTemplate =
      '<span class="ag-overlay-loading-center">No Attachments added.</span>';
  }

  ngOnInit() { }

  onGridReady(params): void {
    this.api = params.api;
    this.columnApi = params.columnApi;

    if (this.rowData.length > 0) {
      this.api.hideOverlay();
    } else {
      this.api.showNoRowsOverlay();
    }

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

  private createColumnDefs() {
    return [
      { headerName: 'Name', field: 'name' },
      { headerName: 'Size in MB', field: 'size' }
    ];
  }

  RemoveFromTable(row) {
    if (row !== null) {
      this.rowData.splice(row.rowIndex, 1);
      this.files.splice(row.rowIndex, 1);
    }
    this.api.setRowData(this.rowData);
    this.filesChanged.emit(this.files);
  }

  AddFiles(files: FileList) {
    // files:FileList is not an array but an object - therefore for-loop is needed
    if (
      this.maxNumberofFiles == null ||
      this.files.length + files.length <= this.maxNumberofFiles
    ) {
      for (let i = 0; i < files.length; i++) {
        if (
          this.maxFileSizeInMB == null ||
          files[i].size / this.fileSizeToMB <= this.maxFileSizeInMB
        ) {
          this.files.push(files[i]);
        } else {
          this.xaNotifyService.error(
            `Could not add ${files[i].name}. Filesize too big.`
          );
        }
      }

      this.rowData = this.files.map(file => {
        return { name: file.name, size: (file.size / this.fileSizeToMB).toFixed(2) };
      });

      this.filesChanged.emit(this.files);
    } else {
      this.xaNotifyService.error(
        `Could not add file(s). Maximum number of files exceeded.`
      );
    }
  }
}
