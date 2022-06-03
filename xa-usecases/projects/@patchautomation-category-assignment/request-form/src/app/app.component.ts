import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RequestContextBaseComponent } from 'projects/usecase-base-class/request-context-base.component';
import { Observable } from 'rxjs';

import { DataService } from './app.data.service';

@Component({
  selector: 'patchautomation-category-assignment-request-form',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends RequestContextBaseComponent {

  title = '@patchautomation-category-assignment/request-form';

  readonly FORM_CUSTOMER: { key: string, label: string, placeholder: string } = { key: 'customer', label: 'Customer', placeholder: 'Select Customer ...' };
  readonly FORM_KEY_ASSIGNMENT_GROUP = 'assignmentGroup';

  customers$: Observable<any[]> = new Observable<any[]>();

  constructor(private formBuilder: FormBuilder, private dataService: DataService) {
    super('patchautomation-category-assignment/request-form');
  }

  buildForm(): void {
    console.debug(this.title, 'buildForm()');

    this.form = this.formBuilder.group({
      [this.FORM_CUSTOMER.key]: [''],
      [this.FORM_KEY_ASSIGNMENT_GROUP]: [''],
      cis: ['']
    });
  }

  customOnInit() {
    console.debug(this.title, 'customOnInit()');

    this.customers$ = this.dataService.getCustomers();
  }

  updateCIForm(CIs) {
    this.form.get('cis')!.setValue(CIs);
  }


}
