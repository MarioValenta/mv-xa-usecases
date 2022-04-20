import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ICETask, ICETaskContext, FeedbackRequestPayload } from '@xa/lib-ui-common';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged, map } from 'rxjs/operators';
import { HostPartitionOptions } from 'projects/@sap-application-rundown/shared/models/hostpartitions.model';


@Component({
  selector: 'sap-application-rundown-ut-select-storage',
  templateUrl: './app.component.html',
  styles: [
    `
      .redClass { color: red }
      .blackClass { color: black }
    `
  ]
})
export class AppComponent implements ICETask, OnInit, OnDestroy {


  @Input() Context!: ICETaskContext;

  form: FormGroup;
  info: any;
  comments: any;
  svc =[];
  alsomountedhosts = new Array<any>();
  arrofstornastrue = new Array<any>();
  stornasbyalsousedhosts = new Array<any>();
  destroy$ = new Subject<any>();


  constructor(private fb: FormBuilder) {

    this.form = this.fb.group({
      Partitions: this.fb.array([])
    });
  }

  ngOnInit() {
    console.log(this.Context)
    this.info = this.Context.Payload.info;
    this.comments = this.Context.Payload.comments;

    this.Context.Payload.SVC.forEach(element => {
      this.svc.push(element)

    });
    console.log('test',this.comments)

    this.Context.Payload.HOST.results.rows.forEach(element => {

      if (element.usedByAnotherHost) {

        this.arrofstornastrue.push(element.stornasname)

      }

    });


    this.Context.Payload.HOST.results.rows.forEach(el => {
      this.arrofstornastrue.filter(x => {
        if (el.stornasname.includes(x)) {
          this.alsomountedhosts = el.alsoUsedByHosts.map(obj => {
            var payload = {};
            const key = x;
            payload[key] = obj.hostname;

            this.stornasbyalsousedhosts.push(payload)
            return payload


          });

        }

      })


    });


    this.form.statusChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(status => this.Context.Valid = status);

    if (this.Context.Payload) {

      this.Context.Payload.HOST.Partitions.forEach(element => {
        this.formArray.push(this.buildRow(element));
      });

    }

    this.Context.OnSubmit(() => this.Submit());
    this.Context.OnFeedback(() => this.Feedback());

  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  get formArray() {
    return this.form.get('Partitions') as FormArray;
  }

  buildRow(item?: HostPartitionOptions) {
    item = item || new HostPartitionOptions();

    return this.fb.group({
      delvolumes: [item.delvolumes || false],
      delqtree: [item.delqtree || false],
      export: [item.export || false],
      Mountpoint: [item.Mountpoint],
      Filesystem: [item.Filesystem],
      SizeGB: [item.SizeGB],
      Device: [item.Device],
    });
  }

  observeChanges(fg: FormGroup) {

    const delvolume = fg.get('delvolumes');
    const delqtree = fg.get('delqtree');
    const exportt = fg.get('export');

    return delvolume.valueChanges.pipe(
      distinctUntilChanged(),
      map(value => {

        if (value === true) {

          delqtree.setValue(true);
          exportt.setValue(true);

        } else {
          delqtree.setValue(false);
          exportt.setValue(false);
        }
      }));
  }

  getColor(value) {

    const arr = this.arrofstornastrue.filter(item => value.indexOf(item) !== -1)

    if (arr.length > 0) {
      return true
    } else {
      return false
    }

  }


  Submit() {

    if (this.form.valid) {
      console.debug(this.form.value);
    } else {
      console.error('Form is not valid', this.form);
    }

    const model = this.form.value;

    return {
      value: model,
      runtimeData: model
    };
  }

  Feedback(): FeedbackRequestPayload {

    return this.form.value;
  }

}
