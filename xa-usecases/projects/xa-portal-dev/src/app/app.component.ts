import { Component } from '@angular/core';
import { ContentUiService } from './content-ui';
import { Subject } from 'rxjs';
import { RequestContext } from './requests/ce-request/ce-request.component';
import { filter, takeUntil } from 'rxjs/operators';
import { AppInitializeService } from './app-initialize.service';
import { TaskContext } from './user-tasks/user-task-zone.component';

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
// Universal Tap Execution KFA Deploy Context
import * as UTE_KFA_Deployment_Payload from '../../../@universal-tap-execution/kfa-deployment-request-form/mocks/Payload.json';
import * as UTE_KFA_Deployment_ConfigPayload from '../../../@universal-tap-execution/kfa-deployment-request-form/mocks/ConfigPayload.json';
import * as UTE_KFA_Deployment_Validation from '../../../@universal-tap-execution/kfa-deployment-request-form/mocks/Validation.json';
// Create Problem
import * as CreateProblem_Payload from '../../../@create-problem/request-form/mocks/Payload.json';
import * as CreateProblem_ConfigPayload from '../../../@create-problem/request-form/mocks/ConfigPayload.json';
import * as CreateProblem_Validation from '../../../@create-problem/request-form/mocks/Validation.json';

// Create Incident
import * as CreateIncident_Payload from '../../../@create-incident/mocks/Payload.json';
import * as CreateIncident_ConfigPayload from '../../../@create-incident/mocks/ConfigPayload.json';
import * as CreateIncident_Validation from '../../../@create-incident/mocks/Validation.json';

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

  CreateSR_Context: RequestContext = this.BuildRequestContext({ payload: CreateSR_Payload, configPayload: CreateSR_ConfigPayload, validation: CreateSR_Validation });
  CreateIncident_Context: RequestContext = this.BuildRequestContext({ payload: CreateIncident_Payload, configPayload: CreateIncident_ConfigPayload, validation: CreateIncident_Validation });
  CreateRFC_Context: RequestContext = this.BuildRequestContext({ payload: CreateRFC_Payload, configPayload: CreateRFC_ConfigPayload, validation: CreateRFC_Validation });
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
  CreateF5VirtualServer_RF_Context: RequestContext = this.BuildRequestContext({ payload: CreateF5VirtualServer_RF_Payload, configPayload: CreateF5VirtualServer_RF_ConfigPayload, validation: CreateF5VirtualServer_RF_Validation });
  CreateF5VirtualServer_UT_Validate_Context: TaskContext = this.BuildCeTaskContext({ payload: CreateF5VirtualServer_UT_Validate_Payload, configPayload: CreateF5VirtualServer_UT_Validate_ConfigPayload, validation: CreateF5VirtualServer_UT_Validate_Validation });
  Create_Oracle_DB_Context: RequestContext = this.BuildRequestContext({ payload: Create_Oracle_DB_Payload, configPayload: Create_Oracle_DB_ConfigPayload, validation: Create_Oracle_DB_Validation });
  Universal_Tap_Execution_KFA_Deploy_Context: RequestContext = this.BuildRequestContext({ payload: UTE_KFA_Deployment_Payload, configPayload: UTE_KFA_Deployment_ConfigPayload, validation: UTE_KFA_Deployment_Validation });
  CreateProblem_Context: RequestContext = this.BuildRequestContext({ payload: CreateProblem_Payload, configPayload: CreateProblem_ConfigPayload, validation: CreateProblem_Validation });
 
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
        console.log('value:', result.value);
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
        console.log('value:', result.value);
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

        console.log('value:', result.value);
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

