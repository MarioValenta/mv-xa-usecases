import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFormArrayConfigDTO } from 'projects/@oracle-db-rundown/shared/input-forms-array/dto/i-form-array-config-dto';
import { TaskContextBaseComponent } from 'projects/usecase-base-class/task-context-base.component';

@Component({
  selector: 'oracle-db-rdn-ut-enter-storage',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class OracleDbRdnUTEnterStorageAppComponent extends TaskContextBaseComponent implements AfterViewInit {

  title = 'oracle-db-rdn-ut-enter-storage';
  OUTPUT_VARIABLE_NAME: string = 'selectedMountList';

  constructor(private fb: FormBuilder) {
    super('oracle-db-rdn-ut-enter-storage');
  }

  buildForm(): void {
    console.debug(this.title, ': buildForm()');

    this.form = this.fb.group({
      [this.OUTPUT_VARIABLE_NAME]: this.fb.array([])
    });
  }

  ngAfterViewInit(): void {
    this.Context.Valid = true;
  }

  formArrayFieldRows: IFormArrayConfigDTO = {
    rows: [
      {
        fields: [
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
            formControlName: 'Mountpoint',
            label: 'Mountpoint',
            placeholder: 'enter the mountpoint'
          }
        ]
      }
    ]
  }

  newFormGroup(): FormGroup {
    return this.fb.group({
      Device: ['', Validators.required],
      Mountpoint: ['', Validators.required],
      delvolumes: ['NA', Validators.required],
      delqtree: ['NA', Validators.required],
      delexport: ['NA', Validators.required]
    });
  }

}
