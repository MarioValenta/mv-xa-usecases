import { Component, Input, forwardRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Context } from 'ag-grid-community';


@Component({
    selector: 'configureswitching-table',
    templateUrl: './configureswitching-table.1.0.0.component.html',
    styleUrls: ['./create-ip-styles.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ConfigureSwitchingTable_1_0_0),
        multi: true
    }],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigureSwitchingTable_1_0_0 implements OnInit {

    @Input() Context: any;

    public NetworkItems;

    constructor() {}

    ngOnInit() {

        this.NetworkItems = this.Context.Payload.NetworkItems;

    }

}
