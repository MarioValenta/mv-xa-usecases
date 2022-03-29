import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AllCellEditors, AllCellRenderers, XAGridHelperModule } from '@xa/grid';
import { XAModalService, XAUIModule } from '@xa/ui';
import { ValidationService } from '@xa/validation';
import { AgGridModule } from 'ag-grid-angular';
import { assert } from 'console';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ExcelTableUploadComponent } from './excel-table-component/excel.table.component';
import { XAToastDefaults } from 'projects/shared/toast-config';
import { Ng2FlatpickrModule } from 'projects/shared/ng2-flatpickr/ng2-flatpickr.module';
import { SharedModule } from 'projects/xa-portal-dev/src/app/shared/shared.module';
import { XASERVICE_TOKEN, windowFactory } from 'projects/shared.functions';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ExcelTableUploadComponent
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
        environment.production ? [] : SharedModule,
        Ng2FlatpickrModule
      ],
      providers: [
        {
          provide: XASERVICE_TOKEN,
          useFactory: windowFactory
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
