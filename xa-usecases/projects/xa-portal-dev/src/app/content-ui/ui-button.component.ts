import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ButtonBehavior } from './content-ui.service';

@Component({
    selector: 'ui-button',
    templateUrl: './ui-button.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UIButtonComponent {

    @Input() behavior: ButtonBehavior;


}
