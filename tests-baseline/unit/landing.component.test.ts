import { test, assert, assertEqual } from './helpers';
import { LandingComponent } from '../../src/app/kree/landing/landing.component';

test('Landing: defaults beginPledge to false', () => {
  const c = new LandingComponent();
  assertEqual(c.beginPledge, false);
});

test('Landing: onAnswered sets beginPledge', () => {
  const c = new LandingComponent();
  c.onAnswered(true);
  assertEqual(c.beginPledge, true);
});

test('Landing: toggleTheme flips the theme', () => {
  const c = new LandingComponent();
  c.ngOnInit();
  const before = c.theme();
  c.toggleTheme();
  const after = c.theme();
  assert(before !== after, 'theme should flip');
});
