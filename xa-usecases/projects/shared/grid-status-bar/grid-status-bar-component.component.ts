
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { IStatusPanelParams } from 'ag-grid-community';


@Component({
  selector: 'status-component',
  template: `
    <div class="container" *ngIf="visible">
      <div *ngIf="value !== null">
        <div *ngIf="big"><span class="component" style="font-weight: 500; font-size: 14px"><b>{{label}}: </b></span><span class="ag-name-value-value" style="font-weight: 500; font-size: 14px; color: black;"><b>{{value}}</b></span></div>
        <div *ngIf="!big"><span class="component"><b>{{label}}: </b></span><span class="ag-name-value-value"><b>{{value}}</b></span></div>
      </div>
    </div>
  `,
   styleUrls: ['grid-status-bar-component.component.scss']
})
export class GridStatusBarComponent {
  private params: IStatusPanelParams ;
  visible = true;
  big = false;
  value = null;
  label = null;

  agInit(params: IStatusPanelParams ): void {
    this.params = params;
  }

  setVisible(visible: boolean) {
    this.visible = visible;
  }

  isVisible(): boolean {
    return this.visible;
  }

  setBig(big: boolean) {
    this.big = big;
  }

  getBig(): boolean {
    return this.big;
  }

  setValue(value: string) {
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  setLabel(label: string) {
    this.label = label;
  }

  getLabel(): string {
    return this.label;
  }


}
