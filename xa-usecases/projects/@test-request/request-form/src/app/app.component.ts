import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { RequestContextFormsBaseClass } from 'projects/base-usecase-classes/request-context-forms-base-class';


@Component({
  selector: 'test-request-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends RequestContextFormsBaseClass {

  title = 'test-request-request-form';

  constructor(private fb: FormBuilder, private cref: ChangeDetectorRef) {
    super('test-request-request-form');
  }

  buildForm() {
    console.debug(this.title, 'buildForm()');

    this.form = this.fb.group({
      Identifier: [''],
      Requestname: ['', Validators.required],
      RowItems: this.fb.array([this.createRowItems()])
    });
  }

  setFormDataFromPayload() {
    console.debug(this.title, 'setFormDataFromPayload()');

    if (!this.Context.Payload) {
      return;
    }

    const payloadKeys = Object.keys(this.Context.Payload);

    const isPayload = payloadKeys.includes('RowItems') && this.Context.Payload['RowItems'] instanceof Array;
    let rowItems: Array<any>;

    if (isPayload) {
      rowItems = this.Context.Payload['RowItems'];
      if (this.Context.Payload && this.Context.Payload['Requestname']) {
        this.form.patchValue({ Requestname: this.Context.Payload['Requestname'] });
      }
    } else {
      rowItems = Object.keys(this.Context.Payload).map(k => ({ Name: k, Value: this.Context.Payload[k] }));
      const requestName = rowItems.find(it => it.Name === 'Requestname');
      if (requestName) {
        this.form.patchValue({ Requestname: requestName.Value });
        rowItems = rowItems.filter(ri => ri.Name !== 'Requestname');
      }
    }

    const fArray = rowItems ? rowItems.map(ri => this.createRowItems(ri.Name, ri.Value)) : [this.createRowItems()];
    this.form.setControl('RowItems', this.fb.array(fArray));
    this.cref.markForCheck();
  }

  onSubmit() {
    console.debug(this.title, 'onSubmit()');

    if (this.form.valid) {
      console.debug(this.form.value);
    } else {
      console.error('Form is not valid', this.form);
    }

    const model = this.form.value;

    const values: { [key: string]: string } = {};
    values['Requestname'] = this.form.value['Requestname'];
    model.RowItems.forEach((i: { Name: string | number; Value: any; }) => {
      if (!!i.Name) {
        values[i.Name] = i.Value;
      }
    });

    return {
      value: values,
      identifier: values['Identifier']
    };
  }

  private createRowItems(name: string = '', value: string = '') {
    return this.fb.group({
      Name: name,
      Value: value,
    });
  }

  get formRowItems(): FormArray {
    return this.form.get('RowItems') as FormArray
  }

  addRow() {
    this.formRowItems.push(this.createRowItems());
    this.cref.markForCheck();
  }

  removeRow(i: number) {
    this.formRowItems.removeAt(i);
    this.cref.markForCheck();
  }
}
