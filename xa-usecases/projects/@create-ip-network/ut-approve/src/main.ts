import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CreateIPNetworkUTApproveAppModule } from './app/app.module';
import { environment } from './environments/environment';

import {LicenseManager} from 'ag-grid-enterprise';
import { AG_GRID_LICENSE } from '@xa/grid';
LicenseManager.setLicenseKey(AG_GRID_LICENSE);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(CreateIPNetworkUTApproveAppModule)
  .catch(err => console.error(err));
