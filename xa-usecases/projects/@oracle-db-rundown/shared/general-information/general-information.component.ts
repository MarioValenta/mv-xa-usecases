import { Component, Input } from '@angular/core';

@Component({
  selector: 'general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.css']
})
export class AppComponent {
  title = 'general-information';

  @Input() infoData: any;
}
