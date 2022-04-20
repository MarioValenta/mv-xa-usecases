import { Component, Input, Output, EventEmitter, forwardRef, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { takeUntil, distinctUntilChanged, map } from 'rxjs/operators';
import { Subject, Subscription, BehaviorSubject } from 'rxjs';
import { NetworkOptions } from './models/network-options.model';
import { CustomValidators } from 'projects/shared/customvalidator';


@Component({
    selector: 'network-options-table',
    templateUrl: './network-options-table.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NetworkOptionsTableComponent),
        multi: true
    }],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkOptionsTableComponent implements ControlValueAccessor, OnInit, OnDestroy {



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

    dta = new DataSource();
    destroy$ = new Subject<any>();
    public ipadressrangeresult: any;

    _subscritions = new Map<number, Subscription>();

    constructor(private fb: FormBuilder, private cref: ChangeDetectorRef) {



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
                this.customValidatoriptype();
                this.formvalidity();
                this.propagateChange(value.Entries);

            });


        })
    }

    formvalidity() {

        this.form.statusChanges.subscribe(() => {

            this.valid.emit(this.form.valid);

        });

    }

    ngOnDestroy() {
        this.destroy$.next();
    }



    buildRow(item?: NetworkOptions) {

        return this.fb.group({
            NetworkType: [(item && item.NetworkType) || 'Admin-LAN', Validators.required],
            ProviderIndependent: [(item && item.ProviderIndependent)],
            IPType: [(item && item.IPType) || 'IPv4'],
            IPQuantity: [(item && item.IPQuantity) || '', [Validators.required]],
            IPNetwork: [(item && item.IPNetwork) || '', [Validators.required]],
            IPAuthority: [(item && item.IPAuthority) || 'TSA'],
            IPComment: [(item && item.IPComment) || '', [Validators.required, Validators.maxLength(32)]]
        });

    }

    get formArray() {
        return this.form.get('Entries') as FormArray;
    }

    AddNetwork() {
        this.formArray.push(this.buildRow());
    }

    RemoveNetwork(index: number) {
        this.formArray.removeAt(index);
    }

    keyPress(event: any) {
        const pattern = /[0-9\ ]/;

        const inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode !== 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
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


    observeChanges(fg: FormGroup | AbstractControl) {

        const NetworkType = fg.get('NetworkType');
        const ProviderIndependent = fg.get('ProviderIndependent');
        const IPNetwork = fg.get('IPNetwork');
        const IPQuantity = fg.get('IPQuantity');

        return NetworkType.valueChanges.pipe(
            distinctUntilChanged(),
            map(value => {

                if (value === 'Admin-LAN') {
                    IPQuantity.enable();
                    IPNetwork.reset();
                    IPNetwork.disable();
                    ProviderIndependent.disable();
                    ProviderIndependent.setValue(false);

                } else if (value === 'Server-LAN' || 'NAS-LAN' || 'Transit-LAN') {


                    IPQuantity.disable();
                    IPQuantity.reset();
                    IPNetwork.enable();
                    ProviderIndependent.disable();
                    ProviderIndependent.setValue(false);
                }

                if (value === 'DMZ') {

                    ProviderIndependent.enable();
                    IPNetwork.disable();

                    ProviderIndependent.valueChanges.pipe(
                        distinctUntilChanged()
                    ).subscribe(_value => {
                        if (_value === true) {

                            IPNetwork.enable();
                            IPQuantity.reset();
                            IPQuantity.disable();

                        } else {
                            IPNetwork.reset();
                            IPNetwork.disable();

                            IPQuantity.enable();

                        }
                    });


                }
            }));

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


class DataSource {

    NetworkType: Array<string> = ['Admin-LAN', 'Server-LAN', 'DMZ', 'NAS-LAN', 'Transit-LAN'];
    IPAuthority: Array<string> = ['TSA', 'Customer'];
    IPType: Array<string> = ['IPv4', 'IPv6'];
}
