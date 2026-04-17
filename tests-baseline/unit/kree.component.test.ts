import { test, assert, assertEqual } from './helpers';
import { KreeComponent } from '../../src/app/kree/kree.component';

test('Kree: root component instantiates and inits theme', () => {
  const c = new KreeComponent();
  c.ngOnInit();
  const v = c.theme();
  assert(v === 'dark' || v === 'light', 'theme must be dark or light');
});

test('Kree: toggleTheme() delegates to ThemeService', () => {
  const c = new KreeComponent();
  c.ngOnInit();
  const before = c.theme();
  c.toggleTheme();
  const after = c.theme();
  assert(before !== after, 'theme should have flipped');
});
