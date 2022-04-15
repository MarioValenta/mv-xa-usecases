import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'projects/shared/customvalidator';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class VMCreateForm {

    private formBuilder: FormBuilder;

    private instance: FormGroup;

    private destroy$ = new Subject();

    constructor() {
        this.formBuilder = new FormBuilder();
    }

    public Create() {

        this.instance = this.formBuilder.group({
            Projectname: [null, Validators.required],
            Customer: [null, Validators.required],
            WbsInstall: [null, [Validators.required, Validators.minLength(16), Validators.maxLength(19), CustomValidators.wbspattern]],
            WbsOperations: [null, [Validators.required, Validators.minLength(16), Validators.maxLength(19), CustomValidators.wbspattern]],
            SupportedBy: [null, Validators.required],
            AppSupportedBy: [null],
            Environment: [null, Validators.required],
            Criticality: [null, Validators.required],
            UseSLA: [false],
            SLAName: [{ value: null, disabled: true }, Validators.required],
            ServiceTime: [null, Validators.required],

            PlatformOptions: this.formBuilder.group({
                Infrastructure: [{ value: null, disabled: true }, Validators.required],
                Location: [{ value: null, disabled: true }, Validators.required],
                Datastore: [{ value: null, disabled: true }, Validators.required],
                DedicatedLocal: [{ value: null, disabled: true }, Validators.required],
                BackupReplication: ['']
            }),
            AffinityRules: [null],
            OS: [null, Validators.required],
            OSVersion: [{ value: null, disabled: true }, Validators.required],
            LicenseType: [{ value: null, disabled: true }, Validators.required],
            LicenseValue: [{ value: null, disabled: true }, Validators.required],
            Hostname: ['', Validators.required],
            Domain: [null],
            Domainjoin: [false],
            Timezone: ['', Validators.required],
            Patchmode: [null, Validators.required],
            VMOptions: this.formBuilder.group({
                PayPerUse: false,
                PPUunlimited: true,
                LimitsUnit: [null],
                LowerLimitValue: ['', Validators.required],
                UpperLimitValue: ['', Validators.required],
                UpperLimit: [false],
                LowerLimit: [true],

                VRAM: [0, [Validators.required, Validators.max(256)]],
                VCPU: [0, [Validators.required, Validators.max(32)]],
                VMDK: [null, Validators.required],
                Backup: ['VMware', Validators.required],
                BackUpTime: '',
                CustomBackUpTimeHour: '',
                CustomBackUpTimeMinute: '',
            }),
            NetworkOptions: this.formBuilder.group({
                CustomerLan: [null],
                AdminLan: [null],
                TSMLan: [null, Validators.required],
            }),
            NetworkRequestOptions: this.formBuilder.group({
                CustomerLan: this.formBuilder.group({
                    IPv4: [false],
                    IPv6: [false]
                }),
                AdminLan: this.formBuilder.group({
                    IPv4: [false],
                    IPv6: [false]
                }),
                TSMLan: this.formBuilder.group({
                    IPv4: [false],
                    IPv6: [false]
                }),
            }),
            CustomerSpecIPs: [null, [Validators.maxLength(800)]],
        });


        return this.instance;
    }

    public Destroy() {
        this.destroy$.next();
    }

    PatchValue(name: string, value: any) {
        this.instance.get(name).patchValue(value);
    }

    ClearValue(name: string) {
        this.PatchValue(name, null);
    }

    SetDisabled(name: string, value?: boolean) {
        if (value == null || value === undefined) {
            value = true;
        }

        if (value) {
            this.instance.get(name).disable();
        } else {
            this.instance.get(name).enable();
        }

    }

    ChangeDisabledState(field: string, value: Observable<boolean>) {
        value.pipe(
            takeUntil(this.destroy$)
        ).subscribe(val => {
            this.SetDisabled(field, val);
        });

    }
}
