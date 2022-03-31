import { Component, ViewChild, AfterViewInit, forwardRef, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FlatpickrOptions } from './flatpickr-options.interface';

declare var require: any;

if (typeof window !== 'undefined') {
  require('flatpickr'); // https://flatpickr.js.org/examples/
}

@Component({
  selector: 'ng2-flatpickr',
  templateUrl: './ng2-flatpickr.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Ng2FlatpickrComponent),
      multi: true
    }
  ]
})
export class Ng2FlatpickrComponent implements AfterViewInit, ControlValueAccessor, OnChanges {

  private flatpickr: any;

  private defaultFlatpickrOptions: FlatpickrOptions = {
    wrap: true,
    clickOpens: true,
    altInputClass: 'altInput',
    onChange: (selectedDates: Array<Date>) => {
      if (this.singleout) {
        this.writeValue(selectedDates[0]);
        this.change.emit(selectedDates[0]);
      } else {
        this.writeValue(selectedDates);
        this.change.emit(selectedDates);
      }
    }
  };

  @ViewChild('flatpickr', { static: true })
  flatpickrElement: any;

  @Input()
  config: FlatpickrOptions;

  @Input()
  placeholder = '';

  @Input()
  setDate: string | Date;

  @Input() set minDate(value) {
    if (this.flatpickr) {
      this.flatpickr.set('minDate', value);
    }
  }

  @Input() set maxDate(value) {
    if (this.flatpickr) {
      this.flatpickr.set('maxDate', value);
    }
  }

  @Input('singleout') singleout = true;

  @Output('change') change: EventEmitter<any> = new EventEmitter<any>();


  ///////////////////////////////////

  writeValue(value: any) {
    this.setDate = value;
    this.propagateChange(value);
    this.setDateFromInput(value);
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

  propagateChange = (_: any) => { };

  ///////////////////////////////////

  setDateFromInput(date: any) {

    if (this.flatpickr && this.flatpickr.selectedDates[0] != date) {
      this.flatpickr.setDate(date, true);
    }

  }

  ngAfterViewInit() {
    if (this.config) {
      Object.assign(this.defaultFlatpickrOptions, this.config);
    }

    this.flatpickr = this.flatpickrElement.nativeElement.flatpickr(this.defaultFlatpickrOptions);
    if (this.setDate) {
      this.setDateFromInput(this.setDate);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('setDate') && changes['setDate'].currentValue) {
      this.setDateFromInput(changes['setDate'].currentValue);
    }
  }

}
