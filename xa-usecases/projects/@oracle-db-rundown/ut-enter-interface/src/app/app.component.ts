import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFormArrayConfigDTO } from 'projects/@oracle-db-rundown/shared/input-forms-array/dto/i-form-array-config-dto';
import { TaskContextBaseComponent } from 'projects/usecase-base-class/task-context-base.component';

@Component({
  selector: 'oracle-db-rdn-ut-enter-interface',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class OracleDbRdnUTEnterInterfaceAppComponent extends TaskContextBaseComponent implements AfterViewInit {

  title = 'oracle-db-rdn-ut-enter-interface';
  OUTPUT_VARIABLE_NAME: string = 'selectedInterfaceList';

  constructor(private fb: FormBuilder) {
    super('oracle-db-rdn-ut-enter-interface');
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
            formControlName: 'Interface',
            label: 'Interface',
            placeholder: 'enter the interface...'
          },
          {
            type: 'text',
            required: true,
            formControlName: 'IP',
            label: 'IP or IPv6',
            placeholder: 'enter the IP or IPv6 address...'
          }
        ]
      }
    ]
  }

  newFormGroup(): FormGroup {
    return this.fb.group({
      Interface: ['', Validators.required],
      IP: ['', Validators.required]
    });
  }

}
