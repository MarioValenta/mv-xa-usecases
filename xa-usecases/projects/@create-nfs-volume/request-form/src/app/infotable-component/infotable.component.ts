import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'infotable',
  templateUrl: './infotable.component.html',
  styleUrls: ['./infotable.component.scss']
})

export class InfoTableComponent implements OnChanges {

  @Input() info;
  numberOfProperties: number;

  constructor() { }

  ngOnChanges() {
    this.numberOfProperties = Object.keys(this.info).length;
  }

}
