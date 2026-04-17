import { test, assert, assertEqual, installFakeTimers } from './helpers';
import { QuestionComponent } from '../../src/app/kree/question/question.component';

test('Question: types out q one character at a time', () => {
  const timers = installFakeTimers();
  const c = new QuestionComponent();
  c.q = 'Hi';
  c.answer = 'Y';
  c.ngOnInit();

  timers.advance(1000);                 // startInterval
  assertEqual(c.label, 'H');
  timers.advance(100);                  // typeInterval
  assertEqual(c.label, 'Hi');
  c.ngOnDestroy();
  timers.uninstall();
});

test('Question: pulses three question marks after typing', () => {
  const timers = installFakeTimers();
  const c = new QuestionComponent();
  c.q = 'Hi';
  c.answer = 'Y';
  c.ngOnInit();
  timers.advance(1000);
  timers.advance(100);
  // First toggle: append "?"
  timers.advance(100);                  // triggers toggleQuestionMark
  // Walk the 3 toggle cycles
  timers.advance(500);
  timers.advance(500);
  timers.advance(500);
  timers.advance(500);
  timers.advance(500);
  timers.advance(500);
  assertEqual(c.showAnswer, true);
  c.ngOnDestroy();
  timers.uninstall();
});

test('Question: auto-emits answered after full pulse + prompt + 1.5s', () => {
  const timers = installFakeTimers();
  const c = new QuestionComponent();
  c.q = 'A';
  c.answer = 'B';
  c.ngOnInit();
  let fired: boolean | undefined;
  c.answered.subscribe((v: boolean) => { fired = v; });
  timers.runAll();
  assertEqual(fired, true);
  assertEqual(c.hasAnswered, true);
  timers.uninstall();
});

test('Question: manual onClick() short-circuits the auto-answer', () => {
  const timers = installFakeTimers();
  const c = new QuestionComponent();
  c.q = 'A';
  c.answer = 'B';
  c.ngOnInit();
  let count = 0;
  c.answered.subscribe(() => { count++; });
  c.onClick();
  assertEqual(c.hasAnswered, true);
  // A second click and the eventual auto-fire should both be ignored.
  c.onClick();
  timers.runAll();
  assertEqual(count, 1);
  timers.uninstall();
});
