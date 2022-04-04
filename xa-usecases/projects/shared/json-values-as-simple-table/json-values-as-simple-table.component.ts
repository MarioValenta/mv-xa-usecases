import { Component, Input } from '@angular/core';

@Component({
  selector: 'general-information',
  templateUrl: './json-values-as-simple-table.component.html',
  styleUrls: ['./json-values-as-simple-table.component.css']
})
export class AppComponent {

  @Input() title: string = 'json-values-as-simple-table';
  @Input() infoData: any;
}
