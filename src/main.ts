import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { KreeModule } from './app/kree/kree.module';

  //enableProdMode();


platformBrowserDynamic().bootstrapModule(KreeModule);
