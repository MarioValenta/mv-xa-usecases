import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackRequestPayload, ICERequest, ICERequestContext } from '@xa/lib-ui-common';
import { XANotifyService } from '@xa/ui';
import { getFlatpickrSettings } from 'projects/shared.functions';
import { FlatpickrOptions } from 'projects/shared/ng2-flatpickr/ng2-flatpickr.module';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { DataService } from './data.service';

@Component({
  selector: 'universal-tap-execution-kfa-deployment-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements ICERequest, OnInit, OnDestroy, AfterViewInit {

  @Input() public Context!: ICERequestContext;

  title = 'KFA-Deployment';
  form!: FormGroup;
  startOptions: FlatpickrOptions = getFlatpickrSettings();
  jsonData: any = {};
  destroy$ = new Subject();

  constructor(private fb: FormBuilder, private dataService: DataService, private xaNotifyService: XANotifyService) { }


  ngOnInit() {

    this.buildForm();

    this.form.statusChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(status => this.Context.Valid = status);

    this.Context.OnSubmit(() => this.submit());
    this.Context.OnFeedback(() => this.feedback());

    if (this.Context.Payload) {
      this.jsonData = Object.assign(this.jsonData, this.Context.Payload);
    }

    this.dataService.getCatalogDbData(`api/universaltapexecution/getusecaseinfosfromcatdb/${this.getCatDBConfigData('nameOfUseCase')}`)
      .pipe(tap(value => { }))
      .subscribe(
        values => {
          this.jsonData = Object.assign(this.jsonData, values);
          this.form.get('isCatDbDataLoaded')?.patchValue(true);
          this.xaNotifyService.clear();
          this.xaNotifyService.success('CatDB data loaded!', { timeout: 2500, pauseOnHover: false });
        })
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private buildForm() {
    this.form = this.fb.group({
      startdate: ['', Validators.required],
      isCatDbDataLoaded: [false, Validators.requiredTrue]
    });
  }

  feedback(): FeedbackRequestPayload {
    return this.form.value;
  }

  submit() {
    if (this.form.valid) {
      console.debug(this.form.value);
    } else {
      console.error('Form is not valid', this.form);
    }


    const formData = this.form.getRawValue();
    // delete isCatDbDataLoaded from the formGroup JSON
    delete formData['isCatDbDataLoaded'];
    const model = Object.assign(this.jsonData, formData);
    console.log(model);

    return {
      value: model,
      identifier: `${this.title}-${model.startdate}`
    };
  }

  dateSelected(event: any) {
  }

  getCatDBConfigData(valueKey: string): string | null {
    if (this.Context.Payload) {
      return this.Context.Payload[valueKey];
    } else {
      return null;
    }
  }

}
