import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TaskContextFormsBaseClass } from 'projects/base-usecase-classes/task-context-forms-base-class';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { HostPartitionOptions } from './models/hostpartitions.model';


@Component({
  selector: 'oracle-db-rdn-ut-select-storage',
  templateUrl: './app.component.html'
})
export class AppComponent extends TaskContextFormsBaseClass {

  title = 'oracle-db-rdn-ut-select-storage';
  INPUT_DATA_KEY = 'mountTable';
  OUTPUT_DATA_KEY = 'selectedMountList';

  constructor(private fb: FormBuilder) {
    super('oracle-db-rdn-ut-select-storage');
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
      this.Context.Payload[this.INPUT_DATA_KEY].forEach((element: HostPartitionOptions | undefined) => {
        this.formArray.push(this.buildRow(element));
      });
    }
  }

  get formArray() {
    return this.form.get(this.INPUT_DATA_KEY) as FormArray;
  }

  buildRow(item?: HostPartitionOptions) {
    item = item || new HostPartitionOptions();

    return this.fb.group({
      delvolumes: [item.delvolumes || false],
      delqtree: [item.delqtree || false],
      delexport: [item.delexport || false],
      Mountpoint: [item.Mountpoint],
      Filesystem: [item.Filesystem],
      SizeGB: [item.SizeGB],
      Device: [item.Device],
    });
  }

  observeChanges(fg: FormGroup) {

    const delvolume = fg.get('delvolumes');
    const delqtree = fg.get('delqtree');
    const delexport = fg.get('delexport');

    return delvolume!.valueChanges.pipe(
      distinctUntilChanged(),
      map(value => {

        if (value === true) {

          delqtree!.setValue(true);
          delexport!.setValue(true);

        } else {
          delqtree!.setValue(false);
          delexport!.setValue(false);
        }
      }));
  }

  onSubmit() {
    console.debug(this.title, ': onSubmit()');

    // only submit entries that were selected to be deleted by the user
    if (this.form.get(this.INPUT_DATA_KEY)!.value) {
      const selectedMountList: Array<HostPartitionOptions> = (this.form.get(this.INPUT_DATA_KEY)!.value as Array<HostPartitionOptions>).filter(item => item.delqtree || item.delvolumes || item.delexport);
      this.form.get([this.OUTPUT_DATA_KEY])!.patchValue(selectedMountList);
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
