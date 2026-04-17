import { test, assertEqual, installFakeTimers } from './helpers';
import { DropBombComponent } from '../../src/app/kree/drop-bomb/drop-bomb.component';

test('DropBomb: sets label to full text on first drop then emits finished', () => {
  const timers = installFakeTimers();
  const c = new DropBombComponent();
  c.text = 'TO DO';
  let done = false;
  c.finished.subscribe(() => { done = true; });
  c.ngOnInit();
  timers.advance(2000);             // startInterval → first drop, label = text
  assertEqual(c.label, 'TO DO');
  assertEqual(done, false);
  timers.advance(1500);             // second drop, label already equals text → emit
  assertEqual(done, true);
  c.ngOnDestroy();
  timers.uninstall();
});

test('DropBomb: ngOnDestroy cancels the pending drop', () => {
  const timers = installFakeTimers();
  const c = new DropBombComponent();
  c.text = 'TO DO';
  c.ngOnInit();
  c.ngOnDestroy();
  timers.advance(5000);
  assertEqual(c.label, '');
  timers.uninstall();
});
