import { Component } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { TaskContextBaseComponent } from 'projects/usecase-base-class/task-context-base.component';
import { HostInterfaces } from './models/interfaces.model';


@Component({
  selector: 'oracle-db-rdn-ut-select-interface',
  templateUrl: './app.component.html'
})
export class AppComponent extends TaskContextBaseComponent {

  title = 'oracle-db-rdn-ut-select-interface';
  INPUT_DATA_KEY = 'interfaceTable';
  OUTPUT_DATA_KEY = 'selectedInterfaceList';

  constructor(private fb: FormBuilder) {
    super('oracle-db-rdn-ut-select-interface');
  }

  buildForm(): void {
    console.debug(this.title, ': buildForm()');

    this.form = this.fb.group({
      [this.INPUT_DATA_KEY]: this.fb.array([]),
      [this.OUTPUT_DATA_KEY]: [[]]
    });
  }

  setFormDataFromPayload() {
    console.debug(this.title, ': setFormDataFromPayload()');

    if (this.Context.Payload) {
      this.Context.Payload[this.INPUT_DATA_KEY].forEach((element: HostInterfaces | undefined) => {
        this.formArray.push(this.buildRow(element));
      });
    }
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

  onSubmit() {
    console.debug(this.title, ': onSubmit()');

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

}
