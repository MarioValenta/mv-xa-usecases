import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FeedbackRequestPayload, ICERequestContext} from '@xa/lib-ui-common';
import { XANotifyService } from '@xa/ui';
import { ValidationService } from '@xa/validation';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime,distinctUntilChanged, filter, switchMap, takeUntil} from 'rxjs/operators';
import { DataService } from './data.service';

@Component({
  selector: 'idpa-proxy-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = '@idpa-proxy/request-form';
  @Input() Context!: ICERequestContext;
  form!: FormGroup;
  destroy$ = new Subject();
  url!: string;


  readonly FORM_KEY_HOSTNAME = 'Hostname';
  readonly FORM_KEY_FQDN = 'FQDN';
  readonly FORM_KEY_ESX_CLUSTER = 'ESXCluster';


  IsHostnameAvailable$!: Observable<boolean>;
  ESXClusters$!: Observable<Array<string>>;
  ParameterUrl$!: Observable<Array<string>>;
  ParameterLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private validationService: ValidationService,
    private fb: FormBuilder,
    private dataService: DataService,
    private xaNotifyService: XANotifyService,
  ) {
    
  }

  buildForm() {
    this.form = this.fb.group({
      Hostname: [''],
      ESXCluster: [''],
      FQDN: [''], 
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit(): void {
    this.buildForm();

    if (this.Context.Validation.requestForm) {
      this.validationService.setValidatorsFromConfig(
        this.form,
        this.Context.Validation.requestForm,
        false
      );
    }

    this.checkChanges();

    this.form.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => (this.Context.Valid = status));

    this.Context.OnSubmit(() => this.submit());
    this.Context.OnFeedback(() => this.feedback());

    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload);
    }

    if (this.Context.ConfigPayload.ParameterUrl) {
      this.url = this.Context.ConfigPayload.ParameterUrl;
      this.ParameterUrl$ = this.dataService.getParameters(this.url);

      this.ParameterUrl$.subscribe((res) => {
        Object.entries(res).forEach(([key, value]) => {
          
            this.form.addControl(key, this.fb.control(value));
          
        });
        this.ParameterLoading$.next(true);
      });
    }

  }


  checkChanges() {

    this.ParameterLoading$.pipe(takeUntil(this.destroy$)).subscribe(val =>
      {
        if(val == true){
          this.ESXClusters$ = this.dataService.getClusters(
            this.form.get('Infrastructure')?.value)
        }
      })

    this.form
      .get('Infrastructure')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        if (val) {
          this.ESXClusters$ = this.dataService.getClusters(
            this.form.get('Infrastructure')?.value
          );
        }
      });

    // Hostname change listener
    this.form
      .get(this.FORM_KEY_HOSTNAME)
      ?.valueChanges.pipe(
        takeUntil(this.destroy$),
        // We should continue only when we have a customer selected
        filter(() => true),
        debounceTime(500),
        distinctUntilChanged(),
    
        // Skip or stop the process from this point if hname is undefined
        filter((hname) => Boolean(hname)),

        switchMap((hname) => {
          if (hname) {
            this.form.get('FQDN')?.patchValue(this.form.get('Hostname')?.value +'.'+ this.form.get('DNSDomain')?.value)
            return (this.IsHostnameAvailable$ =
              this.dataService.getHostnameAvailability(hname));
          }
        }),

        switchMap((isHostnameAvailable) => {
          if (isHostnameAvailable) {
            return [];
          } else {
            this.form.get(this.FORM_KEY_HOSTNAME)?.setErrors({
              uniqueName: {
                message: 'Hostname is reserved! Please enter another one.',
              },
            });
            return (this.IsHostnameAvailable$ = of(false));
          }
        })
      )
      .subscribe();
  }

  get getValidationService() {
    return this.validationService;
  }


  submit() {
    if (!this.form.valid) {
      console.error('Form is not valid', this.form);
      this.xaNotifyService.error('Form is not valid! ' + this.form);
    }

    return {
      value: this.form.getRawValue(),
      identifier: `${this.form.get('Hostname')?.value}`,
    };
  }

  feedback(): FeedbackRequestPayload {
    return this.form.value;
  }
}
