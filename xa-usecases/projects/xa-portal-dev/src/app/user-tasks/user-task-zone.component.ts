import { Component, Injector, ComponentFactoryResolver, ViewContainerRef, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit, TemplateRef, OnDestroy, Type } from '@angular/core';
import { IUserTask } from './models/i-user-task.model';
import { ActivatedRoute } from '@angular/router';
import { UserTaskDto } from './models/user-task-dto.model';
import { ContentUiService } from '../content-ui';
import { of, merge, Subject, Observable, combineLatest, BehaviorSubject, zip, from, empty } from 'rxjs';
import { take, map, takeUntil, switchMap, tap, filter, finalize } from 'rxjs/operators';
import { HttpService } from '../shared/services';

import { XANotifyService, XAModalPageBuilder } from '@xa/ui';
import { CETaskContext } from './ce-tasks/ce-task-context';
import { ICETaskContext, FeedbackTaskPayload, RejectTaskPayload, ApproveTaskPayload, SaveTaskPayload, SubmitTaskPayload, JsonHelper } from "@xa/lib-ui-common";
import { XAModalService } from '@xa/ui';

@Component({
  selector: 'user-task-zone',
  template: `

<div class="ui container" style="width: 600px;margin-top:10%" *ngIf="notFound">
    <div class="ui red icon message">
        <i class="exclamation triangle icon"></i>
        <div class="content">
            <pre>Can't find a Form for this Usertask ({{task?.TaskDefinitionKey}})</pre>
        </div>
    </div>
</div>

<div class="dynamic-task-container">
    <div class="ui active text loader" *ngIf="loading">Loading</div>
</div>

<ng-container #vc></ng-container>

<ng-template #menu>
    <ng-container>
        <!-- <a class="item" [routerLink]="['/myrequest', task.RequestId]">
            Process Details
        </a>
        <a class="item" (click)="Claim()" *ngIf="!claimedByMe">
            Claim
        </a>
        <a class="item" (click)="UnClaim()" *ngIf="claimedByMe">
            UnClaim
        </a> -->
    </ng-container>
</ng-template>


    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTaskZoneComponent implements AfterViewInit, OnDestroy {


  // @ViewChild('vc', { read: ViewContainerRef }) vc: ViewContainerRef;

  // @ViewChild('menu') menu: TemplateRef<any>;

  activeTaskComponent: IUserTask;

  destroy$ = new Subject();

  taskInstanceUpdate$: Observable<UserTaskDto>;

  claimedByMe: boolean;

  notFound = false;
  task: UserTaskDto;
  loading = true;


  constructor(
    private injector: Injector,
    private cfr: ComponentFactoryResolver,
    //private userTaskresolver: UserTaskResolverService,
    //private store: Store<AppState>,
    private route: ActivatedRoute,
    private cref: ChangeDetectorRef,
    private ui: ContentUiService,
    //private userTaskService: UserTasksService,
    private http: HttpService,
    private notifyService: XANotifyService,
    //private modalDialogService: ModalService
  ) {


    ui.Header.Show = true;
    ui.Header.Title = 'Open Tasks';

  }

  tick() {
    setTimeout(() => {
      this.cref.markForCheck();
    });
  }

  ngAfterViewInit() {
    // this.route.params.pipe(
    //   take(1)
    // ).subscribe(params => {
    //   const id = params['id'];
    //   if (!!id) {

    //     this.userTaskService.GetById(id).pipe(
    //       map(resp => resp.Data)
    //     ).subscribe(task => {
    //       if (task) {
    //         this.task = task;
    //         this.OpenTask(task);
    //       }
    //     });
    //   }
    // });


  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  // OpenTask(userTask: UserTaskDto) {

  //   this.ui.Header.Title = userTask.TaskDefinitionName;

  //   this.ui.Footer.SubmitButton.Show(false);
  //   this.ui.Footer.SaveButton.Show(false);
  //   this.ui.Footer.FeedbackButton.Show(false);
  //   this.ui.Footer.ApproveButton.Show(false);
  //   this.ui.Footer.RejectButton.Show(false);


  //   combineLatest(merge(of(userTask), this.taskInstanceUpdate$)).pipe(
  //     filter(([user, _task]) => {
  //       return !!user && !!_task;
  //     }),
  //     map(([user, _task]) => {
  //       if (_task) {
  //         if (_task.AssignedTo === 'DEVELOPER') {
  //           this.claimedByMe = true;
  //         } else {
  //           this.claimedByMe = false;
  //         }
  //       }
  //       return _task;
  //     }),
  //     switchMap(task => {
  //       //return this.TryAddCETaskComponent(task);
  //     }),
  //     map(status => {
  //       if (status.formfound) {
  //         return status;
  //       }
  //       //return this.TryAddBuiltInComponent(status.task);
  //     }),
  //     map(status => {
  //       if (status.formfound) {
  //         return status;
  //       }
  //       //return this.TryAddGenericComponent(status.task);
  //     }),
  //     tap(status => {

  //       if (!status.formfound) {
  //         this.notFound = true;
  //       } else {

  //         switch (status.formfound) {
  //           case 'BuiltIn': {
  //             break;
  //           }
  //           case 'GenericForm': {
  //             /* this.ui.Footer.SubmitButton.Show(true);
  //             this.ui.Footer.SaveButton.Show(true);*/
  //             this.ui.Footer.FeedbackButton.Show(true);
  //             break;
  //           }
  //           case 'CustomElement': {
  //             break;
  //           }
  //         }

  //         this.ui.Header.SetMenu(this.menu);
  //         this.ui.Footer.Show = true;

  //       }
  //       this.loading = false;
  //     })
  //   ).subscribe(_ => this.tick());

  // }

  // private TryAddBuiltInComponent(task: UserTaskDto): UserTaskComponentStatus {

  //   try {
  //     let info = this.userTaskresolver.GetBuiltInComponent(task.ProcessDefinitionKey, task.TaskDefinitionName, task.TaskVersion);
  //     if (!info) {
  //       return {
  //         task: task
  //       }
  //     }

  //     const factory = this.cfr.resolveComponentFactory(info.TaskType);
  //     const componentRef = factory.create(this.injector);

  //     this.activeTaskComponent = componentRef.instance;

  //     this.activeTaskComponent.taskInstance = task;

  //     this.vc.clear();
  //     this.vc.insert(componentRef.hostView);

  //     this.tick();
  //     return {
  //       task: task,
  //       formfound: 'BuiltIn'
  //     }
  //   } catch {
  //     return {
  //       task: task
  //     }
  //   }

  // }

  // private TryAddCETaskComponent(task: UserTaskDto): Observable<UserTaskComponentStatus> {

  //   return this.userTaskService.GetCETaskContext(task.Id).pipe(
  //     map(context => {
  //       if (context) {

  //         return context;
  //       }

  //       return null;
  //     }),
  //     switchMap(context => {
  //       return zip(of(context), this.LoadCustomElement(context));
  //     }),
  //     map(([context, _]) => {
  //       this.AddCustomElement(context);
  //       return context;
  //     }),
  //     map(context => {

  //       let formType = null;
  //       if (!!context) {
  //         formType = 'CustomElemnt';
  //       }

  //       return {
  //         task: task,
  //         formfound: formType
  //       }

  //     })

  //   )

  // }

  // private TryAddGenericComponent(task: UserTaskDto): UserTaskComponentStatus {

  //   if (!task.Form || !task.Form.Fields) {
  //     return {
  //       task: task,
  //       formfound: null
  //     }
  //   }

  //   const formTypeField = task.Form.Fields.find(f => f.Id.toLocaleLowerCase() === 'formtype');
  //   let formType = (formTypeField && formTypeField.Type) || 'default';

  //   let type: Type<IUserTask>;

  //   // if (formType.toLowerCase() === 'approve') {
  //   //   type = GenericApproveTaskComponent;

  //   // } else {
  //   //   type = GenericTaskComponent;
  //   // }

  //   /* switch (formType.toLowerCase()) {
  //       case 'approve': {
  //           type = GenericApproveTaskComponent;

  //       }
  //       default: {
  //           type = GenericTaskComponent;
  //       }
  //   } */
  //   //console.log(formType)

  //   const factory = this.cfr.resolveComponentFactory(type);

  //   const componentRef = factory.create(this.injector);

  //   this.activeTaskComponent = componentRef.instance;

  //   this.activeTaskComponent.taskInstance = task;

  //   this.vc.clear();
  //   this.vc.insert(componentRef.hostView);

  //   this.tick();

  //   return {
  //     task: task,
  //     formfound: 'GenericForm'
  //   }
  // }



  // private LoadCustomElement(ceTaskContext: CETaskContext) {


  //     if (!ceTaskContext || !ceTaskContext.CustomElementId)
  //         return of(false);

  //     const exists = customElements.get(`ce-${ceTaskContext.CustomElementId}`);
  //     let func: Observable<string>;
  //     if (!exists) {
  //         func = this.http.GetText(`/api/requesttype/customElement/${ceTaskContext.CustomElementId}`).pipe(
  //             tap(ce => new Function(ce)()),
  //             map(ce => ceTaskContext.CustomElementId)
  //         )
  //     } else {
  //         func = of(ceTaskContext.CustomElementId)
  //     }

  //     return func.pipe(
  //         switchMap(id => customElements.whenDefined(`ce-${id}`)),
  //         map(_ => true)
  //     );
  // }

  // private AddCustomElement(ceTaskContext: CETaskContext) {

  //     if (!ceTaskContext || !ceTaskContext.CustomElementId)
  //         return;

  //     const container = document.querySelector('.dynamic-task-container');
  //     if (!container)
  //         return;

  //     while (container.hasChildNodes()) {
  //         container.removeChild(container.childNodes[0])
  //     }
  //     const ceo = customElements.get(`ce-${ceTaskContext.CustomElementId}`);
  //     const c = new ceo();
  //     const context = this.BuildCeTaskContext();

  //     if (ceTaskContext.SavedData) {
  //         try {
  //             context.Payload = { ...ceTaskContext.InputParameter, ...ceTaskContext.SavedData };
  //         } catch { }
  //     }

  //     if (ceTaskContext.ConfigPayload) {
  //         try {
  //             var withoutComments = JsonHelper.RemoveComments(ceTaskContext.ConfigPayload);
  //             context.ConfigPayload = JSON.parse(withoutComments);
  //         } catch { }
  //     }

  //     if (ceTaskContext.Validation) {
  //         try {
  //             var withoutComments = JsonHelper.RemoveComments(ceTaskContext.Validation);
  //             context.Validation = JSON.parse(withoutComments);
  //         } catch { }
  //     }

  //     c.Context = context;

  //     container.appendChild(c);

  // }


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

      // this.modalDialogService.OpenFeedbackRequestForm(result);

    });


    this.ui.Footer.SaveButton.Clicked(() => {
      this.ui.Footer.SaveButton.Loading(true);
      this.ui.Footer.SaveButton.Enabled = false;
      context.Save();
    });

    context.onSavedSubject$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {

      // this.userTaskService.Save(this.task.Id, result.value).pipe(
      //   finalize(() => {
      //     this.ui.Footer.SaveButton.Loading(false);
      //     this.ui.Footer.SaveButton.Enabled = true;
      //   })
      // ).subscribe(response => {
      //   this.notifyService.success('Your Task has been saved successfully.', {
      //     closeOnClick: true,
      //     timeout: 3000,
      //     pauseOnHover: true
      //   });
      // }, error => {
      //   this.notifyService.error('An Error occured', {
      //     closeOnClick: true,
      //     timeout: 3000,
      //     pauseOnHover: true
      //   });
      // })

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

      // if (context.Valid) {

      //   let body = {
      //     ...result.value,
      //     [result.resultName || '__approved']: result.resultValue || true,
      //   }

      //   this.userTaskService.Complete(this.task.Id, body, result.runtimeData || {}).pipe(
      //     finalize(() => {
      //       this.ui.Footer.ApproveButton.Loading(false);
      //       this.ui.Footer.ApproveButton.Enabled = true;
      //       this.ui.Footer.RejectButton.Loading(false);
      //       this.ui.Footer.RejectButton.Enabled = true;
      //     })
      //   ).subscribe(response => {
      //     this.notifyService.success('Task accepted.', {
      //       closeOnClick: true,
      //       timeout: 3000,
      //       pauseOnHover: true
      //     });
      //     this.ui.NavigateByUrl('/usertask');
      //   }, error => {
      //     this.notifyService.error('An Error occured', {
      //       closeOnClick: true,
      //       timeout: 3000,
      //       pauseOnHover: true
      //     });
      //   })

      // }
    });


    this.ui.Footer.RejectButton.Clicked(() => {
      context.Reject();
    });

    context.onRejectedSubject$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {

      //   this.modalDialogService.RejectDialog(context => {

      //     this.ui.Footer.ApproveButton.Loading(true);
      //     this.ui.Footer.ApproveButton.Enabled = false;
      //     this.ui.Footer.RejectButton.Loading(true);
      //     this.ui.Footer.RejectButton.Enabled = false;

      //     const body = {
      //       [result.resultName || '__approved']: result.resultValue || false,
      //       [result.reasonName || '__reason']: context.Data.reason
      //     };

      //     const runtimeData = {
      //       Approved: false,
      //       Reason: context.Data.reason
      //     }

      //     this.userTaskService.Complete(this.task.Id, body, runtimeData || {}).pipe(
      //       finalize(() => {
      //         this.ui.Footer.ApproveButton.Loading(false);
      //         this.ui.Footer.ApproveButton.Enabled = true;
      //         this.ui.Footer.RejectButton.Loading(false);
      //         this.ui.Footer.RejectButton.Enabled = true;
      //       })
      //     ).subscribe(response => {
      //       context.Close();
      //       this.notifyService.success('Task rejected', {
      //         closeOnClick: true,
      //         timeout: 3000,
      //         pauseOnHover: true
      //       });
      //       this.ui.NavigateByUrl('/usertask');
      //     }, error => {
      //       this.notifyService.error('An Error occured', {
      //         closeOnClick: true,
      //         timeout: 3000,
      //         pauseOnHover: true
      //       });
      //     })

      //   });
      // });

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

      return context;
    });

  }
  // Claim() {
  //   this.userTaskService.Claim([this.task.Id]);
  // }
  // UnClaim() {
  //   this.userTaskService.UnClaim([this.task.Id]);
  // }



}


class UserTaskComponentStatus {
  task: UserTaskDto;
  formfound?: null | 'BuiltIn' | 'GenericForm' | 'CustomElement' = null;
}

export class TaskContext implements ICETaskContext {

  Payload: any = {};
  ConfigPayload: any = {};
  Validation: any = {};
  private valid: boolean;

  public validSubject$ = new BehaviorSubject<boolean>(false);

  get Valid() {
    return this.valid;
  }

  set Valid(value: boolean | string) {
    if (typeof value === 'string') {
      if (value.toLocaleUpperCase() === 'VALID') {
        this.valid = true;
        this.validSubject$.next(true);
      } else {
        this.valid = false;
        this.validSubject$.next(false);
      }
    } else {
      this.valid = value;
      this.validSubject$.next(value);
    }
  }

  public visibleButtonsSubject$ = new BehaviorSubject<{ button: string, visible: boolean }>(null);




  public onSubmitedSubject$ = new Subject<SubmitTaskPayload>();
  private onSubmit: () => SubmitTaskPayload = () => null;
  OnSubmit(action: () => SubmitTaskPayload) {
    this.onSubmit = action;
    this.visibleButtonsSubject$.next({
      button: 'submit',
      visible: !!action
    });
  }
  Submit() {
    const result = this.onSubmit();
    this.onSubmitedSubject$.next(result);
  }

  public onSavedSubject$ = new Subject<SaveTaskPayload>();
  private onSave: () => SaveTaskPayload = () => null;
  OnSave(action: () => SaveTaskPayload) {
    this.onSave = action;
    this.visibleButtonsSubject$.next({
      button: 'save',
      visible: !!action
    });
  }
  Save() {
    const result = this.onSave();
    this.onSavedSubject$.next(result);
  }

  public onApprovedSubject$ = new Subject<ApproveTaskPayload>();
  private onApprove: () => ApproveTaskPayload = () => null;
  OnApprove(action: () => ApproveTaskPayload): void {
    this.onApprove = action;
    this.visibleButtonsSubject$.next({
      button: 'approve',
      visible: !!action
    });
  }
  Approve() {
    const result = this.onApprove();
    this.onApprovedSubject$.next(result);
  }


  public onRejectedSubject$ = new Subject<RejectTaskPayload>();
  private onReject: () => RejectTaskPayload = () => null;
  OnReject(action: () => RejectTaskPayload): void {
    this.onReject = action;
    this.visibleButtonsSubject$.next({
      button: 'reject',
      visible: !!action
    });
  }
  Reject() {
    const result = this.onReject();
    this.onRejectedSubject$.next(result);
  }

  public onFeedbackedSubject$ = new Subject<FeedbackTaskPayload>();
  private onFeedback: () => FeedbackTaskPayload = () => null;
  OnFeedback(action: () => FeedbackTaskPayload): void {
    this.onFeedback = action;
    this.visibleButtonsSubject$.next({
      button: 'feedback',
      visible: !!action
    });
  }
  Feedback() {
    const result = this.onFeedback();
    this.onFeedbackedSubject$.next(result);
  }

}
