import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ICETask } from '@xa/lib-ui-common';
import { TaskContextFormsBaseClass } from 'projects/base-usecase-classes/task-context-forms-base-class';

@Component({
  selector: 'test-user-task-ut-user-task',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends TaskContextFormsBaseClass  implements ICETask, OnInit, OnDestroy {

  title = 'Test User Task';

  constructor(private fb: FormBuilder) {
    super();
  }

  buildForm() {
    this.form = this.fb.group({
      Customer: ['ACME'],
      Test1: ['Test UT 1'],
      Test2: ['Test UT 2'],
      Test3: ['Test UT 3'],
      Aborted: false,
      Comment: ['Test UT 4']
    });
  }

  customOnInit(): void {
    this.Context.Valid = true;
  }

}
