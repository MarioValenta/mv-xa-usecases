import { Injectable } from '@angular/core';
import { XAModalService, XAModalPageBuilder, XAModalPageContext } from '@xa/ui';
import { SearchDevicesComponent } from './search-devices-dialog/search-devices.component';
import { AffectedDevicesInfo } from './search-devices-dialog/model/AffectedDevicesInfo';


@Injectable({
    providedIn: 'root'
})

export class CreateIPNetworkModalService {


    constructor(private modalService: XAModalService) { }



    public OpenSearchComponent(value: any, devices: Array<AffectedDevicesInfo>, func: ((context: XAModalPageContext<any>) => any)) {

        const page = new XAModalPageBuilder()
            .FromComponent('AddDevices', SearchDevicesComponent)
            .SetTop('50px')
            .SetWidth('50%')
            .AddInvokeMethodBehaviour('adddevice', func);

        const context = {
            description: `Add Devices`,
            selectedDevices: devices
        };

        this.modalService.CreateModal().AddPage(page).Open('AddDevices', context);

    }
}

