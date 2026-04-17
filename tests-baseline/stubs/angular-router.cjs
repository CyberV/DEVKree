'use strict';

class Router {
  constructor() { this.url = '/'; this._navigated = []; }
  navigate(commands) { this._navigated.push(commands); return Promise.resolve(true); }
  navigateByUrl(url) { this.url = url; return Promise.resolve(true); }
}

const RouterModule = class RouterModule {};
const RouterOutlet = class RouterOutlet {};

module.exports = {
  Router,
  RouterModule,
  RouterOutlet,
  provideRouter: () => [],
  Routes: {},
};
