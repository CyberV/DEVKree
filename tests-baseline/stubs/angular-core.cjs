// Minimal stubs for @angular/core so that Kree component classes can
// be loaded in plain Node for coverage testing. Decorators are no-ops
// (the class body itself is what we care about); `signal`, `inject`,
// `EventEmitter`, and `ElementRef` have just enough behaviour to let
// the component methods run end-to-end.

'use strict';

class EventEmitter {
  constructor() {
    this._listeners = [];
  }
  emit(value) {
    for (const l of this._listeners) l(value);
  }
  subscribe(fn) {
    this._listeners.push(fn);
    return { unsubscribe: () => {} };
  }
}

class ElementRef {
  constructor(nativeElement) {
    this.nativeElement = nativeElement || {
      querySelector: () => null,
      getElementsByClassName: () => [],
    };
  }
}

const Component = (_config) => (cls) => cls;
const Injectable = (_config) => (cls) => cls;
const NgModule = (_config) => (cls) => cls;
const Directive = (_config) => (cls) => cls;
const Pipe = (_config) => (cls) => cls;
const HostBinding = (_name) => (_target, _key) => undefined;
const HostListener = (_name, _args) => (_target, _key, _desc) => undefined;
const Input = (_cfg) => (_target, _key) => undefined;
const Output = (_cfg) => (_target, _key) => undefined;
const ViewChild = (_selector, _opts) => (_target, _key) => undefined;
const ContentChild = (_selector, _opts) => (_target, _key) => undefined;

const testRegistry = new Map();
function __setInjected(token, instance) {
  testRegistry.set(token, instance);
}
function __clearInjected() {
  testRegistry.clear();
}
function inject(token) {
  if (testRegistry.has(token)) return testRegistry.get(token);
  if (typeof token === 'function') {
    const inst = new token();
    testRegistry.set(token, inst);
    return inst;
  }
  return undefined;
}

function signal(initial) {
  let value = initial;
  const fn = function () { return value; };
  fn.set = (v) => { value = v; };
  fn.update = (u) => { value = u(value); };
  return fn;
}

function computed(producer) {
  return function () { return producer(); };
}

function effect(_fn) {
  return { destroy: () => {} };
}

function importProvidersFrom() { return []; }

module.exports = {
  Component,
  Injectable,
  NgModule,
  Directive,
  Pipe,
  HostBinding,
  HostListener,
  Input,
  Output,
  ViewChild,
  ContentChild,
  EventEmitter,
  ElementRef,
  inject,
  signal,
  computed,
  effect,
  importProvidersFrom,
  __setInjected,
  __clearInjected,
};
