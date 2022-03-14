import { Component } from '@angular/core';
import { ContentUiService } from './content-ui';
import { Subject } from 'rxjs';
import { RequestContext } from './requests/ce-request/ce-request.component';
import { filter, takeUntil } from 'rxjs/operators';
import { AppInitializeService } from './app-initialize.service';
import { TaskContext } from './user-tasks/user-task-zone.component';

// TODO: Needs to be adjusted for every UseCase form
import * as Payload from '../../../@patchautomation/request-form/mocks/Payload.json';
import * as ConfigPayload from '../../../@patchautomation/request-form/mocks/ConfigPayload.json';
import * as Validation from '../../../@patchautomation/request-form/mocks/Validation.json';

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

  requestContext: RequestContext;
  taskContext: TaskContext;


  constructor(
    private initialize: AppInitializeService,
    public ui: ContentUiService) {

    ui.Header.Show = true;
    ui.Footer.Show = true;
  }

  ngOnInit() {
    this.ui.Header.Title = 'Custom Element Development';
    this.ui.Header.SubTitle = 'Angular Live Development Server';
    this.requestContext = this.BuildRequestContext();
    this.taskContext = this.BuildCeTaskContext();

    // TODO add Payload into the Payload.json file inside the ./mock folder if necessary
    this.requestContext.Payload = (Payload as any).default;
    this.taskContext.Payload = (Payload as any).default;

    // TODO add ConfigPayload into the ConfigPayload.json file inside the ./mock folder if necessary
    this.requestContext.ConfigPayload = (ConfigPayload as any).default;
    this.taskContext.ConfigPayload = (ConfigPayload as any).default;

    // TODO add Validation into the Validation.json file inside the ./mock folder if necessary
    this.requestContext.Validation = (Validation as any).default;
    this.taskContext.Validation = (Validation as any).default;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private BuildRequestContext() {

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

    return context;
  }

  private BuildCeTaskContext() {

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
    return context;


  }

}
