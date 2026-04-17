import { test, assert, assertEqual, installFakeTimers } from './helpers';
import { TypeawayComponent } from '../../src/app/kree/typeaway/typeaway.component';

test('Typeaway: types text one character at a time', () => {
  const timers = installFakeTimers();
  const c = new TypeawayComponent();
  c.text = 'Hi';
  c.ngOnInit();
  timers.advance(2000);
  assertEqual(c.label, 'H');
  timers.advance(100);
  assertEqual(c.label, 'Hi');
  c.ngOnDestroy();
  timers.uninstall();
});

test('Typeaway: emits finished when text is fully typed', () => {
  const timers = installFakeTimers();
  const c = new TypeawayComponent();
  c.text = 'Ok';
  let done = false;
  c.finished.subscribe(() => { done = true; });
  c.ngOnInit();
  timers.runAll();
  assertEqual(done, true);
  timers.uninstall();
});

test('Typeaway: comma triggers an 8× delay before the next character', () => {
  const timers = installFakeTimers();
  const c = new TypeawayComponent();
  c.text = 'a,b';
  c.ngOnInit();
  timers.advance(2000); // startInterval → first char
  assertEqual(c.label, 'a');
  timers.advance(100);
  assertEqual(c.label, 'a,');
  // after a comma, next delay is 800ms, so 100ms is not enough
  timers.advance(100);
  assertEqual(c.label, 'a,');
  timers.advance(700);
  assertEqual(c.label, 'a,b');
  c.ngOnDestroy();
  timers.uninstall();
});

test('Typeaway: default text is used when none provided', () => {
  const timers = installFakeTimers();
  const c = new TypeawayComponent();
  assertEqual(c.text, 'At this moment, I pledge');
  timers.uninstall();
});

test('Typeaway: ngOnDestroy cancels typing', () => {
  const timers = installFakeTimers();
  const c = new TypeawayComponent();
  c.text = 'abc';
  c.ngOnInit();
  c.ngOnDestroy();
  timers.advance(10000);
  assertEqual(c.label, '');
  timers.uninstall();
});
