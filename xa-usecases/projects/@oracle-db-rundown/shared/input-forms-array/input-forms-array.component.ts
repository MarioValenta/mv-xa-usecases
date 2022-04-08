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

  words: { number: number, word: string }[] = [
    { number: 0, word: 'field' },
    { number: 1, word: 'field' },
    { number: 2, word: 'two fields' },
    { number: 3, word: 'three fields' },
    { number: 4, word: 'four fields' },
    { number: 5, word: 'five fields' },
    { number: 6, word: 'six fields' },
    { number: 7, word: 'seven fields' },
    { number: 8, word: 'eight fields' },
    { number: 9, word: 'nine fields' },
    { number: 10, word: 'ten fields' },
    { number: 11, word: 'eleven fields' },
    { number: 12, word: 'twelve fields' },
    { number: 13, word: 'thirteen fields' },
    { number: 14, word: 'fourteen fields' },
    { number: 15, word: 'fifteen fields' },
    { number: 16, word: 'sixteen fields' }
  ];

  constructor(private rootFormGroup: FormGroupDirective) { }

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

  /**
   * This method is used to calculate the length of fields that should be displayed on one row for the form array.
   * Thus fomantic UI specifies the width of fields with "two fields", "six fields" .... the return value from array.length
   * as a number charachter does not fit. => Map array length number to e.g. "two fields" string.
   * @param {number} number size of the fields for one row in the form array
   * @return {*}  {string} returns the size for each row as "<number-in-words> fields"
   * @memberof InputFormArrayComponent
   */
  numberToWord(number: number): string {
    return this.words.filter(value => value.number === number)[0].word;
  }

}
