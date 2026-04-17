'use strict';

class HttpClient {
  post(url, body) {
    return { pipe: () => this, subscribe: () => {} };
  }
  get(url) {
    return { pipe: () => this, subscribe: () => {} };
  }
}

module.exports = {
  HttpClient,
  HttpClientModule: class HttpClientModule {},
  provideHttpClient: () => [],
};
