import { test, assert, assertEqual, installFakeTimers } from './helpers';
import { ThisMomentComponent } from '../../src/app/kree/this-moment/this-moment.component';

test('ThisMoment: sets isMobile=true when viewport is narrow', () => {
  const timers = installFakeTimers();
  const realW = (global as any).window.innerWidth;
  (global as any).window.innerWidth = 320;
  const c = new ThisMomentComponent();
  c.ngOnInit();
  assertEqual(c.isMobile, true);
  (global as any).window.innerWidth = realW;
  c.ngOnDestroy();
  timers.uninstall();
});

test('ThisMoment: leaves isMobile=false on a wide viewport', () => {
  const timers = installFakeTimers();
  (global as any).window.innerWidth = 1200;
  const c = new ThisMomentComponent();
  c.ngOnInit();
  assertEqual(c.isMobile, false);
  c.ngOnDestroy();
  timers.uninstall();
});

test('ThisMoment: isMobile is left alone when window.innerWidth is undefined', () => {
  const timers = installFakeTimers();
  const realWindow = (global as any).window;
  (global as any).window = undefined;
  const c = new ThisMomentComponent();
  c.ngOnInit();
  assertEqual(c.isMobile, false);
  c.ngOnDestroy();
  (global as any).window = realWindow;
  timers.uninstall();
});

test('ThisMoment: Pause → Take a breath → ready sequence advances on timers', () => {
  const timers = installFakeTimers();
  const c = new ThisMomentComponent();
  c.ngOnInit();

  assertEqual(c.begin, false);
  assertEqual(c.breathe, 'in');

  timers.advance(1500);
  assertEqual(c.begin, true);

  timers.advance(2000);
  assertEqual(c.paused, true);
  assertEqual(c.breathe, 'out');

  timers.advance(2000);
  assertEqual(c.ready, true);
  // Breathing continues (does not go to idle)
  assertEqual(c.breathe, 'in');
  c.ngOnDestroy();
  timers.uninstall();
});

test('ThisMoment: next() sets showCta=true and emits answered', () => {
  const timers = installFakeTimers();
  const c = new ThisMomentComponent();
  c.ngOnInit();
  let emitted: boolean | undefined;
  c.answered.subscribe((v: boolean) => { emitted = v; });
  c.next();
  assertEqual(c.showCta, true);
  assertEqual(emitted, true);
  c.ngOnDestroy();
  timers.uninstall();
});

test('ThisMoment: flow resets after 10 seconds of CTA visibility', () => {
  const timers = installFakeTimers();
  const c = new ThisMomentComponent();
  c.ngOnInit();

  // Advance to ready state
  timers.advance(5500);
  assertEqual(c.ready, true);

  // Trigger CTA
  c.next();
  assertEqual(c.showCta, true);

  // After 10 seconds, flow resets
  timers.advance(10000);
  assertEqual(c.showCta, false);
  assertEqual(c.ready, false);
  assertEqual(c.begin, false);
  assertEqual(c.breathe, 'in'); // restarted

  c.ngOnDestroy();
  timers.uninstall();
});

test('ThisMoment: ngOnDestroy clears pending timers without firing them', () => {
  const timers = installFakeTimers();
  const c = new ThisMomentComponent();
  c.ngOnInit();
  c.ngOnDestroy();
  timers.advance(10000);
  // If ngOnDestroy failed to clear, `begin`/`paused`/`ready` would flip.
  assertEqual(c.begin, false);
  assertEqual(c.paused, false);
  assertEqual(c.ready, false);
  timers.uninstall();
});
