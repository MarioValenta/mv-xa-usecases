import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class InputFormArrayService {


  // form: FormGroup;
  // formArray: FormArray;

  constructor(private fb: FormBuilder) {

    // this.formArray =  this.fb.array([]);

    // this.form = this.fb.group({
    //   test: this.fb.array([])
    // });
  }

  // get formArrayData() {
  //   return this.form.controls['test'] as FormArray;
  // }

  // addRow(formGroup: FormGroup): void {
  //   this.formArray.push(formGroup);
  //   this.formArrayData.push(formGroup);
  // }

  // deleteRow(rowIndex: number) {
  //   this.formArrayData.removeAt(rowIndex);
  // }

}


