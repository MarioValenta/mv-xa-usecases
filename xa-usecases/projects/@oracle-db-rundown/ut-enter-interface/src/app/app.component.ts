import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFormArrayConfigDTO } from 'projects/@oracle-db-rundown/shared/input-forms-array/dto/i-form-array-config-dto';
import { TaskContextFormsBaseClass } from 'projects/base-usecase-classes/task-context-forms-base-class';

@Component({
  selector: 'oracle-db-rdn-ut-enter-interface',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class OracleDbRdnUTEnterInterfaceAppComponent extends TaskContextFormsBaseClass implements AfterViewInit {

  title = 'oracle-db-rdn-ut-enter-interface';
  OUTPUT_VARIABLE_NAME: string = 'selectedInterfaceList';

  constructor(private fb: FormBuilder) {
    super('oracle-db-rdn-ut-enter-interface');
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
            formControlName: 'Interface',
            label: 'Interface',
            placeholder: 'enter the interface'
          },
          {
            type: 'text',
            required: true,
            formControlName: 'IP',
            label: 'IP',
            placeholder: 'enter the IP'
          },
          {
            type: 'text',
            required: true,
            formControlName: 'IPv6',
            label: 'IPv6',
            placeholder: 'enter the IPv6'
          }
        ]
      }
    ]
  }

  newFormGroup(): FormGroup {
    return this.fb.group({
      Interface: ['', Validators.required],
      IP: ['', Validators.required],
      IPv6: ['', Validators.required]
    });
  }

}
