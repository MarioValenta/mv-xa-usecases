import { Component } from '@angular/core';
import { ContentUiService } from './content-ui';
import { Subject } from 'rxjs';
import { RequestContext } from './requests/ce-request/ce-request.component';
import { filter, takeUntil } from 'rxjs/operators';
import { AppInitializeService } from './app-initialize.service';
import { TaskContext } from './user-tasks/user-task-zone.component';

// Test_Request
import * as Test_Request_Payload from '../../../@test-request/request-form/mocks/Payload.json';
import * as Test_Request_ConfigPayload from '../../../@test-request/request-form/mocks/ConfigPayload.json';
import * as Test_Request_Validation from '../../../@test-request/request-form/mocks/Validation.json';
// Test User Task Process
import * as Test_User_Task_Process_Payload from '../../../@test-user-task-process/request-form/mocks/Payload.json';
import * as Test_User_Task_Process_ConfigPayload from '../../../@test-user-task-process/request-form/mocks/ConfigPayload.json';
import * as Test_User_Task_Process_Validation from '../../../@test-user-task-process/request-form/mocks/Validation.json';
// Test User Task Process
import * as Test_User_Task_Process_UT_User_Task_Payload from '../../../@test-user-task-process/ut-user-task/mocks/Payload.json';
import * as Test_User_Task_Process_UT_User_Task_ConfigPayload from '../../../@test-user-task-process/ut-user-task/mocks/ConfigPayload.json';
import * as Test_User_Task_Process_UT_User_Task_Validation from '../../../@test-user-task-process/ut-user-task/mocks/Validation.json';
// Create SR
import * as CreateSR_Payload from '../../../@create-sr/request-form/mocks/Payload.json';
import * as CreateSR_ConfigPayload from '../../../@create-sr/request-form/mocks/ConfigPayload.json';
import * as CreateSR_Validation from '../../../@create-sr/request-form/mocks/Validation.json';
// Create RfC
import * as CreateRFC_Payload from '../../../@create-rfc/request-form/mocks/Payload.json';
import * as CreateRFC_ConfigPayload from '../../../@create-rfc/request-form/mocks/ConfigPayload.json';
import * as CreateRFC_Validation from '../../../@create-rfc/request-form/mocks/Validation.json';
// RANF request-form
import * as CreateRANF_Payload from '../../../@ranf/request-form/mocks/Payload.json';
import * as CreateRANF_ConfigPayload from '../../../@ranf/request-form/mocks/ConfigPayload.json';
import * as CreateRANF_Validation from '../../../@ranf/request-form/mocks/Validation.json';
// RANF user-task-check
import * as CreateRANF_UT_Check_Payload from '../../../@ranf/ut-check/mocks/PayloadUT.json';
import * as CreateRANF_UT_Check_ConfigPayload from '../../../@ranf/ut-check/mocks/ConfigPayload.json';
import * as CreateRANF_UT_Check_Validation from '../../../@ranf/ut-check/mocks/Validation.json';
// Billing
import * as Billing_Payload from '../../../@billing/request-form/mocks/Payload.json';
import * as Billing_ConfigPayload from '../../../@billing/request-form/mocks/ConfigPayload.json';
import * as Billing_Validation from '../../../@billing/request-form/mocks/Validation.json';
// Phoneforwarding
import * as Phoneforwarding_Payload from '../../../@phoneforwarding/request-form/mocks/Payload.json';
import * as Phoneforwarding_ConfigPayload from '../../../@phoneforwarding/request-form/mocks/ConfigPayload.json';
import * as Phoneforwarding_Validation from '../../../@phoneforwarding/request-form/mocks/Validation.json';
// Create NFS
import * as CreateNFS_Payload from '../../../@create-nfs-volume/request-form/mocks/Payload.json';
import * as CreateNFS_ConfigPayload from '../../../@create-nfs-volume/request-form/mocks/ConfigPayload.json';
import * as CreateNFS_Validation from '../../../@create-nfs-volume/request-form/mocks/Validation.json';
// Storage Extension
import * as Storage_Extension_Payload from '../../../@storage-extension/request-form/mocks/Payload.json';
import * as Storage_Extension_ConfigPayload from '../../../@storage-extension/request-form/mocks/ConfigPayload.json';
import * as Storage_Extension_Validation from '../../../@storage-extension/request-form/mocks/Validation.json';
// Patchautomation
import * as Patchautomation_Payload from '../../../@patchautomation/request-form/mocks/Payload.json';
import * as Patchautomation_ConfigPayload from '../../../@patchautomation/request-form/mocks/ConfigPayload.json';
import * as Patchautomation_Validation from '../../../@patchautomation/request-form/mocks/Validation.json';
// Patchautomation_Remove
import * as Patchautomation_Remove_Payload from '../../../@patchautomation-remove/request-form/mocks/Payload.json';
import * as Patchautomation_Remove_ConfigPayload from '../../../@patchautomation-remove/request-form/mocks/ConfigPayload.json';
import * as Patchautomation_Remove_Validation from '../../../@patchautomation-remove/request-form/mocks/Validation.json';
// Patchautomation Process Report
import * as Patchautomation_Process_Report_Payload from '../../../@patchautomation-process-report/request-form/mocks/Payload.json';
import * as Patchautomation_Process_Report_ConfigPayload from '../../../@patchautomation-process-report/request-form/mocks/ConfigPayload.json';
import * as Patchautomation_Process_Report_Validation from '../../../@patchautomation-process-report/request-form/mocks/Validation.json';
// VM Create request-form-v1
import * as VMCreate_v1_Payload from '../../../@vmcreate/request-form/mocks/Payload.json';
import * as VMCreate_v1_ConfigPayload from '../../../@vmcreate/request-form/mocks/ConfigPayload.json';
import * as VMCreate_v1_Validation from '../../../@vmcreate/request-form/mocks/Validation.json';
// VM Create request-form-v2
import * as VMCreate_v2_Payload from '../../../@vmcreate/request-form-v2/mocks/Payload.json';
import * as VMCreate_v2_ConfigPayload from '../../../@vmcreate/request-form-v2/mocks/ConfigPayload.json';
import * as VMCreate_v2_Validation from '../../../@vmcreate/request-form-v2/mocks/Validation.json';
// Create F5 Virtual Server request-form
import * as CreateF5VirtualServer_RF_Payload from '../../../@create-f5-virtual-server/request-form/mocks/Payload.json';
import * as CreateF5VirtualServer_RF_ConfigPayload from '../../../@create-f5-virtual-server/request-form/mocks/ConfigPayload.json';
import * as CreateF5VirtualServer_RF_Validation from '../../../@create-f5-virtual-server/request-form/mocks/Validation.json';
// Create F5 Virtual Server user-task-validate-data
import * as CreateF5VirtualServer_UT_Validate_Payload from '../../../@create-f5-virtual-server/ut-validate-data/mocks/Payload.json';
import * as CreateF5VirtualServer_UT_Validate_ConfigPayload from '../../../@create-f5-virtual-server/ut-validate-data/mocks/ConfigPayload.json';
import * as CreateF5VirtualServer_UT_Validate_Validation from '../../../@create-f5-virtual-server/ut-validate-data/mocks/Validation.json';
// Create Oracle Database
import * as Create_Oracle_DB_Payload from '../../../@create-oracle-database/request-form/mocks/Payload.json';
import * as Create_Oracle_DB_ConfigPayload from '../../../@create-oracle-database/request-form/mocks/ConfigPayload.json';
import * as Create_Oracle_DB_Validation from '../../../@create-oracle-database/request-form/mocks/Validation.json';
// Create Oracle VM
import * as Create_Oracle_VM_Payload from '../../../@create-oracle-vm/request-form/mocks/Payload.json';
import * as Create_Oracle_VM_ConfigPayload from '../../../@create-oracle-vm/request-form/mocks/ConfigPayload.json';
import * as Create_Oracle_VM_Validation from '../../../@create-oracle-vm/request-form/mocks/Validation.json';
// Oracle DB Rundown request-form
import * as Oracle_DB_Rundown_RF_Payload from '../../../@oracle-db-rundown/request-form/mocks/Payload.json';
import * as Oracle_DB_Rundown_RF_ConfigPayload from '../../../@oracle-db-rundown/request-form/mocks/ConfigPayload.json';
import * as Oracle_DB_Rundown_RF_Validation from '../../../@oracle-db-rundown/request-form/mocks/Validation.json';
// Oracle DB Rundown ut-enter-interface
import * as Oracle_DB_Rundown_UT_Enter_Interface_Payload from '../../../@oracle-db-rundown/ut-enter-interface/mocks/Payload.json';
import * as Oracle_DB_Rundown_UT_Enter_Interface_ConfigPayload from '../../../@oracle-db-rundown/ut-enter-interface/mocks/ConfigPayload.json';
import * as Oracle_DB_Rundown_UT_Enter_Interface_Validation from '../../../@oracle-db-rundown/ut-enter-interface/mocks/Validation.json';
// Oracle DB Rundown ut-enter-storage
import * as Oracle_DB_Rundown_UT_Enter_Storage_Payload from '../../../@oracle-db-rundown/ut-enter-storage/mocks/Payload.json';
import * as Oracle_DB_Rundown_UT_Enter_Storage_ConfigPayload from '../../../@oracle-db-rundown/ut-enter-storage/mocks/ConfigPayload.json';
import * as Oracle_DB_Rundown_UT_Enter_Storage_Validation from '../../../@oracle-db-rundown/ut-enter-storage/mocks/Validation.json';
// Oracle DB Rundown ut-select-interface
import * as Oracle_DB_Rundown_UT_Select_Interface_Payload from '../../../@oracle-db-rundown/ut-select-interface/mocks/Payload.json';
import * as Oracle_DB_Rundown_UT_Select_Interface_ConfigPayload from '../../../@oracle-db-rundown/ut-select-interface/mocks/ConfigPayload.json';
import * as Oracle_DB_Rundown_UT_Select_Interface_Validation from '../../../@oracle-db-rundown/ut-select-interface/mocks/Validation.json';
// Oracle DB Rundown ut-select-storage
import * as Oracle_DB_Rundown_UT_Select_Storage_Payload from '../../../@oracle-db-rundown/ut-select-storage/mocks/Payload.json';
import * as Oracle_DB_Rundown_UT_Select_Storage_ConfigPayload from '../../../@oracle-db-rundown/ut-select-storage/mocks/ConfigPayload.json';
import * as Oracle_DB_Rundown_UT_Select_Storage_Validation from '../../../@oracle-db-rundown/ut-select-storage/mocks/Validation.json';
// Universal Tap Execution KFA Deploy Context
import * as UTE_KFA_Deployment_Payload from '../../../@universal-tap-execution/kfa-deployment-request-form/mocks/Payload.json';
import * as UTE_KFA_Deployment_ConfigPayload from '../../../@universal-tap-execution/kfa-deployment-request-form/mocks/ConfigPayload.json';
import * as UTE_KFA_Deployment_Validation from '../../../@universal-tap-execution/kfa-deployment-request-form/mocks/Validation.json';
// Create Problem
import * as CreateProblem_Payload from '../../../@create-problem/request-form/mocks/Payload.json';
import * as CreateProblem_ConfigPayload from '../../../@create-problem/request-form/mocks/ConfigPayload.json';
import * as CreateProblem_Validation from '../../../@create-problem/request-form/mocks/Validation.json';
// Create Incident
import * as CreateIncident_Payload from '../../../@create-incident/request-form/mocks/Payload.json';
import * as CreateIncident_ConfigPayload from '../../../@create-incident/request-form/mocks/ConfigPayload.json';
import * as CreateIncident_Validation from '../../../@create-incident/request-form/mocks/Validation.json';
// Server Rundown
import * as Server_Rundown_Payload from '../../../@server-rundown/request-form/mocks/Payload.json';
import * as Server_Rundown_ConfigPayload from '../../../@server-rundown/request-form/mocks/ConfigPayload.json';
import * as Server_Rundown_Validation from '../../../@server-rundown/request-form/mocks/Validation.json';
// Server Rundown ut-nas-offline
import * as Server_Rundown_UT_NAS_Offline_Payload from '../../../@server-rundown/ut-nas-offline/mocks/Payload.json';
import * as Server_Rundown_UT_NAS_Offline_ConfigPayload from '../../../@server-rundown/ut-nas-offline/mocks/ConfigPayload.json';
import * as Server_Rundown_UT_NAS_Offline_Validation from '../../../@server-rundown/ut-nas-offline/mocks/Validation.json';
// Server Rundown ut-select-storage
import * as Server_Rundown_UT_Select_Storage_Payload from '../../../@server-rundown/ut-select-storage/mocks/Payload.json';
import * as Server_Rundown_UT_Select_Storage_ConfigPayload from '../../../@server-rundown/ut-select-storage/mocks/ConfigPayload.json';
import * as Server_Rundown_UT_Select_Storage_Validation from '../../../@server-rundown/ut-select-storage/mocks/Validation.json';
// IDPA Proxy Context
import * as Idpa_Proxy_Payload from '../../../@idpa-proxy/request-form/mocks/Payload.json';
import * as Idpa_Proxy_ConfigPayload from '../../../@idpa-proxy/request-form/mocks/ConfigPayload.json';
import * as Idpa_Proxy_Validation from '../../../@idpa-proxy/request-form/mocks/Validation.json';
// SAP-Startup
import * as SAP_Startup_Payload from '../../../@sap-startup/request-form/mocks/Payload.json';
import * as SAP_Startup_ConfigPayload from '../../../@sap-startup/request-form/mocks/ConfigPayload.json';
import * as SAP_Startup_Validation from '../../../@sap-startup/request-form/mocks/Validation.json';
// SAP Application Rundown
import * as SAP_Application_Rundown_Payload from '../../../@sap-application-rundown/request-form/mocks/Payload.json';
import * as SAP_Application_Rundown_ConfigPayload from '../../../@sap-application-rundown/request-form/mocks/ConfigPayload.json';
import * as SAP_Application_Rundown_Validation from '../../../@sap-application-rundown/request-form/mocks/Validation.json';
// SAP Application Rundown UT NAS Offline
import * as SAP_Application_Rundown_UT_NAS_Offline_Payload from '../../../@sap-application-rundown/ut-nas-offline/mocks/Payload.json';
import * as SAP_Application_Rundown_UT_NAS_Offline_ConfigPayload from '../../../@sap-application-rundown/ut-nas-offline/mocks/ConfigPayload.json';
import * as SAP_Application_Rundown_UT_NAS_Offline_Validation from '../../../@sap-application-rundown/ut-nas-offline/mocks/Validation.json';
// SAP Application Rundown UT Select Storage
import * as SAP_Application_Rundown_UT_Select_Storage_Payload from '../../../@sap-application-rundown/ut-nas-offline/mocks/Payload.json';
import * as SAP_Application_Rundown_UT_Select_Storage_ConfigPayload from '../../../@sap-application-rundown/ut-nas-offline/mocks/ConfigPayload.json';
import * as SAP_Application_Rundown_UT_Select_Storage_Validation from '../../../@sap-application-rundown/ut-nas-offline/mocks/Validation.json';
// VM CPU & RAM Extension
import * as VM_CPU_RAM_Extension_Payload from '../../../@vm-cpu-ram-extension/request-form/mocks/Payload.json';
import * as VM_CPU_RAM_Extension_ConfigPayload from '../../../@vm-cpu-ram-extension/request-form/mocks/ConfigPayload.json';
import * as VM_CPU_RAM_Extension_Validation from '../../../@vm-cpu-ram-extension/request-form/mocks/Validation.json';
// Create Snapshot
import * as Create_Snapshot_Payload from '../../../@create-snapshot/request-form/mocks/Payload.json';
import * as Create_Snapshot_ConfigPayload from '../../../@create-snapshot/request-form/mocks/ConfigPayload.json';
import * as Create_Snapshot_Validation from '../../../@create-snapshot/request-form/mocks/Validation.json';
// Create IP Network RF
import * as Create_IP_Network_RF_Payload from '../../../@create-ip-network/request-form/mocks/Payload.json';
import * as Create_IP_Network_RF_ConfigPayload from '../../../@create-ip-network/request-form/mocks/ConfigPayload.json';
import * as Create_IP_Network_RF_Validation from '../../../@create-ip-network/request-form/mocks/Validation.json';
// Create IP Network UT Approve
import * as Create_IP_Network_UT_Approve_Payload from '../../../@create-ip-network/ut-approve/mocks/Payload.json';
import * as Create_IP_Network_UT_Approve_ConfigPayload from '../../../@create-ip-network/ut-approve/mocks/ConfigPayload.json';
import * as Create_IP_Network_UT_Approve_Validation from '../../../@create-ip-network/ut-approve/mocks/Validation.json';
// Create IP Network UT Configure Network Devices
import * as Create_IP_Network_UT_Configure_Network_Devices_Payload from '../../../@create-ip-network/ut-configure-network-devices/mocks/Payload.json';
import * as Create_IP_Network_UT_Configure_Network_Devices_ConfigPayload from '../../../@create-ip-network/ut-configure-network-devices/mocks/ConfigPayload.json';
import * as Create_IP_Network_UT_Configure_Network_Devices_Validation from '../../../@create-ip-network/ut-configure-network-devices/mocks/Validation.json';
// Create IP Network UT Configure Switching Category
import * as Create_IP_Network_UT_Configure_Switching_Category_Payload from '../../../@create-ip-network/ut-configure-switching-category/mocks/Payload.json';
import * as Create_IP_Network_UT_Configure_Switching_Category_ConfigPayload from '../../../@create-ip-network/ut-configure-switching-category/mocks/ConfigPayload.json';
import * as Create_IP_Network_UT_Configure_Switching_Category_Validation from '../../../@create-ip-network/ut-configure-switching-category/mocks/Validation.json';
// Create IP Network UT Confirm Completeness
import * as Create_IP_Network_UT_Confirm_Completeness_Payload from '../../../@create-ip-network/ut-confirmation-completeness/mocks/Payload.json';
import * as Create_IP_Network_UT_Confirm_Completeness_ConfigPayload from '../../../@create-ip-network/ut-confirmation-completeness/mocks/ConfigPayload.json';
import * as Create_IP_Network_UT_Confirm_Completeness_Validation from '../../../@create-ip-network/ut-confirmation-completeness/mocks/Validation.json';
// Create IP Network UT Create Network Config
import * as Create_IP_Network_UT_Create_Network_Config_Payload from '../../../@create-ip-network/ut-create-network-config/mocks/Payload.json';
import * as Create_IP_Network_UT_Create_Network_Config_ConfigPayload from '../../../@create-ip-network/ut-create-network-config/mocks/ConfigPayload.json';
import * as Create_IP_Network_UT_Create_Network_Config_Validation from '../../../@create-ip-network/ut-create-network-config/mocks/Validation.json';


