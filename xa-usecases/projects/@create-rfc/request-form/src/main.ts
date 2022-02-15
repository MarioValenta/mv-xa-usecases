import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CreateRfcRequestFormAppModule } from './app/app.module';
import { environment } from './environments/environment';

import {LicenseManager} from 'ag-grid-enterprise';
LicenseManager.setLicenseKey('CompanyName=T-Systems Austria GesmbH,LicensedGroup=ServiceAutomationPlattform,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=7,LicensedProductionInstancesCount=0,AssetReference=AG-013088,ExpiryDate=21_January_2022_[v2]_MTY0MjcyMzIwMDAwMA==6485b3b3b50740c96e6c4fa0aa65b73d');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(CreateRfcRequestFormAppModule)
  .catch(err => console.error(err));
