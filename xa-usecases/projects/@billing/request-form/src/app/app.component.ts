import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ICERequest, ICERequestContext, FeedbackRequestPayload } from "@xa/lib-ui-common";
import { takeUntil } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import Lightpick from 'lightpick';

@Component({
    selector: 'billing-request-form',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements ICERequest, OnInit, OnDestroy {

    @Input() Context: ICERequestContext;

    form: FormGroup;
    Customers$ = of(['UNIQA']);


    destroy$ = new Subject();
    constructor(private fb: FormBuilder, private cref: ChangeDetectorRef) {

    }

    ngOnInit() {

        this.form = this.fb.group({
            Customer: ['', Validators.required],
            CustomerOrderNumber: ['', Validators.required],
            Period: ['', Validators.required],

        });

        this.form.statusChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe(status => this.Context.Valid = status);

        var picker = new Lightpick({
            field: document.getElementById('datepicker'),
            minDate: this.GetDate(),
            format: 'DD.MM.YYYY',
            singleDate: false,
            onSelect: (start, end) => {
                if (start && end) {
                    this.form.get('Period').patchValue(`${(start && start.format('DD.MM.YYYY')) || '...'} - ${(end && end.format('DD.MM.YYYY')) || '...'}`)

                } else {
                    this.form.get('Period').patchValue(null);
                }
                this.cref.markForCheck();

            }
        });

        this.Context.OnSubmit(() => this.SubmitForm());
        this.Context.OnFeedback(() => this.Feedback());


        if (this.Context.Payload) {
            this.form.patchValue(this.Context.Payload);
        }
    }

    public GetDate() {
        const dt = new Date();
        return dt;
    }

    ngOnDestroy() {
        this.destroy$.next();
    }

    public SubmitForm() {

        if (this.form.valid) {
            console.debug(this.form.value);
        } else {
            console.error('Form is not valid', this.form);
        }

        const model = this.form.value;

        return {
            value: model,
            identifier: `${model.Customer} ${model.Period} ${model.CustomerOrderNumber}`
        };


    }

    Feedback(): FeedbackRequestPayload {

        return this.form.value;
    }
}
