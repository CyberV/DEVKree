import { test, assert, assertEqual } from './helpers';
import { PledgePageComponent } from '../../src/app/kree/pledge-page/pledge-page.component';

function makeMocks() {
  const navigated: any[] = [];
  const location = { back: () => { (location as any).wentBack = true; }, wentBack: false };
  const router = {
    navigate: (cmds: any[]) => { navigated.push(cmds); return Promise.resolve(true); },
    _navigated: navigated,
  };
  return { location, router };
}

test('PledgePage: defaults pledgeComplete to false', () => {
  const { location, router } = makeMocks();
  const c = new PledgePageComponent(location as any, router as any);
  assertEqual(c.pledgeComplete, false);
});

test('PledgePage: onPledgeDone sets pledgeComplete', () => {
  const { location, router } = makeMocks();
  const c = new PledgePageComponent(location as any, router as any);
  c.onPledgeDone();
  assertEqual(c.pledgeComplete, true);
});

test('PledgePage: goBack calls location.back()', () => {
  const { location, router } = makeMocks();
  const c = new PledgePageComponent(location as any, router as any);
  c.goBack();
  assertEqual(location.wentBack, true);
});

test('PledgePage: goToAuth navigates to /auth', () => {
  const { location, router } = makeMocks();
  const c = new PledgePageComponent(location as any, router as any);
  c.goToAuth();
  assertEqual(router._navigated.length, 1);
  assertEqual(router._navigated[0][0], '/auth');
});
