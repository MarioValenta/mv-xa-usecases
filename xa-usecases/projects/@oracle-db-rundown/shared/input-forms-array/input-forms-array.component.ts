import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormGroupDirective } from '@angular/forms';
import { IFormArrayConfigDTO } from './dto/i-form-array-config-dto';

@Component({
  selector: 'input-form-array',
  templateUrl: './input-forms-array.component.html',
  styleUrls: ['./input-forms-array.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class InputFormArrayComponent implements OnInit {
  title = 'input-forms-array';
  form!: FormGroup;

  @Input() headingText!: string;
  @Input() headingIcon!: string;
  @Input() tableHeadDescription!: string;
  @Input() formArrayFieldRows!: IFormArrayConfigDTO;
  @Input() newFormGroup!: FormGroup;
  @Input() formArrayName!: string;
  formArrayData!: FormArray;

  constructor(private rootFormGroup: FormGroupDirective) {
  }

  ngOnInit(): void {
    this.form = this.rootFormGroup.control;
    this.formArrayData = this.form.get(this.formArrayName) as FormArray;
  }

  addRow(): void {
    this.formArrayData.push(this.newFormGroup);
  }

  deleteRow(rowIndex: number) {
    this.formArrayData.removeAt(rowIndex);
  }

}
