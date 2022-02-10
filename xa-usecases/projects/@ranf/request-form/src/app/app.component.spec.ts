import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AllCellEditors, AllCellRenderers, XAGridHelperModule } from '@xa/grid';
import { XAServices } from '@xa/lib-ui-common';
import { XAModalService, XAUIModule } from '@xa/ui';
import { ValidationService } from '@xa/validation';
import { AgGridModule } from 'ag-grid-angular';
import { assert } from 'console';
// TODO import { SharedModule } from 'DevEnvironment/src/app/shared/shared.module';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AttachmentUploadComponent } from './attachmentupload-component/AttachmentUpload.component';
import { ExcelTableUploadComponent } from './excel-table-component/excel.table.component';
import { XAToastDefaults } from 'projects/shared/toast-config';
import { Ng2FlatpickrModule } from 'projects/shared/ng2-flatpickr/ng2-flatpickr.module';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ExcelTableUploadComponent,
        AttachmentUploadComponent
      ],
      imports: [
        BrowserModule,
        XAUIModule.forRoot(),
        XAGridHelperModule,
        AgGridModule.withComponents([
          ...AllCellEditors,
          ...AllCellRenderers
        ]),
        ReactiveFormsModule,
        BrowserAnimationsModule,
        //environment.production ? [] : SharedModule,
        Ng2FlatpickrModule
      ],
      providers: [
        {
          provide: XAServices,
          useValue: (window as any).xa
        },
        {
          provide: 'XANotifyToastConfig',
          useValue: XAToastDefaults
        },
        XAModalService,
        ValidationService
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }));

  // it('should create the app', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app).toBeTruthy();
  // });

  // it(`should have as title 'RequestForm'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('RequestForm');
  // });

  // it('should render title in a h1 tag', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('Welcome to RequestForm!');
  // });

  it('test', () => {
    const fixture = TestBed.createComponent(ExcelTableUploadComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    assert(fixture.componentInstance.checkNumber('23'), '23');
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to RequestForm!');
  });



      // // VALID
      // console.log(this.checkNumber("0"));
      // console.log(this.checkNumber("0,9"));
      // console.log(this.checkNumber("2"));
      // console.log(this.checkNumber("2,2"));
      // console.log(this.checkNumber("2222"));
      // console.log(this.checkNumber("2222,2"));
      // console.log(this.checkNumber("8999,265"));
      // console.log(this.checkNumber("8999,000265"));
      // console.log(this.checkNumber("8999,00000265"));
      // console.log(this.checkNumber("8999,00000244999"));

      // console.log(this.checkNumber("-0"));
      // console.log(this.checkNumber("-0,9"));
      // console.log(this.checkNumber("-2"));
      // console.log(this.checkNumber("-2,2"));
      // console.log(this.checkNumber("-2222"));
      // console.log(this.checkNumber("-2222,2"));
      // console.log(this.checkNumber("-8999,265"));
      // console.log(this.checkNumber("-8999,000265"));
      // console.log(this.checkNumber("-8999,00000265"));

      // // NOT VALID
      // console.log(this.checkNumber("0.9"));
      // console.log(this.checkNumber("-0.9"));
      // console.log(this.checkNumber("2.0"));
      // console.log(this.checkNumber("-2.0"));
      // console.log(this.checkNumber("2222.2"));
      // console.log(this.checkNumber("-2222.2"));
      // console.log(this.checkNumber("8999.265"));
      // console.log(this.checkNumber("8999.000265"));
      // console.log(this.checkNumber("8999.00000265"));


});
