import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ColDef, GridApi, ColumnApi } from 'ag-grid-community';
import { XANotifyService } from '@xa/ui';
import { BtnCellRenderer } from './button-cell-renderer.component';
import { AttachmentService } from './AttachmentList.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'attachmentlist',
  templateUrl: './AttachmentList.component.html',
  styleUrls: ['./AttachmentList.component.scss']
})
export class AttachmentListComponent implements OnInit {

  @Input()
  set attachments(value: any) {
    if (value) {
      this.rowData = value;
    }
  }

  _businessKey: string;

  @Input()
  set businessKey(values: string) {
    this._businessKey = values;
  }
  get businessKey(): string {
    return this._businessKey;
  }

  @Input() maxNumberofFiles: number;
  @Input() maxFileSizeInMB: number;
  @Output() filesChanged: EventEmitter<File[]>;

  // row data and column definitions
  rowData = [];
  columnDefs: ColDef[];
  rowSelection;

  // gridApi and columnApi
  private gridApi: GridApi;
  private columnApi: ColumnApi;
  overlayLoadingTemplate: string;
  overlayNoRowsTemplate: string;
  frameworkComponents: any;

  // necessary for providing the right scope to context items
  getContextMenuItems = params => this.contextMenu(params);

  constructor(private xaNotifyService: XANotifyService, public attachmentService: AttachmentService) {
    this.columnDefs = this.createColumnDefs();

    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderer
    };

    this.rowSelection = 'single';
    this.filesChanged = new EventEmitter<File[]>();

    this.overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center">uploading ...</span>';
    this.overlayNoRowsTemplate =
      '<span class="ag-overlay-loading-center">no attachments added</span>';
  }

  ngOnInit() {
  }

  onGridReady(params): void {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    if (this.rowData && this.rowData.length > 0) {
      this.gridApi.hideOverlay();
    } else {
      this.gridApi.showNoRowsOverlay();
    }
    this.gridApi.sizeColumnsToFit();

  }

  contextMenu(params) {
    const result = [
      'copy',
      'export',
      'autoSizeAll'
    ];
    return result;
  }

  private createColumnDefs(): Array<ColDef> {
    return [
      { headerName: 'Name', field: 'name', resizable: true },
      { headerName: 'Size in MB', field: 'size', resizable: true, valueFormatter: this.bytesFormatter },
      { headerName: 'Filetype', field: 'type', resizable: true},
      {
        headerName: 'Download',
        field: "download",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: (function (fileName: any) {
            this.downloadFile(fileName);
          }).bind(this)
        },
        minWidth: 120,
        maxWidth: 130
      },
    ];
  }

  bytesFormatter(params) {
    return (params.value / 1024 / 1024).toFixed(2);
  }

  /**
  * Gets a file from this.businessKey and opens download dialog or automatically downloads the file (according to browser settings).
  * @param filename of the file which should be downloaded
  */
  private downloadFile(filename: string) {
    this.attachmentService.getFile(this.businessKey, filename).subscribe(
      (data) => {
        // opens download dialog or automatically downloads file (based on browser settings)
        saveAs(data, filename);
      },
      (error) => {
        console.error('Error while downloading file', error);

        // show error toast to user
        this.xaNotifyService.error(
          `The file ${filename} could not be downloaded.`,
          {
            closeOnClick: true,
            timeout: 3000,
            pauseOnHover: true
          }
        );
      }
    );
  }

  calcFileSizeInMB(sizeInBytes: number) {
    return (sizeInBytes / 1024 / 1024).toFixed(2);
  }

}
