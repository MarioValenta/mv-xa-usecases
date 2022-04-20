import { Component, Input, Output, EventEmitter, forwardRef, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { takeUntil, distinctUntilChanged, map } from 'rxjs/operators';
import { Subject, Subscription, BehaviorSubject } from 'rxjs';
import { NetworkOptions } from './models';
import { AffectedDevicesInfo } from './modals/search-devices-dialog/model/AffectedDevicesInfo';
import { CreateIPNetworkModalService } from './modals/createipnetworkmodalservice';
import { ICETaskContext } from '@xa/lib-ui-common';


@Component({
    selector: 'approvaltask-table',
    templateUrl: './approvaltask-table.1.0.0.component.html',
    styleUrls: ['./create-ip-styles.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ApprovaltaskTableComponent),
        multi: true
    }],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ApprovaltaskTableComponent implements ControlValueAccessor, OnInit, OnDestroy {

    @Input() Context: ICETaskContext;

    @Input()
    set value(value: Array<NetworkOptions>) {
        if (value) {
            this._items.next(value);
        } else {
            this._items.next([]);
        }

    }

    constructor(private fb: FormBuilder, private cref: ChangeDetectorRef, private createIPDialog: CreateIPNetworkModalService) {

    }

    get formArray() {
        return this.form.get('Entries') as FormArray;
    }

    @Input() form: FormGroup;
    @Input() location: string;
    private _items = new BehaviorSubject<Array<NetworkOptions>>([]);

    @Output() valueChange: EventEmitter<Array<NetworkOptions>> = new EventEmitter<Array<NetworkOptions>>();
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();

    dta = new DataSource();
    destroy$ = new Subject<any>();

    _subscritions = new Map<number, Subscription>();

    registered = [];

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
                this.propagateChange(value.Entries);
            });

        });

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

    buildRow(item?: NetworkOptions ) {

        item = item || new NetworkOptions();

        return this.fb.group({
            NetworkType: [item.NetworkType || 'Admin-LAN'],
            ProviderIndependent: [item.ProviderIndependent || false],
            IPType: [item.IPType || 'IPv4'],
            IPQuantity: [item.IPQuantity || ''],
            IPNetwork: [item.IPNetwork || ''],
            IPAuthority: [item.IPAuthority || 'TSA'],
            IPComment: [item.IPComment || '', Validators.required],
            AffectedDevices: [[]],
            AffectedCategory: ['CAT01078530', Validators.required]
        });

    }

    AddDevice(index) {
        const devices = this.formArray.controls[index].get('AffectedDevices').value;
        this.createIPDialog.OpenSearchComponent(this.getLocation(), devices, (context) => {
            this.AddDivicesinForm(context.Data, index);
        });

    }

    getLocation() {
        console.log(this.location);
        return this.location;

    }

    AddDivicesForm(item) {
        return this.fb.group({
            HostID: [item.HostID],
            HostName: [item.HostName],
            SupportGroup: [item.SupportGroup],
        });
    }

    AddDivicesinForm(formvalues: Array<AffectedDevicesInfo>, index) {
        this.formArray.controls[index].get('AffectedDevices').patchValue(formvalues);
        this.cref.markForCheck();

    }

    keyPress(event: any) {
        const pattern = /[0-9\ ]/;
        const inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode !== 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
    observeChanges(fg: FormGroup | AbstractControl) {

        const AffectedDevices = fg.get('AffectedDevices');
        const AffectedCategory = fg.get('AffectedCategory');


        return AffectedDevices.valueChanges.pipe(
            map(value => {

                if (value.length > 0) {

                    AffectedCategory.clearValidators();
                    AffectedCategory.updateValueAndValidity();

                } else {

                    AffectedCategory.setValidators(Validators.required);
                    AffectedCategory.updateValueAndValidity();

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

    AffectedCategory: Array<string> = ['CAT01078530'];
}

