import { Component, Inject, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FeedbackRequestPayload } from '@xa/lib-ui-common';
import { Subject } from 'rxjs';

@Component({
  template: ''
})
export abstract class FormsBaseClass implements OnDestroy {

  title: string = 'empty title';
  form: FormGroup = new FormGroup({});
  destroy$ = new Subject<any>();

  constructor(@Inject(String) title?: string) {
    if (title) {
      this.title = title;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  feedback(): FeedbackRequestPayload {
    return this.form.value;
  }
}
