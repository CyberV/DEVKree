import { test, assert, assertEqual, installFakeTimers } from './helpers';
import { YourNameComponent } from '../../src/app/kree/your-name/your-name.component';

function makeElementRef() {
  const fakeInput = { focus: () => { (fakeInput as any).focused = true; } };
  return {
    nativeElement: {
      querySelector: (sel: string) => (sel === '.yourName' ? fakeInput : null),
    },
    _input: fakeInput,
  };
}

test('YourName: cycles through every "I"-script and then shows the input', () => {
  const timers = installFakeTimers();
  const el = makeElementRef();
  const c = new YourNameComponent(el as any);
  c.ngOnInit();
  // Each letter takes two 1-second beats; there are 5 letters.
  timers.advance(500);           // initial delay -> first nextMeText()
  for (let i = 0; i < 5; i++) {
    timers.advance(1000);        // enter -> exit flip
    timers.advance(1000);        // exit -> next call
  }
  timers.advance(500);           // inputVisible gate
  timers.advance(1000);          // focus callback
  assertEqual(c.inputVisible, true);
  assertEqual(c.inputWidth, 300);
  assertEqual(c.currentMe, c.mes.length - 1);
  assertEqual((el._input as any).focused, true);
  c.ngOnDestroy();
  timers.uninstall();
});

test('YourName: moveOn() sets hasName=true and starts typeaway for "am here now"', () => {
  const timers = installFakeTimers();
  const c = new YourNameComponent(makeElementRef() as any);
  let emitCount = 0;
  c.answered.subscribe(() => { emitCount++; });
  c.moveOn();
  assertEqual(c.hasName, true);
  assertEqual(c.showAmHereNow, true);
  // Type "am here now." (12 chars) at 100ms each + 500ms initial delay + 500ms after done
  timers.advance(500);  // initial delay before typing
  timers.advance(1200); // 12 chars at 100ms
  timers.advance(500);  // delay after done
  assertEqual(emitCount, 1);
  // calling moveOn again should be idempotent
  c.moveOn();
  assertEqual(emitCount, 1);
  timers.uninstall();
});

test('YourName: checkName(key) schedules moveOn() when name settles', () => {
  const timers = installFakeTimers();
  const c = new YourNameComponent(makeElementRef() as any);
  c.name = 'Ada';
  c.checkName(new (globalThis as any).Object() as any);
  timers.advance(3000);
  assertEqual(c.hasName, true);
  timers.uninstall();
});

test('YourName: checkName(key) does NOT fire when the name keeps changing', () => {
  const timers = installFakeTimers();
  const c = new YourNameComponent(makeElementRef() as any);
  c.name = 'Ad';
  c.checkName({} as any);
  c.name = 'Ada'; // user is still typing
  timers.advance(3000);
  assertEqual(c.hasName, false);
  timers.uninstall();
});

test('YourName: checkName() ignores an empty value', () => {
  const timers = installFakeTimers();
  const c = new YourNameComponent(makeElementRef() as any);
  c.name = '';
  c.checkName({} as any);
  timers.advance(3000);
  assertEqual(c.hasName, false);
  timers.uninstall();
});

test('YourName: onNameInput resizes input based on name length', () => {
  const timers = installFakeTimers();
  const c = new YourNameComponent(makeElementRef() as any);
  c.name = 'Ada Lovelace';
  c.onNameInput();
  assert(c.inputWidth > 60, 'input width should grow with name');
  assert(c.inputWidth <= 500, 'input width should cap at 500');
  timers.uninstall();
});

test('YourName: empty name resets input width to 300', () => {
  const timers = installFakeTimers();
  const c = new YourNameComponent(makeElementRef() as any);
  c.name = '';
  c.onNameInput();
  assertEqual(c.inputWidth, 300);
  timers.uninstall();
});

test('YourName: ngOnDestroy clears pending timers', () => {
  const timers = installFakeTimers();
  const c = new YourNameComponent(makeElementRef() as any);
  c.ngOnInit();
  c.ngOnDestroy();
  timers.advance(10000);
  assertEqual(c.currentMe, -1);
  timers.uninstall();
});
