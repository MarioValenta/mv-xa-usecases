import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VMDKStorage } from './vmdk-storage.model';


const VmdkStorageComponent_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => VmdkStorageWindowsComponent),
    multi: true
};

const noop = () => {
};

@Component({
    selector: 'xa-vmdk-windows-config',
    templateUrl: './vmdk-storage-windows.component.html',
    providers: [VmdkStorageComponent_VALUE_ACCESSOR],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VmdkStorageWindowsComponent implements ControlValueAccessor {

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

    coptions: any = {
        padding: [10, 0],
        step: 10,
        connect: [true, false],
        range: {
            'min': 50,
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
            Mandatory: false,
            Name: this.GetNextFreeLetter()
        };

        this.value.push(newVmdK);

        this.emitValue();
    }

    RemoveStorage(vmdk) {
        this.value = this.value.filter(v => v !== vmdk);
        this.emitValue();
    }

    GetNextFreeLetter() {

        return this.GetFreeLetters().filter(l => l !== 'A' && l !== 'B')[0];

    }

    GetFreeLetters() {

        const codes = this.value.map(v => v.Name.charCodeAt(0));
        const freeLetters = [];
        for (let i = 65; i <= 90; i++) {
            if (codes.findIndex(c => c === i) === -1) {
                freeLetters.push(i);
            }
        }

        return freeLetters.map(l => String.fromCharCode(l));
    }

    SetValue($event) {
        
    }
    private emitValue() {

        this.valueChange.emit(this._value);
        this.onChangeCallback(this._value);
    }

    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

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
