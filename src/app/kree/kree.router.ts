import { RouterModule, Route } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { KreeComponent } from './kree.component';

const routes: Route[] = [
  {
    path: '',
    component: KreeComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