// TODO: add new imports for every project (request-form, user-tasks)
// TODO: Needs to be adjusted for every UseCase form
@Component({
  selector: 'app-html-forms',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppHtmlFormsComponent {
  title = 'HtmlForms';
  loading = true;
  notFound = false;
  destroy$ = new Subject();

  Test_Request_Context: RequestContext = this.BuildRequestContext({ payload: Test_Request_Payload, configPayload: Test_Request_ConfigPayload, validation: Test_Request_Validation });
  CreateSR_Context: RequestContext = this.BuildRequestContext({ payload: CreateSR_Payload, configPayload: CreateSR_ConfigPayload, validation: CreateSR_Validation });
  CreateIncident_Context: RequestContext = this.BuildRequestContext({ payload: CreateIncident_Payload, configPayload: CreateIncident_ConfigPayload, validation: CreateIncident_Validation });
  CreateRFC_Context: RequestContext = this.BuildRequestContext({ payload: CreateRFC_Payload, configPayload: CreateRFC_ConfigPayload, validation: CreateRFC_Validation });
  CreateProblem_Context: RequestContext = this.BuildRequestContext({ payload: CreateProblem_Payload, configPayload: CreateProblem_ConfigPayload, validation: CreateProblem_Validation });
  CreateF5VirtualServer_RF_Context: RequestContext = this.BuildRequestContext({ payload: CreateF5VirtualServer_RF_Payload, configPayload: CreateF5VirtualServer_RF_ConfigPayload, validation: CreateF5VirtualServer_RF_Validation });
  CreateF5VirtualServer_UT_Validate_Context: TaskContext = this.BuildCeTaskContext({ payload: CreateF5VirtualServer_UT_Validate_Payload, configPayload: CreateF5VirtualServer_UT_Validate_ConfigPayload, validation: CreateF5VirtualServer_UT_Validate_Validation });
  Create_Oracle_DB_Context: RequestContext = this.BuildRequestContext({ payload: Create_Oracle_DB_Payload, configPayload: Create_Oracle_DB_ConfigPayload, validation: Create_Oracle_DB_Validation });
  Create_Oracle_VM_Context: RequestContext = this.BuildRequestContext({ payload: Create_Oracle_VM_Payload, configPayload: Create_Oracle_VM_ConfigPayload, validation: Create_Oracle_VM_Validation });
  RANF_RF_Context: RequestContext = this.BuildRequestContext({ payload: CreateRANF_Payload, configPayload: CreateRANF_ConfigPayload, validation: CreateRANF_Validation });
  RANF_RF_UT_Check_Context: TaskContext = this.BuildCeTaskContext({ payload: CreateRANF_UT_Check_Payload, configPayload: CreateRANF_UT_Check_ConfigPayload, validation: CreateRANF_UT_Check_Validation });
  Billing_Context: RequestContext = this.BuildRequestContext({ payload: Billing_Payload, configPayload: Billing_ConfigPayload, validation: Billing_Validation });
  Phoneforwarding_Context: RequestContext = this.BuildRequestContext({ payload: Phoneforwarding_Payload, configPayload: Phoneforwarding_ConfigPayload, validation: Phoneforwarding_Validation });
  CreateNFS_Context: RequestContext = this.BuildRequestContext({ payload: CreateNFS_Payload, configPayload: CreateNFS_ConfigPayload, validation: CreateNFS_Validation });
  Storage_Extension_Context: RequestContext = this.BuildRequestContext({ payload: Storage_Extension_Payload, configPayload: Storage_Extension_ConfigPayload, validation: Storage_Extension_Validation });
  Patchautomation_Context: RequestContext = this.BuildRequestContext({ payload: Patchautomation_Payload, configPayload: Patchautomation_ConfigPayload, validation: Patchautomation_Validation });
  Patchautomation_Remove_Context: RequestContext = this.BuildRequestContext({ payload: Patchautomation_Remove_Payload, configPayload: Patchautomation_Remove_ConfigPayload, validation: Patchautomation_Remove_Validation });
  VMCreate_v1_Context: RequestContext = this.BuildRequestContext({ payload: VMCreate_v1_Payload, configPayload: VMCreate_v1_ConfigPayload, validation: VMCreate_v1_Validation });
  VMCreate_v2_Context: RequestContext = this.BuildRequestContext({ payload: VMCreate_v2_Payload, configPayload: VMCreate_v2_ConfigPayload, validation: VMCreate_v2_Validation });
  Oracle_DB_Rundown_RF_Context: RequestContext = this.BuildRequestContext({ payload: Oracle_DB_Rundown_RF_Payload, configPayload: Oracle_DB_Rundown_RF_ConfigPayload, validation: Oracle_DB_Rundown_RF_Validation });
  Oracle_DB_Rundown_UT_Enter_Interface_Context: TaskContext = this.BuildCeTaskContext({ payload: Oracle_DB_Rundown_UT_Enter_Interface_Payload, configPayload: Oracle_DB_Rundown_UT_Enter_Interface_ConfigPayload, validation: Oracle_DB_Rundown_UT_Enter_Interface_Validation });
  Oracle_DB_Rundown_UT_Enter_Storage_Context: TaskContext = this.BuildCeTaskContext({ payload: Oracle_DB_Rundown_UT_Enter_Storage_Payload, configPayload: Oracle_DB_Rundown_UT_Enter_Storage_ConfigPayload, validation: Oracle_DB_Rundown_UT_Enter_Storage_Validation });
  Oracle_DB_Rundown_UT_Select_Interface_Context: TaskContext = this.BuildCeTaskContext({ payload: Oracle_DB_Rundown_UT_Select_Interface_Payload, configPayload: Oracle_DB_Rundown_UT_Select_Interface_ConfigPayload, validation: Oracle_DB_Rundown_UT_Select_Interface_Validation });
  Oracle_DB_Rundown_UT_Select_Storage_Context: TaskContext = this.BuildCeTaskContext({ payload: Oracle_DB_Rundown_UT_Select_Storage_Payload, configPayload: Oracle_DB_Rundown_UT_Select_Storage_ConfigPayload, validation: Oracle_DB_Rundown_UT_Select_Storage_Validation });
  Universal_Tap_Execution_KFA_Deploy_Context: RequestContext = this.BuildRequestContext({ payload: UTE_KFA_Deployment_Payload, configPayload: UTE_KFA_Deployment_ConfigPayload, validation: UTE_KFA_Deployment_Validation });
  Server_Rundown_Context: RequestContext = this.BuildRequestContext({ payload: Server_Rundown_Payload, configPayload: Server_Rundown_ConfigPayload, validation: Server_Rundown_Validation });
  Server_Rundown_UT_NAS_Offline_Context: TaskContext = this.BuildCeTaskContext({ payload: Server_Rundown_UT_NAS_Offline_Payload, configPayload: Server_Rundown_UT_NAS_Offline_ConfigPayload, validation: Server_Rundown_UT_NAS_Offline_Validation });
  Server_Rundown_UT_Select_Storage_Context: TaskContext = this.BuildCeTaskContext({ payload: Server_Rundown_UT_Select_Storage_Payload, configPayload: Server_Rundown_UT_Select_Storage_ConfigPayload, validation: Server_Rundown_UT_Select_Storage_Validation });
  Idpa_Proxy_Context: RequestContext = this.BuildRequestContext({ payload: Idpa_Proxy_Payload, configPayload: Idpa_Proxy_ConfigPayload, validation: Idpa_Proxy_Validation });
  SAP_Startup_Context: RequestContext = this.BuildRequestContext({ payload: SAP_Startup_Payload, configPayload: SAP_Startup_ConfigPayload, validation: SAP_Startup_Validation });
  SAP_Application_Rundown_Context: RequestContext = this.BuildRequestContext({ payload: SAP_Application_Rundown_Payload, configPayload: SAP_Application_Rundown_ConfigPayload, validation: SAP_Application_Rundown_Validation });
  SAP_Application_Rundown_UT_NAS_Offline_Context: TaskContext = this.BuildCeTaskContext({ payload: SAP_Application_Rundown_UT_NAS_Offline_Payload, configPayload: SAP_Application_Rundown_UT_NAS_Offline_ConfigPayload, validation: SAP_Application_Rundown_UT_NAS_Offline_Validation });
  SAP_Application_Rundown_UT_Select_Storage_Context: TaskContext = this.BuildCeTaskContext({ payload: SAP_Application_Rundown_UT_Select_Storage_Payload, configPayload: SAP_Application_Rundown_UT_Select_Storage_ConfigPayload, validation: SAP_Application_Rundown_UT_Select_Storage_Validation });
  Patchautomation_Process_Report_Context: RequestContext = this.BuildRequestContext({ payload: Patchautomation_Process_Report_Payload, configPayload: Patchautomation_Process_Report_ConfigPayload, validation: Patchautomation_Process_Report_Validation });
  VM_CPU_RAM_Extension_Context: RequestContext = this.BuildRequestContext({ payload: VM_CPU_RAM_Extension_Payload, configPayload: VM_CPU_RAM_Extension_ConfigPayload, validation: VM_CPU_RAM_Extension_Validation });
  Create_Snaphsot_Context: RequestContext = this.BuildRequestContext({ payload: Create_Snapshot_Payload, configPayload: Create_Snapshot_ConfigPayload, validation: Create_Snapshot_Validation });
  Create_IP_Network_RF_Context: RequestContext = this.BuildRequestContext({ payload: Create_IP_Network_RF_Payload, configPayload: Create_IP_Network_RF_ConfigPayload, validation: Create_IP_Network_RF_Validation });
  Create_IP_Network_UT_Approve_Context: TaskContext = this.BuildCeTaskContext({ payload: Create_IP_Network_UT_Approve_Payload, configPayload: Create_IP_Network_UT_Approve_ConfigPayload, validation: Create_IP_Network_UT_Approve_Validation });
  Create_IP_Network_UT_Cofigure_Network_Devices_Context: TaskContext = this.BuildCeTaskContext({ payload: Create_IP_Network_UT_Configure_Network_Devices_Payload, configPayload: Create_IP_Network_UT_Configure_Network_Devices_ConfigPayload, validation: Create_IP_Network_UT_Configure_Network_Devices_Validation });
  Create_IP_Network_UT_Cofigure_Switching_Category_Context: TaskContext = this.BuildCeTaskContext({ payload: Create_IP_Network_UT_Configure_Switching_Category_Payload, configPayload: Create_IP_Network_UT_Configure_Switching_Category_ConfigPayload, validation: Create_IP_Network_UT_Configure_Switching_Category_Validation });
  Create_IP_Network_UT_Confirm_Completeness_Context: TaskContext = this.BuildCeTaskContext({ payload: Create_IP_Network_UT_Confirm_Completeness_Payload, configPayload: Create_IP_Network_UT_Confirm_Completeness_ConfigPayload, validation: Create_IP_Network_UT_Confirm_Completeness_Validation });
  Create_IP_Network_UT_Create_Network_Config_Context: TaskContext = this.BuildCeTaskContext({ payload: Create_IP_Network_UT_Create_Network_Config_Payload, configPayload: Create_IP_Network_UT_Create_Network_Config_ConfigPayload, validation: Create_IP_Network_UT_Create_Network_Config_Validation });
  Test_User_Task_Process_Context: RequestContext = this.BuildRequestContext({ payload: Test_User_Task_Process_Payload, configPayload: Test_User_Task_Process_ConfigPayload, validation: Test_User_Task_Process_Validation });
  Test_User_Task_Process_UT_User_Task_Context: TaskContext = this.BuildCeTaskContext({ payload: Test_User_Task_Process_UT_User_Task_Payload, configPayload: Test_User_Task_Process_UT_User_Task_ConfigPayload, validation: Test_User_Task_Process_UT_User_Task_Validation });

  constructor(
    private initialize: AppInitializeService,
    public ui: ContentUiService) {

    ui.Header.Show = true;
    ui.Footer.Show = true;
  }

  ngOnInit() {
    this.ui.Header.Title = 'Custom Element Development';
    this.ui.Header.SubTitle = 'Angular Live Development Server';
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  public BuildRequestContext(requestContextData: IContext) {

    const context = new RequestContext();
    context.subTitleSubject$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(title => this.ui.Header.SubTitle = title);

    context.validSubject$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(valid => {
      this.ui.Footer.SubmitButton.Enabled = valid;
    });

    this.ui.Footer.FeedbackButton.Clicked(() => {
      context.Feedback();
    });

    context.onFeedbackedSubject$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {

      if (result) {
        // TODO add modals from shared
        //  this.modalDialogService.OpenFeedbackRequestForm(result);
      }

    });

    this.ui.Footer.SubmitButton.Clicked(() => {
      console.log('Submitted REQUEST');

      this.ui.Footer.SubmitButton.Loading(true);
      this.ui.Footer.SubmitButton.Enabled = false;
      context.Submit();
    });

    context.onSubmitedSubject$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {
      if (context.Valid) {
        // this.modalDialogService.OpenFeedbackRequestForm(result);
        this.ui.Footer.SubmitButton.Loading(false);
        this.ui.Footer.SubmitButton.Enabled = true;
        console.log('value:', result);
      }
    });

    context.Payload = (requestContextData.payload as any).default;
    context.ConfigPayload = (requestContextData.configPayload as any).default;
    context.Validation = (requestContextData.validation as any).default;

    return context;
  }

  private BuildCeTaskContext(taskContextData: IContext) {

    const context = new TaskContext();

    context.validSubject$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(valid => {
      this.ui.Footer.SubmitButton.Enabled = valid;
      this.ui.Footer.ApproveButton.Enabled = valid;
    });

    this.ui.Footer.SubmitButton.Clicked(() => {
      console.log('Submitted TASK');

      this.ui.Footer.SubmitButton.Loading(true);
      this.ui.Footer.SubmitButton.Enabled = false;
      context.Submit();
    });


    context.onSubmitedSubject$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {
      if (context.Valid) {
        // this.modalDialogService.OpenFeedbackRequestForm(result);
        this.ui.Footer.SubmitButton.Loading(false);
        this.ui.Footer.SubmitButton.Enabled = true;
        console.log('value:', result);
      }
    });

    this.ui.Footer.SaveButton.Clicked(() => {
      this.ui.Footer.SaveButton.Loading(true);
      this.ui.Footer.SaveButton.Enabled = false;
      context.Save();
    });

    context.onSavedSubject$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {

      if (context.Valid) {

        // this.modalDialogService.OpenFeedbackRequestForm(result);

        this.ui.Footer.SaveButton.Loading(false);
        this.ui.Footer.SaveButton.Enabled = true;

        console.log('value:', result);
      }

    });

    this.ui.Footer.ApproveButton.Clicked(() => {
      this.ui.Footer.ApproveButton.Loading(true);
      this.ui.Footer.ApproveButton.Enabled = false;
      this.ui.Footer.RejectButton.Loading(true);
      this.ui.Footer.RejectButton.Enabled = false;
      context.Approve();
    });

    context.onApprovedSubject$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {


    });


    this.ui.Footer.RejectButton.Clicked(() => {
      context.Reject();
    });

    context.onRejectedSubject$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {

      this.ui.Footer.FeedbackButton.Clicked(() => {
        context.Feedback();
      });

      context.onFeedbackedSubject$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(result => {

        if (result) {
          // this.modalDialogService.OpenFeedbackRequestForm(result);

        }

      });

      context.visibleButtonsSubject$.pipe(
        takeUntil(this.destroy$),
        filter(command => !!command)
      ).subscribe(command => {

        switch (command.button) {
          case 'submit': {
            this.ui.Footer.SubmitButton.Show(command.visible);
            break;
          }
          case 'save': {
            this.ui.Footer.SaveButton.Show(command.visible);
            this.ui.Footer.SaveButton.Enabled = command.visible;
            break;
          }
          case 'approve': {
            this.ui.Footer.ApproveButton.Show(command.visible);
            this.ui.Footer.ApproveButton.Enabled = command.visible;
            break;
          }
          case 'reject': {
            this.ui.Footer.RejectButton.Show(command.visible);
            this.ui.Footer.RejectButton.Enabled = command.visible;
            break;
          }
          case 'feedback': {
            this.ui.Footer.FeedbackButton.Show(command.visible);
            this.ui.Footer.FeedbackButton.Enabled = command.visible;
            break;
          }
        }

      })
    });

    context.Payload = (taskContextData.payload as any).default;
    context.ConfigPayload = (taskContextData.configPayload as any).default;
    context.Validation = (taskContextData.validation as any).default;

    return context;


  }

}

interface IContext {
  payload: any;
  configPayload: any;
  validation: any;
}

