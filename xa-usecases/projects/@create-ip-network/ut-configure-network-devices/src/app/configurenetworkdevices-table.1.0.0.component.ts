import { Component, Input, forwardRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ICETaskContext } from '@xa/lib-ui-common';


@Component({
    selector: 'configurenetworkdevices-table',
    templateUrl: './configurenetworkdevices-table.1.0.0.component.html',
    styleUrls: ['./create-ip-styles.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ConfigureNetworkDevicesTableComponent_1_0_0),
        multi: true
    }],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigureNetworkDevicesTableComponent_1_0_0 implements OnInit {

    @Input() Context: ICETaskContext;

    public Responsible: any;
    public SupportGroupNetworks: any;
    public SupportGroupNetworkArr = [];
    public VLANIDs = [];
    public AffectedDevices = [];


    constructor() {


    }

    ngOnInit() {

        const resp = this.Context.Payload.supportgroup;
        this.SupportGroupNetworks = this.Context.Payload.Group.Devices[resp];
        this.GetVLANIDs(this.SupportGroupNetworks);
        this.CreateSupportGroupNetworkArray(this.VLANIDs);
        this.GetAffectedDevices(this.SupportGroupNetworkArr);

    }

    CreateSupportGroupNetworkArray(vlanids) {
        vlanids.forEach(element => {
            this.SupportGroupNetworkArr.push(this.SupportGroupNetworks[element]);

        });

    }

    GetVLANIDs(devices: {}) {
        Object.keys(devices).forEach(key => {
            this.VLANIDs.push(key);

        });
    }

    GetAffectedDevices(SupportGroupNetworkArr: any[]) {

        SupportGroupNetworkArr.forEach(element => {

            this.AffectedDevices.push(element.AffectedDevices);


        });

    }


}
