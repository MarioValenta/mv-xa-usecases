import { NgModule } from '@angular/core';
import { BillingRequestFormAppModule } from 'projects/@billing/request-form/src/app/app.module';
import { CreateF5VirtualServerRequestFormAppModule } from 'projects/@create-f5-virtual-server/request-form/src/app/app.module';
import { CreateF5VirtualServerUTValidateAppModule } from 'projects/@create-f5-virtual-server/ut-validate-data/src/app/app.module';
import { CreateNFSVolumeRequestFormAppModule } from 'projects/@create-nfs-volume/request-form/src/app/app.module';
import { CreateOracleDatabaseRequestFormAppModule } from 'projects/@create-oracle-database/request-form/src/app/app.module';
import { CreateRfcRequestFormAppModule } from 'projects/@create-rfc/request-form/src/app/app.module';
import { CreateSRRequestFormAppModule } from 'projects/@create-sr/request-form/src/app/app.module';
import { PatchautomationRemoveRequestFormAppModule } from 'projects/@patchautomation-remove/request-form/src/app/app.module';
import { PatchautomationRequestFormAppModule } from 'projects/@patchautomation/request-form/src/app/app.module';
import { PhoneForwardingRequestFormAppModule } from 'projects/@phoneforwarding/request-form/src/app/app.module';
import { RanfRequestFormAppModule } from 'projects/@ranf/request-form/src/app/app.module';
import { RanfUtCheckAppModule } from 'projects/@ranf/ut-check/src/app/app.module';
import { StorageExtensionRequestFormAppModule } from 'projects/@storage-extension/request-form/src/app/app.module';
import { UniversalTapExecutionKfaDeploymentRequestFormAppModule } from 'projects/@universal-tap-execution/kfa-deployment-request-form/src/app/app.module';
import { VMCreateRequestFormv2AppModule } from 'projects/@vmcreate/request-form-v2/src/app/app.module';
import { VMCreateRequestFormAppModule } from 'projects/@vmcreate/request-form/src/app/app.module';
import { OracleDbRdnRequestFormAppModule } from './@oracle-db-rundown/request-form/src/app/app.module';
import { OracleDbRdnUTEnterInterfaceAppModuleAppModule } from './@oracle-db-rundown/ut-enter-interface/src/app/app.module';
import { CreateProblemRequestFormAppModule } from './@create-problem/request-form/src/app/app.module';
import { CreateIncidentRequestFormAppModule } from './@create-incident/request-form/src/app/app.module';
import { OracleDbRdnUTEnterStorageAppModuleAppModule } from './@oracle-db-rundown/ut-enter-storage/src/app/app.module';
import { OracleDbRdnUTSelectInterfaceAppModuleAppModule } from './@oracle-db-rundown/ut-select-interface/src/app/app.module';
import { OracleDbRdnUTSelectStorageAppModuleAppModule } from './@oracle-db-rundown/ut-select-storage/src/app/app.module';
import { CreateOracleVMRequestFormAppModule } from './@create-oracle-vm/request-form/src/app/app.module';
import { ServerRundownRequestFormAppModule } from './@server-rundown/request-form/src/app/app.module';
import { ServerRundownUTNasOfflineAppModule } from './@server-rundown/ut-nas-offline/src/app/app.module';
import { ServerRundownUTSelectStorageAppModule } from './@server-rundown/ut-select-storage/src/app/app.module';
import { IdpaProxyRequestFormAppModule } from 'projects/@idpa-proxy/request-form/src/app/app.module';

@NgModule({
  exports: [
    RanfRequestFormAppModule,
    RanfUtCheckAppModule,
    CreateSRRequestFormAppModule,
    CreateIncidentRequestFormAppModule,
    CreateRfcRequestFormAppModule,
    BillingRequestFormAppModule,
    PhoneForwardingRequestFormAppModule,
    CreateNFSVolumeRequestFormAppModule,
    StorageExtensionRequestFormAppModule,
    PatchautomationRequestFormAppModule,
    PatchautomationRemoveRequestFormAppModule,
    VMCreateRequestFormAppModule,
    CreateF5VirtualServerRequestFormAppModule,
    CreateF5VirtualServerUTValidateAppModule,
    CreateOracleDatabaseRequestFormAppModule,
    VMCreateRequestFormv2AppModule,
    UniversalTapExecutionKfaDeploymentRequestFormAppModule,
    OracleDbRdnRequestFormAppModule,
    OracleDbRdnUTEnterInterfaceAppModuleAppModule,
    OracleDbRdnUTEnterStorageAppModuleAppModule,
    OracleDbRdnUTSelectInterfaceAppModuleAppModule,
    OracleDbRdnUTSelectStorageAppModuleAppModule,
    CreateProblemRequestFormAppModule,
    CreateOracleVMRequestFormAppModule,
    ServerRundownRequestFormAppModule,
    ServerRundownUTNasOfflineAppModule,
    ServerRundownUTSelectStorageAppModule,
    IdpaProxyRequestFormAppModule
  ]
})
export class UseCasesFormsAppModule { }
