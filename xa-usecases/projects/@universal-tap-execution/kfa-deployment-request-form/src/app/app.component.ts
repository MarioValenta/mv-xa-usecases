import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
export class AppComponent implements ICERequest, OnInit, OnDestroy {

  @Input() public Context!: ICERequestContext;

  title = 'KFA-Deployment';
  form!: FormGroup;
  startOptions: FlatpickrOptions = getFlatpickrSettings();
  catDBData: any = {};
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
      //this.jsonData = Object.assign(this.jsonData, this.Context.Payload);
      this.addDataToForm(this.Context.Payload);
    }

    this.dataService.getCatalogDbData(`api/universaltapexecution/getusecaseinfosfromcatdb/${this.getCatDBConfigData('nameOfUseCase')}`)
      .pipe(tap(value => {this.xaNotifyService.info('loading data from the CatDB!', { timeout: 2500, pauseOnHover: false });}))
      .subscribe(
        (values: any) => {
          this.catDBData = Object.assign({}, values);
          this.addDataToForm(this.catDBData);
          this.form.get('isCatDbDataLoaded')?.patchValue(true);
          this.xaNotifyService.clear();
          this.xaNotifyService.success('CatDB data loaded!', { timeout: 2500, pauseOnHover: false });
        })
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  addDataToForm(jsonData: any): void {
    Object.entries(jsonData).forEach(([key, value]) => {
      if (!this.form.get(key)) {
        this.form.addControl(key, this.fb.control(value));
      } else {
        this.form.get(key)?.patchValue(value);
      }
    });
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
    //const model = Object.assign(this.jsonData, formData);
    console.log(formData);

    return {
      value: formData,
      identifier: `${this.title}-${formData['startdate']}`
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
