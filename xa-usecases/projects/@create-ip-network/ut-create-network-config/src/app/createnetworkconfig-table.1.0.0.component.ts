import { Component, Input, Output, EventEmitter, forwardRef, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription, BehaviorSubject } from 'rxjs';
import { NetworkOptions } from './models/network-options.model';
import { CustomValidators } from 'projects/shared/customvalidator';



@Component({
    selector: 'createnetworkconfig-table',
    templateUrl: './createnetworkconfig-table.1.0.0.component.html',
    styleUrls: ['./create-ip-styles.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CreateNetworkConfigTableComponent),
        multi: true
    }],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateNetworkConfigTableComponent implements ControlValueAccessor, OnInit, OnDestroy {


    @Input() form: FormGroup;
    private _items = new BehaviorSubject<Array<NetworkOptions>>([]);
    @Input()
    set value(value: Array<NetworkOptions>) {
        if (value) {
            this._items.next(value);
        } else {
            this._items.next([]);
        }


    }

    @Output() valueChange: EventEmitter<Array<NetworkOptions>> = new EventEmitter<Array<NetworkOptions>>();
    @Output() valid: EventEmitter<Boolean> = new EventEmitter<Boolean>();


    destroy$ = new Subject<any>();

    _subscritions = new Map<number, Subscription>();

    constructor(private fb: FormBuilder) {

    }

    ngOnInit() {

        this._items.pipe(
            takeUntil(this.destroy$),

        ).subscribe(items => {
            this.form = this.fb.group({
                Entries: this.fb.array(
                    items.map(item => this.buildRow(item))
                )
            });

            this.form.valueChanges.pipe(
                takeUntil(this.destroy$)
            ).subscribe(value => {
                this.formvalidity();
                this.customValidatoriptype();
                this.propagateChange(value.Entries);
            });

        });


    }

    customValidatoriptype() {
        for (const control of this.formArray.controls) {
            if (control.get('IPType').value === 'IPv4') {
                control.get('IPNetwork').setValidators(CustomValidators.ipv4pattern);

            } else {
                control.get('IPNetwork').setValidators(CustomValidators.ipv6pattern);
            }
        }
    }


    ngOnDestroy() {
        this.destroy$.next();
    }

    formvalidity() {
        this.form.statusChanges.pipe(takeUntil(this.destroy$)
        ).subscribe(() => {
            this.valid.emit(this.form.valid);
        });

    }


    buildRow(item?: NetworkOptions) {

        item = item || new NetworkOptions();

        return this.fb.group({
            VLANID: [item.VLANID || '', [Validators.required, Validators.max(4096), Validators.min(1)]],
            NetworkType: [item.NetworkType || 'Admin-LAN'],
            ProviderIndependent: [item.ProviderIndependent || false],
            IPType: [item.IPType || 'IPv4'],
            IPQuantity: [item.IPQuantity || ''],
            IPNetwork: [item.IPNetwork || '', [Validators.required]],
            IPAuthority: [item.IPAuthority || 'TSA'],
            IPComment: [item.IPComment || ''],
            AffectedDevices: [item.AffectedDevices || ''],
            AffectedCategory: [item.AffectedCategory || ''],

        });

    }

    get formArray() {
        return this.form.get('Entries') as FormArray;
    }


    keyPress(event: any) {
        const pattern = /[0-9\ ]/;

        const inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode !== 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }


    propagateChange(value: Array<NetworkOptions>) {

        this.valueChange.emit(value);
        this.registered.forEach(fn => {
            fn(value);
        });
    }
    onTouched = () => { };

    writeValue(value: Array<NetworkOptions>): void {
        this.value = value;
    }

    registered = [];

    registerOnChange(fn: any): void {

        this.registered.push(fn);

    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
    }


}
