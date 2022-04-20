import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { SapApplicationRundownUTNasOfflineAppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(SapApplicationRundownUTNasOfflineAppModule)
  .catch(err => console.error(err));
