import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, Observable, of, from, zip } from 'rxjs';
import { ICERequestContext, SubmitRequestPayload, FeedbackRequestPayload, JsonHelper } from '@xa/lib-ui-common'
import { CERequestContext } from './ce-request-context';
import { ErrorModalComponent } from './error-modal/error-modal-component';
import { AssetModalContext } from './AssetModalContext';
import { takeUntil, finalize, tap, map, take, switchMap } from 'rxjs/operators';
import { XANotifyService, XAModalService, XAModal } from '@xa/ui';
import { ContentUiService } from '../../content-ui';
import { HttpService } from '../../shared/services';

@Component({
  template: `
    <div class="ui container" style="width: 600px;margin-top:10%" *ngIf="notFound">
    <div class="ui red icon message">
        <i class="exclamation triangle icon"></i>
        <div class="content">
            <pre>Can't find a Form for this Request</pre>
        </div>
    </div>
</div>

    <div class="ce-request-container">
        <div class="ui active text loader" *ngIf="loading">Loading</div>
    </div>
    `
})
export class CERequestComponent implements OnInit, OnDestroy {


  constructor(
    private ui: ContentUiService,
    private notifyService: XANotifyService,
    private http: HttpService,
    // private modalDialogService: ModalService,
    private modalService: XAModalService) {

    ui.Header.Show = true;
    ui.Footer.Show = true;
  }

  private modal: XAModal<AssetModalContext>;


  loading = true;
  notFound = false;
  destroy$ = new Subject();
  ngOnInit() {
    /**
     * Creates a new modal window with a given component and stores it into the modal variable.
     */
    this.modal = this.modalService
      .CreateModal<AssetModalContext>(
        modal => modal.FromComponent('ErrorModal', ErrorModalComponent))
      .SetTop('100')
      .SetBottom('100')
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  // private SetUIProperties(requestContext: CERequestContext) {

  //     this.ui.Header.Title = requestContext.RequestType.Name;
  //     this.ui.Header.Icon = requestContext.RequestType.Icon;

  // }

  // private LoadCustomElement(requestContext: CERequestContext) {

  //     if (!requestContext || !requestContext.CustomElementId)
  //         return of(false);

  //     const exists = customElements.get(`ce-${requestContext.CustomElementId}`);
  //     let func: Observable<string>;
  //     if (!exists) {
  //         func = this.http.GetText(`/api/requesttype/customElement/${requestContext.CustomElementId}`).pipe(
  //             tap(ce => new Function(ce)()),
  //             map(ce => requestContext.CustomElementId)
  //         )
  //     } else {
  //         func = of(requestContext.CustomElementId)
  //     }

  //     return func.pipe(
  //         switchMap(id => customElements.whenDefined(`ce-${id}`)),
  //         map(_ => true)
  //     );
  // }

  // private AddCustomElement(requestContext: CERequestContext) {

  //     if (!requestContext || !requestContext.CustomElementId)
  //         return;

  //     const container = document.querySelector('.ce-request-container');

  //     if (!container)
  //         return;

  //     while (container.hasChildNodes()) {
  //         container.removeChild(container.childNodes[0])
  //     }

  //     const ceo = customElements.get(`ce-${requestContext.CustomElementId}`);
  //     const c = new ceo();
  //     const context = this.BuildRequestContext();

  //     if (requestContext.CloneData) {
  //         context.Payload = requestContext.CloneData;
  //     } else if (requestContext.Payload) {
  //         try {
  //             var withoutComments = JsonHelper.RemoveComments(requestContext.Payload);
  //             context.Payload = JSON.parse(withoutComments);
  //         } catch { }
  //     }

  //     if (requestContext.ConfigPayload) {
  //         try {
  //             var withoutComments = JsonHelper.RemoveComments(requestContext.ConfigPayload);
  //             context.ConfigPayload = JSON.parse(withoutComments);
  //         } catch { }
  //     }

  //     if (requestContext.Validation) {
  //         try {
  //             var withoutComments = JsonHelper.RemoveComments(requestContext.Validation);
  //             context.Validation = JSON.parse(withoutComments);
  //         } catch { }
  //     }

  //     c.Context = context;
  //     container.appendChild(c);

  // }


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
        // this.modalDialogService.OpenFeedbackRequestForm(result);

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
      // if (context.Valid) {
      //     this.dynReqService.SubmitRequest(result.value, result.identifier).pipe(
      //         finalize(() => {
      //             this.ui.Footer.SubmitButton.Loading(false);
      //             this.ui.Footer.SubmitButton.Enabled = true;
      //         })
      //     ).subscribe(response => {
      //         this.notifyService.success('Your Request has been sent successfully. You will be redirected to your Requests', {
      //             closeOnClick: true,
      //             timeout: 3000,
      //             pauseOnHover: true
      //         });
      //         this.ui.NavigateByUrl('/myrequest');
      //     }, errorResponse => {
      //         this.notifyService.error('An Error occured', {
      //             closeOnClick: true,
      //             timeout: 3000,
      //             pauseOnHover: true
      //         });

      //         /**
      //          * Sets the variable parameters and opens the before created modal with this parameters.
      //          */
      //         const contextModal = new AssetModalContext();
      //         contextModal.errorCount = errorResponse.error.ErrorCount;
      //         contextModal.errors = errorResponse.error.Error;
      //         this.modal.Open('ErrorModal', contextModal);
      //     })
      // }

    });

    return context;
  }
  private RemoveLoader() {
    this.loading = false;
  }



}

export class RequestContext implements ICERequestContext {

  Payload: any = {};
  ConfigPayload: any = {};
  Validation: any = {};

  private subTitle: string;
  public subTitleSubject$ = new Subject<string>();
  get SubTitle() {
    return this.subTitle;
  }
  set SubTitle(value: string) {
    this.subTitle = value;
    this.subTitleSubject$.next(value);
  }

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

  public onSubmitedSubject$ = new Subject<SubmitRequestPayload>();
  private onSubmit: () => SubmitRequestPayload = () => null;
  OnSubmit(action: () => SubmitRequestPayload) {
    this.onSubmit = action;
  }
  Submit() {
    const result = this.onSubmit();
    this.onSubmitedSubject$.next(result);
  }


  public onFeedbackedSubject$ = new Subject<FeedbackRequestPayload>();
  private onFeedback: () => FeedbackRequestPayload = () => null;
  OnFeedback(action: () => FeedbackRequestPayload) {
    this.onFeedback = action;
  }
  Feedback() {
    const result = this.onFeedback();
    this.onFeedbackedSubject$.next(result);
  }
}
