import { Component, Input, Output, EventEmitter, forwardRef, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { takeUntil, distinctUntilChanged, map } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import { HostPartitionOptions } from '../models/hostpartitions.model';


@Component({
    selector: 'partitions-table',
    templateUrl: './partition-table.1.0.0.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => PartitionTableComponent_1_0_0),
        multi: true
    }],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PartitionTableComponent_1_0_0 implements ControlValueAccessor, OnInit, OnDestroy {

    @Input() form: FormGroup;
    private _items = new BehaviorSubject<Array<HostPartitionOptions>>([]);
    @Input()
    set value(value: Array<HostPartitionOptions>) {
        if (value) {
            this._items.next(value);
        } else {
            this._items.next([]);
        }

    }

    @Output() valueChange: EventEmitter<Array<HostPartitionOptions>> = new EventEmitter<Array<HostPartitionOptions>>();
    destroy$ = new Subject<any>();

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
                this.propagateChange(value.Entries);
            });

        });

    }

    ngOnDestroy() {
        this.destroy$.next();
    }

    buildRow(item?: HostPartitionOptions) {

        item = item || new HostPartitionOptions();
        return this.fb.group({
            delvolumes: [item.delvolumes || false],
            delqtree: [item.delqtree || false],
            export: [item.export || false],
            Mountpoint: [item.Mountpoint],
            Filesystem: [item.Filesystem],
            SizeGB: [item.SizeGB],
            Device: [item.Device],
        });

    }

    get formArray() {
        return this.form.get('Entries') as FormArray;
    }

    observeChanges(fg: FormGroup) {

        const delqtree = fg.get('delqtree');
        const exportt = fg.get('export');

        return delqtree.valueChanges.pipe(
            distinctUntilChanged(),
            map(value => {

                if (value === true) {
                    exportt.setValue(true);
                    exportt.disable();
                } else {
                    exportt.enable();
                    exportt.setValue(false);
                }
            }));


    }

    propagateChange(value: Array<HostPartitionOptions>) {

        this.valueChange.emit(value);
        this.registered.forEach(fn => {
            fn(value);
        });
    }
    onTouched = () => { };

    writeValue(value: Array<HostPartitionOptions>): void {
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

