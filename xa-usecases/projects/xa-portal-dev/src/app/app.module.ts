import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XAUIModule } from '@xa/ui';
import { AllCellEditors, AllCellRenderers } from '@xa/grid';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';

import { AppRoutingModule } from './app-routing.module';
import { AppHtmlFormsComponent } from './app.component';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { UIButtonComponent } from './content-ui';
import { CERequestComponent } from './requests/ce-request/ce-request.component';
import { AppConfigService } from './app-config.service';
import { AppInitializeService } from './app-initialize.service';
import { SharedModule } from './shared/shared.module';
import { ErrorModalComponent } from './requests/ce-request/error-modal/error-modal-component';
import { UserTaskZoneComponent } from './user-tasks/user-task-zone.component';
import { FormsImportModule } from './forms-import.module';


const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.getConfig();
  };
};

@NgModule({
  declarations: [
    AppHtmlFormsComponent,
    LeftMenuComponent,
    UIButtonComponent,
    CERequestComponent,
    UserTaskZoneComponent,
    ErrorModalComponent
  ],
  imports: [
    AppRoutingModule,
    XAUIModule.forRoot(),
    BrowserAnimationsModule,
    SharedModule.forRoot(),
    AgGridModule.withComponents([
      ...AllCellEditors,
      ...AllCellRenderers
    ]),
    FormsImportModule
  ],

  providers: [
    AppConfigService,
    AppInitializeService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService]
    }
  ],
  entryComponents: [
    ErrorModalComponent
  ],
  bootstrap: [AppHtmlFormsComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModuleHtmlForms { }
