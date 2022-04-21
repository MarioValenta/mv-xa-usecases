import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ICERequest } from '@xa/lib-ui-common';
import { XANotifyService } from '@xa/ui';
import { ValidationService } from '@xa/validation';
import { getFlatpickrSettings } from 'projects/shared.functions';
import { IFormControlSettingsObject } from 'projects/shared/interfaces/iform-control-settings-object';
import { FlatpickrOptions } from 'projects/shared/ng2-flatpickr/ng2-flatpickr.module';
import { RequestContextBaseComponent } from 'projects/usecase-base-class/request-context-base.component';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

import { DataService } from './app.service';

export type CatDBEntry = { [key: string]: string | Record<string, any> };

@Component({
  selector: 'universal-tap-execution-kfa-deployment-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends RequestContextBaseComponent implements ICERequest {

  title = 'KFA-Deployment';
  startOptions: FlatpickrOptions = getFlatpickrSettings();
  catDBData: CatDBEntry | null = null;
  catDBEndpointUrl: string = 'api/universaltapexecution/getusecaseinfosfromcatdb/';
  formReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  readonly FORM_STARTDATE: IFormControlSettingsObject = this.buildFormControlObject('startdate', 'Patch Startdate', 'enter Startdate...');
  readonly FORM_NAME_OF_USECASE: IFormControlSettingsObject = this.buildFormControlObject('nameOfUseCase');

  constructor(private fb: FormBuilder, private dataService: DataService, private xaNotifyService: XANotifyService, private validationService: ValidationService) {
    super();
  }

  get getValidationService(): ValidationService {
    return this.validationService;
  }

  get startDateControl(): FormControl {
    return this.form.get(this.FORM_STARTDATE.key) as FormControl;
  }

  setFormStatusChangeListener(): void {
    console.debug(this.title, 'setFormStatusChangeListener()');

    const statusChanges = this.form.statusChanges
      .pipe(
        map<string, boolean>(value => value === 'VALID'),
        takeUntil(this.destroy$)
      );

    combineLatest([statusChanges, this.formReady$])
      .pipe(takeUntil(this.destroy$))
      .subscribe((valid: boolean[]) => this.Context.Valid = valid.every(entry => entry === true));
  }

  setValidationService(): void {
    console.debug(this.title, 'setValidationService()');

    if (this.Context.Validation.requestForm) {
      this.validationService.setValidatorsFromConfig(this.form, this.Context.Validation.requestForm);
    }
  }

  setFormDataFromPayload(): void {
    console.debug(this.title, 'setFormDataFromPayload()');

    if (this.Context.Payload) {
      this.addDataToForm(this.Context.Payload);
    }
  }

  customOnInit(): void {
    console.debug(this.title, 'customOnInit()');

    this.dataService
      .getCatalogDbData(this.catDBEndpointUrl + `${this.getCatDBConfigData(this.FORM_NAME_OF_USECASE.key)}`)
      .pipe(tap(value => { this.xaNotifyService.info('loading data from the CatDB!', { timeout: 2500, pauseOnHover: false }); }))
      .subscribe(
        (values: any) => {
          this.catDBData = values;
          this.addDataToForm(this.catDBData);
          this.xaNotifyService.clear();
          this.xaNotifyService.success('CatDB data loaded!', { timeout: 2500, pauseOnHover: false });
          this.formReady$.next(true);
        });
  }

  addDataToForm(jsonData: any): void {
    Object
      .entries(jsonData)
      .forEach(([key, value]) => {
        if (!this.form.get(key)) {
          this.form.addControl(key, this.fb.control(value));
        } else {
          this.form.get(key)?.patchValue(value);
        }
      });
    this.setValidationService();
  }

  buildForm() {
    console.debug(this.title, 'buildForm()');

    this.form = this.fb.group({
      [this.FORM_NAME_OF_USECASE.key]: [''],
      [this.FORM_STARTDATE.key]: ['']
    });
  }

  onSubmit(): { value: any; identifier: string; } {
    console.debug(this.title, 'onSubmit()');

    if (this.form.valid) {
      console.debug(this.form.value);
    } else {
      console.error('Form is not valid', this.form);
    }

    const formData = this.form.getRawValue();
    console.log(formData);
    this.requestFormIdentifier = `${this.title}-${formData[this.FORM_STARTDATE.key]}`;

    return {
      value: formData,
      identifier: this.requestFormIdentifier
    };
  }

  getCatDBConfigData(valueKey: string): string | null {
    if (this.Context.Payload) {
      return this.Context.Payload[valueKey];
    } else {
      return null;
    }
  }

}
