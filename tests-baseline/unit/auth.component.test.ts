import { test, assert, assertEqual } from './helpers';
import { AuthComponent } from '../../src/app/kree/auth/auth.component';

function makeAuth() {
  return {
    checkUser: async (_id: string) => false,
    login: async (_id: string, _pw: string) => ({ success: false, message: 'Wrong password' }),
    signup: async (_data: any) => true,
  };
}

function makeRouter() {
  const navigated: any[] = [];
  return {
    navigate: (cmds: any[]) => { navigated.push(cmds); return Promise.resolve(true); },
    _navigated: navigated,
  };
}

test('Auth: defaults to identifier step', () => {
  const c = new AuthComponent(makeAuth() as any, makeRouter() as any);
  assertEqual(c.step, 'identifier');
  assertEqual(c.identifier, '');
  assertEqual(c.password, '');
  assertEqual(c.locked, false);
  assertEqual(c.attempts, 0);
});

test('Auth: detectType sets email for addresses with @', () => {
  const c = new AuthComponent(makeAuth() as any, makeRouter() as any);
  c.identifier = 'user@example.com';
  c.detectType();
  assertEqual(c.identifierType, 'email');
});

test('Auth: detectType sets phone for numeric input', () => {
  const c = new AuthComponent(makeAuth() as any, makeRouter() as any);
  c.identifier = '9876543210';
  c.detectType();
  assertEqual(c.identifierType, 'phone');
});

test('Auth: detectType sets empty for blank input', () => {
  const c = new AuthComponent(makeAuth() as any, makeRouter() as any);
  c.identifier = '';
  c.detectType();
  assertEqual(c.identifierType, '');
});

test('Auth: identifierValid returns true for valid email', () => {
  const c = new AuthComponent(makeAuth() as any, makeRouter() as any);
  c.identifier = 'user@example.com';
  c.identifierType = 'email';
  assertEqual(c.identifierValid, true);
});

test('Auth: identifierValid returns false for invalid email', () => {
  const c = new AuthComponent(makeAuth() as any, makeRouter() as any);
  c.identifier = 'notanemail';
  c.identifierType = 'email';
  assertEqual(c.identifierValid, false);
});

test('Auth: identifierValid returns true for valid phone', () => {
  const c = new AuthComponent(makeAuth() as any, makeRouter() as any);
  c.identifier = '9876543210';
  c.identifierType = 'phone';
  assertEqual(c.identifierValid, true);
});

test('Auth: identifierValid returns false for short phone', () => {
  const c = new AuthComponent(makeAuth() as any, makeRouter() as any);
  c.identifier = '123';
  c.identifierType = 'phone';
  assertEqual(c.identifierValid, false);
});

test('Auth: passwordValid requires minimum 6 characters', () => {
  const c = new AuthComponent(makeAuth() as any, makeRouter() as any);
  c.password = '12345';
  assertEqual(c.passwordValid, false);
  c.password = '123456';
  assertEqual(c.passwordValid, true);
});

test('Auth: goBack resets to identifier step', () => {
  const c = new AuthComponent(makeAuth() as any, makeRouter() as any);
  c.step = 'login-password';
  c.password = 'secret';
  c.attempts = 2;
  c.locked = true;
  c.errorMsg = 'something';
  c.goBack();
  assertEqual(c.step, 'identifier');
  assertEqual(c.password, '');
  assertEqual(c.attempts, 0);
  assertEqual(c.locked, false);
  assertEqual(c.errorMsg, '');
});

test('Auth: onIdentifierSubmit moves to signup-password when user not found', async () => {
  const auth = makeAuth();
  auth.checkUser = async () => false;
  const c = new AuthComponent(auth as any, makeRouter() as any);
  c.identifier = 'new@user.com';
  c.identifierType = 'email';
  await c.onIdentifierSubmit();
  assertEqual(c.step, 'signup-password');
});

test('Auth: onIdentifierSubmit moves to login-password when user exists', async () => {
  const auth = makeAuth();
  auth.checkUser = async () => true;
  const c = new AuthComponent(auth as any, makeRouter() as any);
  c.identifier = 'existing@user.com';
  c.identifierType = 'email';
  await c.onIdentifierSubmit();
  assertEqual(c.step, 'login-password');
});

test('Auth: onLoginSubmit navigates to dashboard on success', async () => {
  const auth = makeAuth();
  auth.login = async () => ({ success: true });
  const router = makeRouter();
  const c = new AuthComponent(auth as any, router as any);
  c.step = 'login-password';
  c.password = 'correct';
  c.identifier = 'user@test.com';
  c.identifierType = 'email';
  await c.onLoginSubmit();
  assertEqual(router._navigated.length, 1);
  assertEqual(router._navigated[0][0], '/dashboard');
});

test('Auth: onLoginSubmit increments attempts on wrong password', async () => {
  const auth = makeAuth();
  auth.login = async () => ({ success: false, message: 'Wrong password' });
  const c = new AuthComponent(auth as any, makeRouter() as any);
  c.step = 'login-password';
  c.password = 'wrongp';
  c.identifier = 'user@test.com';
  c.identifierType = 'email';
  c.loading = false;
  c.locked = false;
  await c.onLoginSubmit();
  assertEqual(c.attempts, 1);
  assert(c.errorMsg.includes('2'), 'should show remaining attempts');
});

test('Auth: locks after 3 failed attempts', async () => {
  const auth = makeAuth();
  auth.login = async () => ({ success: false, message: 'Wrong password' });
  const c = new AuthComponent(auth as any, makeRouter() as any);
  c.step = 'login-password';
  c.password = 'wrongp';
  c.identifier = 'user@test.com';
  c.identifierType = 'email';
  c.loading = false;
  c.locked = false;
  await c.onLoginSubmit();
  c.loading = false;
  await c.onLoginSubmit();
  c.loading = false;
  await c.onLoginSubmit();
  assertEqual(c.locked, true);
  assertEqual(c.attempts, 3);
  assert(c.errorMsg.includes('Too many'), 'should show lockout message');
});

test('Auth: onSignupSubmit navigates to dashboard on success', async () => {
  const auth = makeAuth();
  auth.signup = async () => true;
  const router = makeRouter();
  const c = new AuthComponent(auth as any, router as any);
  c.step = 'signup-password';
  c.password = 'newpass';
  c.identifier = 'new@user.com';
  c.identifierType = 'email';
  await c.onSignupSubmit();
  assertEqual(router._navigated.length, 1);
  assertEqual(router._navigated[0][0], '/dashboard');
});

test('Auth: displayIdentifier includes country code for phone type', () => {
  const c = new AuthComponent(makeAuth() as any, makeRouter() as any);
  c.identifier = '9876543210';
  c.identifierType = 'phone';
  c.selectedCountry = { code: '+91', flag: 'IN', name: 'India' };
  assert(c.displayIdentifier.includes('+91'), 'should include country code');
});

test('Auth: country picker has at least 10 countries', () => {
  const c = new AuthComponent(makeAuth() as any, makeRouter() as any);
  assert(c.countries.length >= 10, 'should have many country options');
});
