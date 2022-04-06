import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { GridBuilder, GridService } from '@xa/grid';
import { AgGridColumn } from 'ag-grid-angular';
import { GridOptions, GridReadyEvent } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'relation-table',
  templateUrl: './relation-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GridService, { provide: 'GRID_TOKEN', useValue: 'uc-rundown-realation-table' }]
})

export class RelationTableComponent implements OnInit {

  gridOptions: GridOptions;
  entries$ = new BehaviorSubject<Array<any>>([]);

  @Input()
  set Entries(value: Array<any>) {
    this.entries$.next(value);
  }

  @Input() domlayout!: string;
  @Input() fields = [];

  columnDefs!: AgGridColumn[];


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
