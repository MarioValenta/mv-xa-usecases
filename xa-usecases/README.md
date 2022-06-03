# XaUsecases

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.16.

## Development Environment

The main development environment project (for developing and debugging the UseCase assets) is located in `projects/xa-portal-dev/`, all developed UseCase assets will be imported and loaded here. To load an asset of one UseCase, just import the AppModule inside the app.module.ts of the xa-portal-dev project and also add the custom elemnt via the custom selector e.g. `<create-sr-request-form>`.

## creating new UseCase forms/assets/projects

### update angular.json

- Type `ng g app @<USECASE-NAME>/<FORM-NAME>` e.g. `ng g app @create-sr/request-form` to create a new application project inside the `/projects` folder. This will create a new forms app of the specified UseCase.

- Would you like to add Angular routing? (y/N) => **N**
- Which stylesheet format would you like to use? (Use arrow keys) => **CSS** or **SCSS**

- After that, execute the following command: `ng add ngx-build-plus --project @<USECASE-NAME>/<FORM-NAME>` e.g. `ng add ngx-build-plus --project @create-sr/request-form` to update the builder inside the `angular.json` config file.

### update default selector

- Change the app selector of the newly created component `projects/@<USECASE-NAME>/<FORM-NAME>/src/app/app.component.ts` to something like `<USECASE-NAME>-<FORM-NAME>` e.g. from `app-root` to `create-sr-request-form`.

- Also update the selectors of the **index.html** file `projects/@<USECASE-NAME>/<FORM-NAME>/src/app/index.html`.

### update app.module.ts

- Update the AppModule name to something like `<USECASE-NAME><FORM-NAME>AppModule/` e.g. from `AppModule` to `CreateSRRequestFormAppModule`.

- Update also the import of the new AppModule name e.g. `<USECASE-NAME><FORM-NAME>AppModule` inside the `main.ts`, but if you Refactor the renaming with your IDE, it should already be renamed.

- Next, add the following constructor and the method `ngDoBootstrap()` into the AppModule class and give the custom element an name:

```typescript

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('<USECASENAME-ASSETNAME>', ce);
  }
```

- Next add the following provider to your providers[] array and add `AppComonent` to your exports[] array

```typescript
    {
      provide: XASERVICE_TOKEN,
      useFactory: windowFactory
    }
```

- Next import needed modules to your imports array:
  - BrowserModule,
  - XAUIModule.forRoot(),
  - ReactiveFormsModule,
  - BrowserAnimationsModule,
  - ShowErrorsModule,
  - environment.production ? [] : SharedModule

### final app.module.ts

Your final app.module.ts file should at least look like this:

```typescript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Injector } from "@angular/core";
import { createCustomElement } from "@angular/elements";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";
import { XAUIModule } from "@xa/ui";
import { ShowErrorsModule } from "@xa/show-errors";
import { environment } from "../environments/environment";
import { SharedModule } from "projects/xa-portal-dev/src/app/shared/shared.module";
import { XASERVICE_TOKEN, windowFactory } from "projects/shared.functions";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    XAUIModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ShowErrorsModule,
    environment.production ? [] : SharedModule,
  ],
  providers: [
    {
      provide: XASERVICE_TOKEN,
      useFactory: windowFactory,
    },
  ],
  entryComponents: [AppComponent],
  exports: [AppComponent],
})
export class CreateSRRequestFormAppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define("createsr-request-form", ce);
  }
}
```

### package.json

- Next, add new scripts to the **package.json** for this newly created app. The most important script is the `"build:prod:@<USECASE-NAME>/<FORM-NAME>: ng build --project @<USECASE-NAME>/<FORM-NAME> --configuration production --single-bundle"` e.g. `"build:prod:@create-sr/request-form": "ng build --project @create-sr/request-form --configuration production --single-bundle"`. Executing these script will create one single bundled javscript file.

- Also create optional scripts for running the tests for this newly created project.

### ts-config

- Update of the **tsconfig.app.json** and **tsconfig.spec.json** files is required, in the legacy files the compilerOptions are not that strict, so the projects compile more easily.

* The **tsconfig.app.json** file should extends from
  `"extends": "../../../tsconfig-legacy.json"`
* and the **tsconfig.spec.json** file should extends from
  `"extends": "../../../tsconfig-legacy.json"`

### update budget

- Next, in the case your asset uses ag-grid, the budget values inside the `angular.json` config has to be updated. Update the `maximumWarning` and `maximumError` so the max file size of your asset is in the budget.

```json
"budgets": [
              {
                "type": "initial",
                "maximumWarning": "3mb",
                "maximumError": "4mb"
              },
              {
                "type": "anyComponentStyle",
                "maximumWarning": "2kb",
                "maximumError": "4kb"
              }
            ]
```

### create mocks folder

Every project should have one folder containing all mocks of the data from the RequestType in the XA-Portal.

Create `mocks` folder inside `@<USECASE-NAME>/<FORM-NAME>` e.g. `@create-sr\request-form\mocks`

`mocks` must contain three JSON files:

- Payload.json
- ConfigPayload.json
- Validation.json

Every file has to contain at least one empty JSON object!!!

```json
{}
```

### integrate new project into local xa-portal-dev

