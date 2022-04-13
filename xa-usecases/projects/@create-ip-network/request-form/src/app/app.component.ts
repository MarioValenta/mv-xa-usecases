import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackRequestPayload, ICERequest, ICERequestContext, XAServices } from '@xa/lib-ui-common';
import { XASERVICE_TOKEN } from 'projects/shared.functions';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CustomValidators } from './customvalidator';
import { DataService } from './data.service';

@Component({
  selector: 'create-ip-network-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent implements ICERequest, OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private dataService: DataService) {
  }

  @Input() public Context!: ICERequestContext;

  form!: FormGroup;
  title = 'RequestForm';
  Locations$ = new BehaviorSubject<Array<any>>([]);
  Location;
  Customers$ = this.dataService.GetAlpineCustomers('');
  destroy$ = new Subject();
  public allvalid = false;
  public childformvalid!: Boolean;


  NetworkDefault = [
    {
      NetworkType: 'Admin-LAN',
      ProviderIndependent: false,
      Mandatory: true
    }];


  ngOnDestroy(): void {
    this.destroy$.next();
  }



  ngOnInit() {

    this.BuildForm();
    this.initializeFields();

    console.log(this.Context.Payload);


    if (this.Context.Payload) {
      this.form.patchValue(this.Context.Payload);
    }

    this.form.statusChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(status => {

      if (status === 'VALID' && this.childformvalid === true) {
        this.Context.Valid = true;
      } else {
        this.Context.Valid = false;
      }

    })

    this.Context.OnSubmit(() => this.Submit());
    this.Context.OnFeedback(() => this.Feedback());


  }

  Onvalid(formvalid: boolean) {

    //console.log(formvalid);
    this.childformvalid = formvalid;
    this.allvalid = this.form.valid && formvalid;

    if (this.allvalid === true) {
      this.Context.Valid = true;
    } else {
      this.Context.Valid = false;
    }


  }


  private BuildForm() {

    this.form = this.fb.group({
      Customer: [null, Validators.required],
      Location: [null, Validators.required],
      Description: ['', Validators.required],
      Wbs: [null, [Validators.required, Validators.minLength(16), Validators.maxLength(19), CustomValidators.wbspattern]],
      NetworkItems: [null, [Validators.required]],
      Comment: [null]
    });

    this.form.get('NetworkItems').patchValue(this.NetworkDefault);
  }

  initializeFields() {

    this.form.get('Customer').valueChanges.subscribe(value => {

      if (value) {

        this.Location = this.dataService.GetLocationsByCustomer(value);

        this.Location.subscribe(data => {
          this.Locations$.next(data);
        });

        this.form.get('Location').setValue('T-Center');
      } else {
        this.form.get('Location').setValue('T-Center');
      }
    });
  }

  public GetFormControl(name: string): AbstractControl {
    const control = this.form.get(name);
    return control;
  }


  Submit() {

    if (this.form.valid) {
      console.debug(this.form.value);
    } else {
      console.error('Form is not valid', this.form);
    }

    const model = this.form.value;

    return {
      value: model,
      identifier: `${model.Description}`
    };
  }

  Feedback(): FeedbackRequestPayload {

    return this.form.value;
  }
}
