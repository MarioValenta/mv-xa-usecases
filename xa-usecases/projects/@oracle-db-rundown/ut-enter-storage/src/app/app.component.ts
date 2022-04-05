import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFormArrayConfigDTO } from 'projects/@oracle-db-rundown/shared/input-forms-array/dto/i-form-array-config-dto';
import { TaskContextFormsBaseClass } from 'projects/base-usecase-classes/task-context-forms-base-class';

@Component({
  selector: 'oracle-db-rdn-ut-enter-storage',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class OracleDbRdnUTEnterStorageAppComponent extends TaskContextFormsBaseClass implements AfterViewInit {
  title = 'oracle-db-rdn-ut-enter-storage';

  OUTPUT_VARIABLE_NAME: string = 'selectedMountList';
  constructor(private fb: FormBuilder) {
    super('oracle-db-rdn-ut-enter-storage');

    this.form = this.fb.group({
      [this.OUTPUT_VARIABLE_NAME]: this.fb.array([])
    });
  }

  ngAfterViewInit(): void {
    this.Context.Valid = true;
    this.form.statusChanges.subscribe(res => this.Context.Valid = res);
  }

  formArrayFieldRows: IFormArrayConfigDTO = {
    rows: [
      {
        fields: [
          {
            type: 'text',
            required: true,
            formControlName: 'Mountpoint',
            label: 'Mountpoint',
            placeholder: 'enter the mountpoint'
          },
          {
            type: 'text',
            required: true,
            formControlName: 'Device',
            label: 'Device',
            placeholder: 'enter the device'
          },
          {
            type: 'text',
            required: true,
            formControlName: 'Filesystem',
            label: 'Filesystem',
            placeholder: 'enter the filesystem'
          },
          {
            type: 'text',
            required: true,
            formControlName: 'SizeGB',
            label: 'SizeGB',
            placeholder: 'enter the size in GB'
          }
        ]
      }
    ]
  }

  newFormGroup(): FormGroup {
    return this.fb.group({
      Mountpoint: ['', Validators.required],
      Device: ['', Validators.required],
      Filesystem: ['', Validators.required],
      SizeGB: ['', Validators.required],
      delvolumes: ['NA', Validators.required],
      delqtree: ['NA', Validators.required],
      delexport: ['NA', Validators.required]

    });
  }

}
