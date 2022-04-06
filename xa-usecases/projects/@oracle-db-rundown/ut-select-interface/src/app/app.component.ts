import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FeedbackRequestPayload, ICETask, ICETaskContext } from '@xa/lib-ui-common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HostInterfaces } from './models/interfaces.model';


@Component({
  selector: 'oracle-db-rdn-ut-select-interface',
  templateUrl: './app.component.html'
})
export class AppComponent implements ICETask, OnInit, OnDestroy {

  @Input() Context!: ICETaskContext;

  INPUT_DATA_KEY = 'interfaceTable';
  OUTPUT_DATA_KEY = 'selectedInterfaceList';

  form: FormGroup;
  destroy$ = new Subject<any>();


  constructor(private fb: FormBuilder) {

    this.form = this.fb.group({
      [this.INPUT_DATA_KEY]: this.fb.array([]),
      [this.OUTPUT_DATA_KEY]: [[]]
    });
  }

  ngOnInit() {

    this.form.statusChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(status => this.Context.Valid = status);

    if (this.Context.Payload) {
      this.Context.Payload[this.INPUT_DATA_KEY].forEach((element: HostInterfaces | undefined) => {
        this.formArray.push(this.buildRow(element));
      });
    }

    this.Context.OnSubmit(() => this.Submit());
    this.Context.OnFeedback(() => this.Feedback());
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  get formArray() {
    return this.form.get(this.INPUT_DATA_KEY) as FormArray;
  }

  buildRow(item?: HostInterfaces) {
    item = item || new HostInterfaces();

    return this.fb.group({
      remove: [item.remove || false],
      Interface: [item.Interface],
      IP: [item.IP],
      IPv6: [item.IPv6]
    });
  }

  Submit() {

    // only submit entries that were selected to be deleted by the user
    if (this.form.get([this.INPUT_DATA_KEY])!.value) {
      const selectedInterfaceList: Array<HostInterfaces> = (this.form.get([this.INPUT_DATA_KEY])!.value as Array<HostInterfaces>).filter(item => item.remove);
      this.form.get([this.OUTPUT_DATA_KEY])!.patchValue(selectedInterfaceList);
    }

    if (this.form.valid) {
      console.debug(this.form.value);
    } else {
      console.error('Form is not valid', this.form);
    }

    const model = this.form.value;

    return {
      value: model,
      runtimeData: model
    };
  }

  Feedback(): FeedbackRequestPayload {

    return this.form.value;
  }

}
