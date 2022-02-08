import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { ColDef, GridApi, ColumnApi } from 'ag-grid-community';
import { XANotifyService } from '@xa/ui';

@Component({
  selector: 'attachmentupload',
  templateUrl: './AttachmentUpload.component.html',
  styleUrls: ['./AttachmentUpload.component.scss']
})
export class AttachmentUploadComponent implements OnInit {

  @ViewChild('uploader') fileInput: ElementRef;

  files: File[] = [];

  // row data and column definitions
  rowData = [];
  columnDefs: ColDef[];
  rowSelection;

  // gridApi and columnApi
  private gridApi: GridApi;
  private columnApi: ColumnApi;
  overlayLoadingTemplate: string;
  overlayNoRowsTemplate: string;

  // necessary for providing the right scope to context items
  getContextMenuItems = params => this.contextMenu(params);

  @Input() maxNumberofFiles: number;
  @Input() maxFileSizeInMB: number;
  @Input() allowedFileTypes: string[];
  @Output() filesChanged: EventEmitter<File[]>;

  constructor(private xaNotifyService: XANotifyService) {
    this.columnDefs = this.createColumnDefs();
    this.rowSelection = 'single';
    this.filesChanged = new EventEmitter<File[]>();

    this.overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center">uploading ...</span>';
    this.overlayNoRowsTemplate =
      '<span class="ag-overlay-loading-center">no attachments added</span>';
  }

  ngOnInit() { }

  onGridReady(params): void {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    if (this.rowData.length > 0) {
      this.gridApi.hideOverlay();
    } else {
      this.gridApi.showNoRowsOverlay();
    }
    this.gridApi.sizeColumnsToFit();
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
      { headerName: 'Name', field: 'name', resizable: true },
      { headerName: 'Size in MB', field: 'size', resizable: true },
      { headerName: 'Filetype', field: 'type', resizable: true }
    ];
  }

  RemoveFromTable(row) {
    if (row !== null) {
      this.rowData.splice(row.rowIndex, 1);
      this.files.splice(row.rowIndex, 1);
    }
    this.gridApi.setRowData(this.rowData);
    this.filesChanged.emit(this.files);
    this.fileInput.nativeElement.value = '';
    this.gridApi.sizeColumnsToFit();
  }

  AddFiles(files: FileList) {
    // files:FileList is not an array but an object - therefore for-loop is needed
    this.gridApi.showLoadingOverlay();
    if (this.maxNumberofFiles == null || this.files.length + files.length <= this.maxNumberofFiles) {
      for (let i = 0; i < files.length; i++) {

        // file conditions
        const hasFileExtension: boolean = (files[i].name.lastIndexOf(".") > 0);
        const isAllowedFileType: boolean = (this.allowedFileTypes.includes(files[i].name.substring(files[i].name.lastIndexOf("."), files[i].name.length).toLowerCase()));
        const maxFileSize: boolean = (this.maxFileSizeInMB == null || files[i].size / 1024 / 1024 <= this.maxFileSizeInMB);
        const uniqueName: boolean = !(this.files.some(file => file.name === files[i].name));

        // if file conditions are fulfilled, only then add the file to the array, else show the corresponding error message
        if (hasFileExtension && isAllowedFileType && maxFileSize && uniqueName) {
          // add valid files to files array
          this.files.push(files[i]);
        } else {
          if (!hasFileExtension || !isAllowedFileType) {
            this.xaNotifyService.error(`Could not add ${files[i].name}. Filetype ${files[i].type} is not allowed.`,
            {
              closeOnClick: true,
              timeout: 12000,
              pauseOnHover: true
            });
          }
          if (!maxFileSize) {
            this.xaNotifyService.error(`Could not add ${files[i].name}. Filesize too big.`,
            {
              closeOnClick: true,
              timeout: 12000,
              pauseOnHover: true
            });
          }
          if (!uniqueName) {
            this.xaNotifyService.error(`File ${files[i].name} cannot be attached! Filenames of the attachments must be unique!`,  {
              closeOnClick: true,
              timeout: 12000,
              pauseOnHover: true
            });
          }
        }
      }

      // calculate file size to MB
      this.rowData = this.files.map(file => {
        return { name: file.name, size: (file.size / 1024 / 1024).toFixed(2), type: file.type };
      });

      this.filesChanged.emit(this.files);
      this.fileInput.nativeElement.value = '';
      this.gridApi.hideOverlay();
      this.gridApi.sizeColumnsToFit();
    } else {
      this.xaNotifyService.error(
        `Could not add file(s). Maximum number of files exceeded.`
      );
      this.gridApi.hideOverlay();
    }
  }
}
