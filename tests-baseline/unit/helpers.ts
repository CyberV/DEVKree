// Test helpers shared by every unit test file.
//
// `test()` is a minimal wrapper around the registry installed on
// `global.__registerTest` by unit-runner.cjs. Tests run sequentially
// and can await promises (for the `setTimeout` chains inside Kree
// components we use `flushTimers`).

declare const __registerTest: (name: string, fn: () => void | Promise<void>) => void;

export function test(name: string, fn: () => void | Promise<void>): void {
  __registerTest(name, fn);
}

export function assert(cond: any, msg = 'assertion failed'): void {
  if (!cond) {
    throw new Error(msg);
  }
}

export function assertEqual<T>(actual: T, expected: T, msg?: string): void {
  if (actual !== expected) {
    throw new Error(
      `${msg || 'values differ'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

/** Fast-forward pending setTimeout chains. We replace real timers
 *  with a deterministic fake so tests don't sleep for real seconds. */
export function installFakeTimers() {
  const queue: Array<{ id: number; when: number; fn: () => void }> = [];
  let now = 0;
  let nextId = 1;
  const realSetTimeout = global.setTimeout;
  const realClearTimeout = global.clearTimeout;

  (global as any).setTimeout = (fn: () => void, ms: number) => {
    const id = nextId++;
    queue.push({ id, when: now + (ms || 0), fn });
    queue.sort((a, b) => a.when - b.when);
    return id as any;
  };
  (global as any).clearTimeout = (id: number) => {
    const idx = queue.findIndex((q) => q.id === id);
    if (idx >= 0) queue.splice(idx, 1);
  };
  (global as any).setInterval = (global as any).setTimeout;
  (global as any).clearInterval = (global as any).clearTimeout;

  return {
    advance(ms: number) {
      const target = now + ms;
      while (queue.length && queue[0].when <= target) {
        const item = queue.shift()!;
        now = item.when;
        item.fn();
      }
      now = target;
    },
    runAll(maxSteps = 10000) {
      let steps = 0;
      while (queue.length && steps < maxSteps) {
        const item = queue.shift()!;
        now = item.when;
        item.fn();
        steps++;
      }
      if (queue.length) {
        throw new Error('fake-timer queue did not drain');
      }
    },
    queue,
    uninstall() {
      (global as any).setTimeout = realSetTimeout;
      (global as any).clearTimeout = realClearTimeout;
    },
  };
}
