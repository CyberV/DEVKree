import { test, assert, assertEqual } from './helpers';
import { ThemeService } from '../../src/app/kree/services/theme.service';

test('ThemeService: starts dark when no system preference and no stored value', () => {
  (global as any).localStorage.clear();
  (global as any).window.matchMedia = () => ({ matches: false });
  const svc = new ThemeService();
  svc.init();
  assertEqual(svc.theme(), 'dark');
  assertEqual((global as any).__attrs.get('data-theme'), 'dark');
});

test('ThemeService: starts light when system prefers light and no stored value', () => {
  (global as any).localStorage.clear();
  (global as any).window.matchMedia = (q: string) =>
    q.includes('light') ? { matches: true } : { matches: false };
  const svc = new ThemeService();
  svc.init();
  assertEqual(svc.theme(), 'light');
});

test('ThemeService: respects a previously-stored light preference', () => {
  (global as any).localStorage.setItem('kree.theme', 'light');
  const svc = new ThemeService();
  svc.init();
  assertEqual(svc.theme(), 'light');
});

test('ThemeService: respects a previously-stored dark preference', () => {
  (global as any).localStorage.setItem('kree.theme', 'dark');
  const svc = new ThemeService();
  svc.init();
  assertEqual(svc.theme(), 'dark');
});

test('ThemeService: ignores a garbage stored value', () => {
  (global as any).localStorage.setItem('kree.theme', 'chartreuse');
  (global as any).window.matchMedia = () => ({ matches: false });
  const svc = new ThemeService();
  svc.init();
  assertEqual(svc.theme(), 'dark');
});

test('ThemeService: toggle flips dark→light and persists', () => {
  (global as any).localStorage.clear();
  const svc = new ThemeService();
  svc.init();
  svc.toggle();
  assertEqual(svc.theme(), 'light');
  assertEqual((global as any).localStorage.getItem('kree.theme'), 'light');
});

test('ThemeService: toggle flips light→dark', () => {
  (global as any).localStorage.setItem('kree.theme', 'light');
  const svc = new ThemeService();
  svc.init();
  svc.toggle();
  assertEqual(svc.theme(), 'dark');
});

test('ThemeService: set() applies mode directly', () => {
  const svc = new ThemeService();
  svc.set('light');
  assertEqual(svc.theme(), 'light');
  svc.set('dark');
  assertEqual(svc.theme(), 'dark');
});

test('ThemeService: set() survives localStorage exceptions', () => {
  const origLS = (global as any).localStorage;
  (global as any).localStorage = {
    getItem: () => { throw new Error('boom'); },
    setItem: () => { throw new Error('boom'); },
  };
  const svc = new ThemeService();
  svc.init(); // readStored() throws → falls through to matchMedia/default
  svc.set('light');
  assertEqual(svc.theme(), 'light');
  (global as any).localStorage = origLS;
});

test('ThemeService: init() survives when window is missing matchMedia', () => {
  const realWindow = (global as any).window;
  (global as any).window = {};
  (global as any).localStorage.clear();
  const svc = new ThemeService();
  svc.init();
  assertEqual(svc.theme(), 'dark');
  (global as any).window = realWindow;
});
