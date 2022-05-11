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
import { VMCreateRequestFormv3AppModule } from './@vmcreate/request-form-v3/src/app/app.module';
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
import { SapStartupRequestFormAppModule } from './@sap-startup/request-form/src/app/app.module';
import { SapApplicationRundownRequestFormAppModule } from './@sap-application-rundown/request-form/src/app/app.module';
import { SapApplicationRundownUTNasOfflineAppModule } from './@sap-application-rundown/ut-nas-offline/src/app/app.module';
import { SapApplicationRundownUTSelectStorageAppModule } from './@sap-application-rundown/ut-select-storage/src/app/app.module';
import { TestRequestRequestFormAppModule } from './@test-request/request-form/src/app/app.module';
import { PatchautomationProcessReportRequestFormAppModule } from './@patchautomation-process-report/request-form/src/app/app.module';
import { VMCpuRamExtensionRequestFormAppModule } from './@vm-cpu-ram-extension/request-form/src/app/app.module';
import { CreateSnapshotRequestFormAppModule } from './@create-snapshot/request-form/src/app/app.module';
import { CreateIPNetworkRequestFormAppModule } from './@create-ip-network/request-form/src/app/app.module';
import { CreateIPNetworkUTApproveAppModule } from './@create-ip-network/ut-approve/src/app/app.module';
import { CreateIPNetworkUTConfigureNetworkDevicesAppModule } from './@create-ip-network/ut-configure-network-devices/src/app/app.module';
import { CreateIPNetworkUTConfigureSwitchingCategoryAppModule } from './@create-ip-network/ut-configure-switching-category/src/app/app.module';
import { CreateIPNetworkUTConfirmationCompletenessAppModule } from './@create-ip-network/ut-confirmation-completeness/src/app/app.module';
import { CreateIPNetworkUTCreateNetworkConfigAppModule } from './@create-ip-network/ut-create-network-config/src/app/app.module';
import { TestUserTaskProcessRequestFormAppModule } from './@test-user-task-process/request-form/src/app/app.module';
import { TestUserTaskUTUserTaskAppModule } from './@test-user-task-process/ut-user-task/src/app/app.module';
import { UniversalTapExecutionIdpaProxyRedeploymentRequestFormAppModule } from './@universal-tap-execution/idpa-proxy-redeployment-request-form/src/app/app.module';

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
    VMCreateRequestFormv3AppModule,
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
    IdpaProxyRequestFormAppModule,
    SapStartupRequestFormAppModule,
    SapApplicationRundownRequestFormAppModule,
    SapApplicationRundownUTNasOfflineAppModule,
    SapApplicationRundownUTSelectStorageAppModule,
    TestRequestRequestFormAppModule,
    PatchautomationProcessReportRequestFormAppModule,
    VMCpuRamExtensionRequestFormAppModule,
    CreateSnapshotRequestFormAppModule,
    CreateIPNetworkRequestFormAppModule,
    CreateIPNetworkUTApproveAppModule,
    CreateIPNetworkUTConfigureNetworkDevicesAppModule,
    CreateIPNetworkUTConfigureSwitchingCategoryAppModule,
    CreateIPNetworkUTConfirmationCompletenessAppModule,
    CreateIPNetworkUTCreateNetworkConfigAppModule,
    TestUserTaskProcessRequestFormAppModule,
    TestUserTaskUTUserTaskAppModule,
    UniversalTapExecutionIdpaProxyRedeploymentRequestFormAppModule
  ]
})
export class UseCasesFormsAppModule { }
