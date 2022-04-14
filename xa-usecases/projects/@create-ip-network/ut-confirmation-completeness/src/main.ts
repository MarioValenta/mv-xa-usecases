import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CreateIPNetworkUTConfirmationCompletenessAppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(CreateIPNetworkUTConfirmationCompletenessAppModule)
  .catch(err => console.error(err));
