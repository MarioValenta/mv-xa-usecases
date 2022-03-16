import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { VMDKStorage } from './vmdk-storage.model';


@Component({
    selector: 'xa-vmdk-linux-config',
    templateUrl: './vmdk-storage-linux.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => VmdkStorageLinuxComponent),
        multi: true
    }],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VmdkStorageLinuxComponent implements ControlValueAccessor {

    private _value: Array<VMDKStorage>;

    options: any = {
        padding: [10, 0],
        step: 10,
        connect: [true, false],
        range: {
            'min': 0,
            'max': 500
        },
        behaviour: 'snap'

    };
    @Input() set value(value: Array<VMDKStorage>) {
        if (value) {
            this._value = Object.assign([], value);
        } else {
            this._value = new Array<any>();
        }
    }
    get value() {
        return this._value;
    }

    @Output() valueChange: EventEmitter<Array<VMDKStorage>> = new EventEmitter<Array<VMDKStorage>>();


    AddStorage() {
        const newVmdK: VMDKStorage = {
            Size: 10,
            Mandatory: false
        };
        this.value.push(newVmdK);

        this.emitValue();
    }

    RemoveStorage(vmdk) {
        this.value = this.value.filter(v => v !== vmdk);
        this.emitValue();
    }



    SetValue($event) {
        
    }

    private emitValue() {

        this.valueChange.emit(this._value);
        this.onChangeCallback(this._value);
    }

    private onTouchedCallback: () => void = () => {};
    private onChangeCallback: (_: any) => void = () => {};

    writeValue(value: any) {
        this.value = value;
    }

    registerOnChange(fn: (_: any) => void): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
}
