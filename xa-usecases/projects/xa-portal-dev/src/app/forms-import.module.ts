import { NgModule } from '@angular/core';

import { BillingRequestFormAppModule } from 'projects/@billing/request-form/src/app/app.module';
import { CreateNFSVolumeRequestFormAppModule } from 'projects/@create-nfs-volume/request-form/src/app/app.module';
import { CreateRfcRequestFormAppModule } from 'projects/@create-rfc/request-form/src/app/app.module';
import { CreateSRRequestFormAppModule } from 'projects/@create-sr/request-form/src/app/app.module';
import { PhoneForwardingRequestFormAppModule } from 'projects/@phoneforwarding/request-form/src/app/app.module';
import { RanfRequestFormAppModule } from 'projects/@ranf/request-form/src/app/app.module';
import { RanfUtCheckAppModule } from 'projects/@ranf/ut-check/src/app/app.module';
import { StorageExtensionRequestFormAppModule } from 'projects/@storage-extension/request-form/src/app/app.module';



@NgModule({
  exports: [
    RanfRequestFormAppModule,
    RanfUtCheckAppModule,
    CreateSRRequestFormAppModule,
    CreateRfcRequestFormAppModule,
    BillingRequestFormAppModule,
    PhoneForwardingRequestFormAppModule,
    CreateNFSVolumeRequestFormAppModule,
    StorageExtensionRequestFormAppModule
  ]
})
export class FormsImportModule { }
