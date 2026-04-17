import { test, assert, assertEqual } from './helpers';
import { DashboardComponent } from '../../src/app/kree/dashboard/dashboard.component';
import { DashboardHomeComponent } from '../../src/app/kree/dashboard/dashboard-home.component';
import { MissionsComponent } from '../../src/app/kree/dashboard/missions.component';
import { ImpactComponent } from '../../src/app/kree/dashboard/impact.component';
import { LeaderboardComponent } from '../../src/app/kree/dashboard/leaderboard.component';

test('Dashboard: has 4 nav items', () => {
  const c = new DashboardComponent();
  assertEqual(c.navItems.length, 4);
  assertEqual(c.navItems[0].label, 'Dashboard');
  assertEqual(c.navItems[1].label, 'Missions');
  assertEqual(c.navItems[2].label, 'Impact');
  assertEqual(c.navItems[3].label, 'Leaderboard');
});

test('Dashboard: nav items have icons', () => {
  const c = new DashboardComponent();
  for (const item of c.navItems) {
    assert(item.icon.startsWith('fa-'), `icon should start with fa-: ${item.icon}`);
  }
});

test('Dashboard: nav items have routes', () => {
  const c = new DashboardComponent();
  assertEqual(c.navItems[0].route, '/dashboard');
  assertEqual(c.navItems[1].route, '/dashboard/missions');
  assertEqual(c.navItems[2].route, '/dashboard/impact');
  assertEqual(c.navItems[3].route, '/dashboard/leaderboard');
});

test('DashboardHome: component instantiates', () => {
  const c = new DashboardHomeComponent();
  assert(c !== null, 'should instantiate');
});

test('Missions: has missions data', () => {
  const c = new MissionsComponent();
  assert(c.missions.length > 0, 'should have missions');
  for (const m of c.missions) {
    assert(m.title.length > 0, 'mission should have title');
    assert(m.points > 0, 'mission should have points');
  }
});

test('Impact: has impact categories', () => {
  const c = new ImpactComponent();
  assert(c.categories.length > 0, 'should have categories');
  assert(c.stories.length > 0, 'should have stories');
});

test('Leaderboard: has leaderboard data', () => {
  const c = new LeaderboardComponent();
  assert(c.topThree.length === 3, 'should have top 3');
  assert(c.leaderboard.length > 0, 'should have leaderboard entries');
  const you = c.leaderboard.find(e => e.isYou);
  assert(you !== undefined, 'should have a "you" entry');
});