- Import the new `<USECASE-NAME><FORM-NAME>AppModule` into `projects/use-cases-forms.app.module.ts` and add it to the exports[] array.

- create new variable for the Context and import the mocks
- Update the imports of the mocks path in the **app.component.ts** `projects/xa-portal-dev/src/app/app.component.ts` and create an import for each .json file inside the `mocks` folder
- for example the imports for Create Service Request look like this

```typescript
// Create SR
import _ as CreateSR_Payload from '../../../@create-sr/request-form/mocks/Payload.json';
import _ as CreateSR_ConfigPayload from '../../../@create-sr/request-form/mocks/ConfigPayload.json';
import \* as CreateSR_Validation from '../../../@create-sr/request-form/mocks/Validation.json';
```

- Use this imports and build the needed Context for your newly created asset, build either a new RequestContext or CeTaskContext

```typescript
// REQUEST CONTEXT
CreateSR_Context: RequestContext = this.BuildRequestContext({
  payload: importedPayload,
  configPayload: importedConfigPayload,
  validation: importedValidation,
});

// OR TASK CONTEXT
<USECASE-NAME><FORM-NAME>_task_context: TaskContext =
  this.BuildCeTaskContext({
  payload: importedPayload,
  configPayload: importedConfigPayload,
  validation: importedValidation,
  });
```

- Add the `<USECASE-NAME>-<FORM-NAME>` selector to the **app.component.html** `projects/xa-portal-dev/src/app/app.component.html` inside the following tag element with the context variable as attribute:

```html
<div class="content-main">
  ....
  <create-sr-request-form [Context]="CreateSR_Context"></create-sr-request-form>
  .....
</div>
```

### Data Service: add window factory Injection Token

In your service classes use the following token `@Inject(XASERVICE_TOKEN) private xaservices: XAServices` as dependency injection token:

```typescript
import { XASERVICE_TOKEN } from 'projects/shared.functions';
.....
constructor(..., ..., @Inject(XASERVICE_TOKEN) private xaservices: XAServices) { }
.....
```

The windowFactory with useFactory insteand of the useValue is used because:

During AoT compilation, angular CLI statically analyses code too generate ngmodule.factory file. It sees "useValue" and check if static value is available and puts it into ngmodule.factory. During compile time, this value is not available, so it leaves that provider value and hence, it is returned as "undefined" when injected into constuctor.
However, "useFactory" is provided for very same purpose where you don't know your value until runtime.
Due to this, useValue is not working in your scenario, but "useFactory" will work.
Bottom line: When AOT compilation, Use "useValue" only if you have static value like constant string or number. Else use "useFactory" to return run-time calculated object/values.

Source: https://stackoverflow.com/a/47722439

### ag-grid import

- If the asset/project uses _ag-grid_, then the license needs to be added to the `main.ts` file of the project, just add the following lines:

```typescript
import { LicenseManager } from "ag-grid-enterprise";
import { AG_GRID_LICENSE } from "@xa/grid";
LicenseManager.setLicenseKey(AG_GRID_LICENSE);
```

- Also import the ag-grid module with optional components into the AppModule and import the enterprise version:

```typescript
import 'ag-grid-enterprise';
.....
 imports: [
   .....
   AgGridModule.withComponents([]),

  //  OR WITH OPTIONAL COMPONENTS

   AgGridModule.withComponents([
      ...AllCellEditors,
      ...AllCellRenderers,
      GridStatusBarSharedModule
    ]),
 ]
 .....
```

## shared components

Use if possible existing shared modules or components like:

### ng2-flatpickr

see commit: aa2b49c4612ae3e5ad45b2413437a7d9f179ba15

### InfoMailShareModule

see commit: d6d13c8d7707936746639276cc5c43c7c9759ec0

```html
<h2 class="ui dividing header" style="margin-top: 50px">
  <i class="share alternate icon"></i>
  <div class="content">
    <span> Information Sharing </span>
    <div class="sub header">
      Specify e-mail address(es) below that you want to inform about the
      creation of the change
      <b>(separated by ; )</b>.
    </div>
  </div>
</h2>

<div class="field">
  <info-mail-share
    [label]="FORM_LABEL_MAILS"
    [controlName]="FORM_KEY_MAILS"
    [required]="isFormElementRequired(FORM_KEY_MAILS)"
  ></info-mail-share>
</div>
```

### attachments-upload

see commit: 1179433cdb29eeef0a450d86b6427fd8f31019c0

```html
<h2 class="ui dividing header">
  <i class="file outline icon"></i>
  <div class="content">
    <span> Attachments </span>
    <div class="sub header">
      Select and add attachments that you want to add to the change.
    </div>
  </div>
</h2>

<div class="field">
  <ui-attachments-upload
    style="width: 100%; height: 250px"
    [maxNumberofFiles]="3"
    [maxFileSizeInMB]="5"
    formFieldName="Attachments"
  >
  </ui-attachments-upload>
</div>
```

## Development server

Run `npm run debug` or `ng serve --port 4200 --aot -o` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

Use `ng g app @<usecase-name>/<asset-name>` eg. `ng g app @create-sr/request-form` to generate a new Request Form for the UseCase `Create Service Request`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
