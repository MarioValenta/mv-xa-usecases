import { Component, Input, Output, EventEmitter, forwardRef, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import { HostInterfaces } from '../models/interfaces.model';


@Component({
    selector: 'interface-table',
    templateUrl: './interface-table.1.0.0.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InterfaceTableComponent_1_0_0),
        multi: true
    }],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class InterfaceTableComponent_1_0_0 implements ControlValueAccessor, OnInit, OnDestroy {
    @Input()
    set value(value: Array<HostInterfaces>) {
        if (value) {
            this._items.next(value);
        } else {
            this._items.next([]);
        }

    }

    constructor(private fb: FormBuilder) {

    }

    get formArray() {
        return this.form.get('EntriesInterface') as FormArray;
    }

    @Input() form: FormGroup;
    private _items = new BehaviorSubject<Array<HostInterfaces>>([]);

    @Output() valueChange: EventEmitter<Array<HostInterfaces>> = new EventEmitter<Array<HostInterfaces>>();

    destroy$ = new Subject<any>();

    registered = [];

    ngOnInit() {
        this._items.pipe(
            takeUntil(this.destroy$),

        ).subscribe(items => {
            this.form = this.fb.group({
                EntriesInterface: this.fb.array(
                    items.map(item => this.buildRow(item))
                )
            });

            this.form.valueChanges.pipe(
                takeUntil(this.destroy$)
            ).subscribe(value => {

                this.propagateChange(value.EntriesInterface);
            });

        });

    }

    ngOnDestroy() {
        this.destroy$.next();
    }


    buildRow(item?: HostInterfaces) {

        item = item || new HostInterfaces();

        return this.fb.group({
            IFDHCP: [item.IFDHCP],
            IFDNS: [item.IFDNS],
            IFID: [item.IFID],
            IFIP: [item.IFIP],
            IFIPVERSION: [item.IFIPVERSION],
            IFLANTYPE: [item.IFLANTYPE],
            IFNAME: [item.IFNAME],
            IFPHYADDRESS: [item.IFPHYADDRESS],
            IFTYPE: [item.IFTYPE],
            IFVLAN: [item.IFVLAN],
        });

    }


    propagateChange(value: Array<HostInterfaces>) {

        this.valueChange.emit(value);
        this.registered.forEach(fn => {
            fn(value);
        });
    }
    onTouched = () => { };

    writeValue(value: Array<HostInterfaces>): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {

        this.registered.push(fn);

    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
    }

}

