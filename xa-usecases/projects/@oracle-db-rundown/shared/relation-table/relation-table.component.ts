import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GridService, GridBuilder } from '@xa/grid';
import { AgGridColumn } from 'ag-grid-angular';
import { GridOptions, GridReadyEvent } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'relation-table',
  templateUrl: './relation-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GridService, { provide: 'GRID_TOKEN', useValue: 'uc-oracle-db-rundown-relation-table' }]
})

export class RelationTableComponent implements OnInit {

  entries$ = new BehaviorSubject<Array<any>>([]);

  @Input()
  set Entries(value: Array<any>) {
    this.entries$.next(value);
  }

  @Input() domlayout!: string;
  @Input() fields = [];

  columnDefs!: AgGridColumn[];
  gridOptions: GridOptions;

  constructor(private gridService: GridService) {

    this.gridOptions = this.gridService.getDefaultGridOptions({
      onGridReady: (event: GridReadyEvent) => {
        event.api.hideOverlay();

        if (this.domlayout) {
          event.api.setDomLayout(this.domlayout);
        }

        if (this.entries$) {
          event.api.sizeColumnsToFit();
        }

        event.columnApi.applyColumnState({ state: this.gridService.getColumnStates() });
      }
    });
    this.gridService.unsetImmutableData(this.gridOptions);
  }


  ngOnInit() {
    const columnDef = new GridBuilder<any>();

    Object.keys(this.fields).forEach(key => {
      columnDef.AddColumn(column => column.DefaultColumn(this.fields[key].fields).SetHeaderName(this.fields[key].header));
    });

    this.columnDefs = columnDef.Build();

  }

}
