import { test, assertEqual, installFakeTimers } from './helpers';
import { PledgeComponent } from '../../src/app/kree/pledge/pledge.component';

test('Pledge: all gate flags default to false', () => {
  const c = new PledgeComponent();
  assertEqual(c.hasName, false);
  assertEqual(c.drop, false);
  assertEqual(c.good, false);
  assertEqual(c.great, false);
  assertEqual(c.because, false);
  assertEqual(c.ican, false);
  assertEqual(c.iwant, false);
  assertEqual(c.ineed, false);
});

test('Pledge: onGoodDone sets great=true after 800ms delay', () => {
  const timers = installFakeTimers();
  const c = new PledgeComponent();
  c.onGoodDone();
  assertEqual(c.great, false);
  timers.advance(800);
  assertEqual(c.great, true);
  timers.uninstall();
});

test('Pledge: onFinalLine sets ineed and emits pledgeDone after 3s', () => {
  const timers = installFakeTimers();
  const c = new PledgeComponent();
  let done = false;
  c.pledgeDone.subscribe(() => { done = true; });
  c.onFinalLine();
  assertEqual(c.ineed, true);
  assertEqual(done, false);
  timers.advance(3000);
  assertEqual(done, true);
  timers.uninstall();
});
