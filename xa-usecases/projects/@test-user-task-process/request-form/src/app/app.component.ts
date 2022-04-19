import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ICERequest } from '@xa/lib-ui-common';
import { RequestContextFormsBaseClass } from 'projects/base-usecase-classes/request-context-forms-base-class';

@Component({
  selector: 'test-user-task-process-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends RequestContextFormsBaseClass implements ICERequest {

  constructor(private fb: FormBuilder, private cref: ChangeDetectorRef) {
    super();
    this.requestFormIdentifier = 'UserTask-Test';
  }

  buildForm(): void {
    this.form = this.fb.group({
      Customer: ['ACME'],
      Test1: ['Test 1'],
      Test2: ['Test 2'],
      Test3: ['Test 3']
    });
  }
  customOnInit(): void {
    this.Context.Valid = true;
  }

}

