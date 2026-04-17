import { test, assert, assertEqual, installFakeTimers } from './helpers';
import { DonationWizardComponent } from '../../src/app/kree/donation-wizard/donation-wizard.component';

test('Wizard: step 1 → choose "time" advances to step 2 with time options', () => {
  const c = new DonationWizardComponent();
  c.chooseKind('time');
  assertEqual(c.step, 2);
  assertEqual(c.kind, 'time');
  assertEqual(c.currentOptions, c.timeOptions);
});

test('Wizard: step 1 → choose "resources" advances to step 2 with resource options', () => {
  const c = new DonationWizardComponent();
  c.chooseKind('resources');
  assertEqual(c.step, 2);
  assertEqual(c.kind, 'resources');
  assertEqual(c.currentOptions, c.resourceOptions);
});

test('Wizard: chooseOption advances to confirm step', () => {
  const c = new DonationWizardComponent();
  c.chooseKind('time');
  c.chooseOption(c.timeOptions[0]);
  assertEqual(c.step, 3);
  assertEqual(c.selectedOption, c.timeOptions[0]);
});

test('Wizard: back() on step 3 returns to step 2 and clears selection', () => {
  const c = new DonationWizardComponent();
  c.chooseKind('time');
  c.chooseOption(c.timeOptions[1]);
  c.back();
  assertEqual(c.step, 2);
  assertEqual(c.selectedOption, null);
});

test('Wizard: back() on step 2 returns to step 1 and clears kind', () => {
  const c = new DonationWizardComponent();
  c.chooseKind('resources');
  c.back();
  assertEqual(c.step, 1);
  assertEqual(c.kind, null);
});

test('Wizard: back() on step 1 is a no-op', () => {
  const c = new DonationWizardComponent();
  c.back();
  assertEqual(c.step, 1);
});

test('Wizard: confirm() emits a DonationChoice for time', () => {
  const c = new DonationWizardComponent();
  let captured: any = null;
  c.finished.subscribe((v: any) => { captured = v; });
  c.chooseKind('time');
  c.chooseOption(c.timeOptions[2]);
  c.confirm();
  assert(captured);
  assertEqual(captured.kind, 'time');
  assertEqual(captured.option, c.timeOptions[2].label);
});

test('Wizard: confirm() emits a DonationChoice for resources', () => {
  const c = new DonationWizardComponent();
  let captured: any = null;
  c.finished.subscribe((v: any) => { captured = v; });
  c.chooseKind('resources');
  c.chooseOption(c.resourceOptions[3]);
  c.confirm();
  assert(captured);
  assertEqual(captured.kind, 'resources');
  assertEqual(captured.option, c.resourceOptions[3].label);
});

test('Wizard: confirm() on step 1 is a no-op (no kind/option yet)', () => {
  const c = new DonationWizardComponent();
  let fired = false;
  c.finished.subscribe(() => { fired = true; });
  c.confirm();
  assertEqual(fired, false);
});

test('Wizard: currentOptions defaults to resource options when kind is null', () => {
  const c = new DonationWizardComponent();
  // kind starts as null → currentOptions should still return something
  assertEqual(c.currentOptions, c.resourceOptions);
});

test('Wizard: time and resource options are both non-empty', () => {
  const c = new DonationWizardComponent();
  assert(c.timeOptions.length >= 3);
  assert(c.resourceOptions.length >= 3);
});
