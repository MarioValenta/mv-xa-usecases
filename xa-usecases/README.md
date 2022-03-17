# XaUsecases

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.16.

## Development Environment

The main development environment project (for developing and debugging the UseCase assets) is located in `projects/xa-portal-dev/`, all developed UseCase assets will be imported and loaded here. To load an asset of one UseCase, just import the AppModule inside the app.module.ts of the xa-portal-dev project and also add the custom elemnt via the custom selector e.g. `<create-sr-request-form>`.

## creating new UseCase forms/assets/projects

### update angular.json
* Type `ng g app @<USECASE-NAME>/<FORM-NAME>` e.g. `ng g app @create-sr/request-form` to create a new application project inside the `/projects` folder. This will create a new forms app of the specified UseCase.

* Would you like to add Angular routing? (y/N) => N
* Which stylesheet format would you like to use? (Use arrow keys) => CSS or SCSS

* After that, execute the following command: `ng add ngx-build-plus --project @<USECASE-NAME>/<FORM-NAME>` e.g. `ng add ngx-build-plus --project @create-sr/request-form` to update the builder inside the `angular.json` config file.

### ag-grid
* If the asset/project uses *ag-grid*, then the license needs to be added to the `main.ts` file of the project, just add the following lines:

```typescript
import {LicenseManager} from 'ag-grid-enterprise';
import { AG_GRID_LICENSE } from '@xa/grid';
LicenseManager.setLicenseKey(AG_GRID_LICENSE);
```
* Also import the ag-grid module with optional components into the AppModule and import the enterprise version:

```typescript
import 'ag-grid-enterprise';
.....
 imports: [
   .....
 AgGridModule.withComponents([
      ...AllCellEditors,
      ...AllCellRenderers,
      GridStatusBarSharedModule
    ]),
 ]
 .....
```

* Next, add the constructor and the method `ngDoBootstrap()` into the AppModule class and give the custom element an name:
```typescript
 constructor(private injector: Injector) {

  }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('<USECASENAME-ASSETNAME>', ce);
  }
```

### package.json
* Next, add new scripts to the **package.json** for this newly created app. The most important script is the `"build:prod:@<USECASE-NAME>/<FORM-NAME>: ng build --project @<USECASE-NAME>/<FORM-NAME> --configuration production --single-bundle"` e.g. `"build:prod:@create-sr/request-form": "ng build --project @create-sr/request-form --configuration production --single-bundle"`. Executing these script will create one single bundled javscript file.

* Also create scripts for running the tests for this newly created project.

### ts-config
* If you add an old UseCase project to this project, updating the **tsconfig.app.json** and **tsconfig.spec.json** is required.

- The **tsconfig.app.json** file of the old UseCase should extends from
  `"extends": "../../../tsconfig-legacy.json"`
- and the **tsconfig.spec.json** should extends from
  `"extends": "../../../tsconfig-legacy.json"`

### update budget
* Next, in most cases the budget values inside the `angular.json` config have to be changed. Move the budget config from the `architect.build.configurations` to `architect.build.options` and update the budget like this configuration:

```json
"budgets": [
              {
                "type": "initial",
                "maximumWarning": "2mb",
                "maximumError": "4mb"
              },
              {
                "type": "anyComponentStyle",
                "maximumWarning": "2kb",
                "maximumError": "4kb"
              }
            ]
```

### workaround for undefined XAServices

To fix the problem with the undefined xaservices variable for the service, add into the contructor of every file, (where the XAServices is injected) the following if statement:

```typescript
  constructor(....., public xaservices: XAServices) {
    if (this.xaservices === undefined || this.xaservices === null) {
      this.xaservices = ((window as any).xa as XAServices);
    }
  }
```

## importing old UseCase projects (RequestForms or UserTasks from exisitng UseCase project)

If you want to add an old UseCase project into this MonoRepo, follow this steps (has to be done for every project/form):

1. Follow the steps from the section: [#update angular.json](#update-angularjson), create a new project for every project in the old UseCase project.

2. Remove the created `projects/@<USECASE-NAME>/<FORM-NAME>/src/app` folder and copy the src/app folder of the old UseCase and paste it into  `projects/@<USECASE-NAME>/<FORM-NAME>/src`.

3. Follow the steps from the section: [#ts config](#ts-config)

4. Search for imports like `DevEnvironment/src/app/.....` and try to replace it with `projects/xa-portal-dev/src/app/.....` IF the old UseCase projects contained the DevEnvironment.

5. Copy the `mocks` folder from the old project into the `projects/@<USECASE-NAME>/<FORM-NAME>/` path.

6. Change the app selector of the newly created project `projects/@<USECASE-NAME>/<FORM-NAME>/src/app/app.component.ts` to something like `<USECASE-NAME>-<FORM-NAME>` e.g. from `app-root` to `create-sr-request-form`.

7. Update the selectors of the **index.html** file `projects/@<USECASE-NAME>/<FORM-NAME>/src/app/index.html`.

8. Update the AppModule name to something like `<USECASE-NAME><FORM-NAME>AppModule/` e.g. from `AppModule` to `CreateSRRequestFormAppModule`.

9. Update also the import of the new AppModule name e.g. `<USECASE-NAME><FORM-NAME>AppModule` inside the `main.ts`, but if you Refactor the renaming with your IDE, it should already be renamed.

10. Import the new `<USECASE-NAME><FORM-NAME>AppModule` into `projects/use-cases-forms.app.module.ts` and add it to the imports[] array.

11. Add the `<USECASE-NAME>-<FORM-NAME>` selector to the **app.component.html** `projects/xa-portal-dev/src/app/app.component.html`.

12. Update the imports of the mocks path in the **app.component.ts** `projects/xa-portal-dev/src/app/app.component.ts`.

13. Follow the steps from the section: [#package-json](#packagejson)

14. Follow the steps from the section: [#update budget](#update-budget)

15. Follow the steps from the section: [#workaround for undefined XAServices](#workaround-for-undefined-xaservices)


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
